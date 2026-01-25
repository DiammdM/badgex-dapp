"server only";

import { prisma } from "@src/lib/prisma";
import {
  BadgeConfig,
  BadgeDetailRecord,
  BadgeExploreRecord,
  BadgeExploreStats,
  BadgeMarketRecord,
  BadgeListItem,
  BadgeRecordStatus,
  MarketPurchaseRecord,
  CreateBadgeInput,
  Metadata,
  MetaAttribute,
  BadgePropertyNames,
} from "@src/types/badge";
import { uploadBadgeImage, uploadBadgeMetadata } from "./ipfs";

const IPFS_PIC_PREFIX = process.env.IPFS_PIC_PREFIX ?? "";

const normalizeIpfsPrefix = (value: string) => {
  if (!value) return "";
  return value.endsWith("/") ? value : `${value}/`;
};

const getCidFromIpfsUrl = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("ipfs://")) {
    return trimmed.slice("ipfs://".length);
  }
  const parts = trimmed.split("/ipfs/");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return undefined;
};

const parsePriceValue = (value?: string | null) => {
  if (!value) return null;
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const normalizeTokenId = (value: string) => value.trim().replace(/^#/, "");

const matchesConfigFilters = (
  config: unknown,
  filters: {
    category?: string;
    theme?: string;
    shape?: string;
    icon?: string;
  }
) => {
  if (!filters.category && !filters.theme && !filters.shape && !filters.icon) {
    return true;
  }
  if (!config || typeof config !== "object") return false;
  const data = config as Record<string, unknown>;
  if (filters.category && data.Category !== filters.category) return false;
  if (filters.theme && data.Theme !== filters.theme) return false;
  if (filters.shape && data.Shape !== filters.shape) return false;
  if (filters.icon && data.Icon !== filters.icon) return false;
  return true;
};

const buildBadgeMetadata = (
  name: string,
  config: BadgeConfig,
  imageCid: string,
  description?: string
): Metadata => {
  const attributes: MetaAttribute[] = [
    { trait_type: BadgePropertyNames.Category, value: config.Category },
    { trait_type: BadgePropertyNames.Theme, value: config.Theme },
    { trait_type: BadgePropertyNames.Shape, value: config.Shape },
    { trait_type: BadgePropertyNames.Border, value: config.Border },
    { trait_type: BadgePropertyNames.Icon, value: config.Icon },
    { trait_type: BadgePropertyNames.Text, value: config.Text },
  ];

  const metadata: Metadata = {
    name,
    image: `ipfs://${imageCid}`,
    attributes,
  };
  if (description) {
    metadata.description = description;
  }
  return metadata;
};

export const listBadgesForUser = async (
  userId: string
): Promise<BadgeListItem[]> => {
  const records = await prisma.badgeRecord.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      status: true,
      config: true,
      imageCid: true,
      metadataCid: true,
      tokenUri: true,
      tokenId: true,
      listingId: true,
      price: true,
      ipfsUrl: true,
      updatedAt: true,
    },
  });

  const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);

  return records.map((record) => {
    const imageCid = record.imageCid ?? getCidFromIpfsUrl(record.ipfsUrl);
    const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;
    return {
      ...record,
      status: record.status as BadgeRecordStatus,
      updatedAt: record.updatedAt.toISOString(),
      imageUrl,
    };
  });
};

const buildExploreStats = async ({
  search,
  category,
  theme,
  shape,
  icon,
}: {
  search?: string;
  category?: string;
  theme?: string;
  shape?: string;
  icon?: string;
}): Promise<BadgeExploreStats> => {
  const where = {
    status: {
      in: [BadgeRecordStatus.Minted, BadgeRecordStatus.Listed],
    },
    AND: search
      ? [
          {
            OR: [
              { name: { contains: search } },
              { tokenId: { contains: search } },
            ],
          },
        ]
      : undefined,
  };

  const records = await prisma.badgeRecord.findMany({
    where,
    select: {
      userId: true,
      status: true,
      price: true,
      updatedAt: true,
      config: true,
    },
  });

  const filtered = records.filter((record) =>
    matchesConfigFilters(record.config, { category, theme, shape, icon })
  );

  let floorPrice: { value: number; raw: string } | null = null;
  let latestMint = 0;
  const owners = new Set<string>();

  filtered.forEach((record) => {
    owners.add(record.userId);
    if (record.status === BadgeRecordStatus.Listed) {
      const parsed = parsePriceValue(record.price);
      if (parsed !== null && record.price) {
        if (!floorPrice || parsed < floorPrice.value) {
          floorPrice = { value: parsed, raw: record.price };
        }
      }
    }
    const timestamp = record.updatedAt.getTime();
    if (timestamp > latestMint) {
      latestMint = timestamp;
    }
  });

  return {
    mintedSupply: filtered.length,
    uniqueOwners: owners.size,
    floorPrice: floorPrice ? floorPrice.raw : null,
    latestMint: latestMint ? new Date(latestMint).toISOString() : null,
  };
};

export const listExploreBadges = async ({
  limit,
  offset,
  search,
  category,
  theme,
  shape,
  icon,
}: {
  limit: number;
  offset: number;
  search?: string;
  category?: string;
  theme?: string;
  shape?: string;
  icon?: string;
}): Promise<{
  badges: BadgeExploreRecord[];
  hasMore: boolean;
  nextOffset: number;
  stats: BadgeExploreStats;
}> => {
  const where = {
    status: {
      in: [BadgeRecordStatus.Minted, BadgeRecordStatus.Listed],
    },
    AND: search
      ? [
          {
            OR: [
              { name: { contains: search } },
              { tokenId: { contains: search } },
            ],
          },
        ]
      : undefined,
  };

  const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);
  const stats = await buildExploreStats({
    search,
    category,
    theme,
    shape,
    icon,
  });
  const chunkSize = Math.max(limit * 2, 20);
  let scanOffset = offset;
  let hasMore = true;
  let reachedLimit = false;
  const matches: BadgeExploreRecord[] = [];

  while (matches.length < limit) {
    const records = await prisma.badgeRecord.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip: scanOffset,
      take: chunkSize,
      select: {
        id: true,
        name: true,
        userId: true,
        status: true,
        config: true,
        tokenId: true,
        price: true,
        imageCid: true,
        ipfsUrl: true,
        updatedAt: true,
      },
    });

    if (records.length === 0) {
      hasMore = false;
      break;
    }

    let consumed = 0;
    for (const record of records) {
      consumed += 1;
      if (
        !matchesConfigFilters(record.config, { category, theme, shape, icon })
      ) {
        continue;
      }
      const imageCid = record.imageCid ?? getCidFromIpfsUrl(record.ipfsUrl);
      const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;
      matches.push({
        id: record.id,
        name: record.name,
        owner: record.userId,
        status: record.status as BadgeRecordStatus,
        config: record.config as Partial<BadgeConfig> | null,
        tokenId: record.tokenId,
        price: record.price,
        imageUrl,
        updatedAt: record.updatedAt.toISOString(),
      });
      if (matches.length >= limit) {
        scanOffset += consumed;
        hasMore = consumed < records.length || records.length === chunkSize;
        reachedLimit = true;
        break;
      }
    }

    if (reachedLimit) {
      break;
    }

    scanOffset += records.length;
    if (records.length < chunkSize) {
      hasMore = false;
      break;
    }
  }

  return {
    badges: matches,
    hasMore,
    nextOffset: scanOffset,
    stats,
  };
};

export const listMarketBadges = async ({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}): Promise<{
  badges: BadgeMarketRecord[];
  hasMore: boolean;
  nextOffset: number;
}> => {
  const where = {
    status: BadgeRecordStatus.Listed,
    AND: search
      ? [
          {
            OR: [
              { name: { contains: search } },
              { tokenId: { contains: search } },
            ],
          },
        ]
      : undefined,
  };

  const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);
  const records = await prisma.badgeRecord.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
    skip: offset,
    take: limit + 1,
    select: {
      id: true,
      name: true,
      userId: true,
      status: true,
      config: true,
      tokenId: true,
      price: true,
      listingId: true,
      imageCid: true,
      ipfsUrl: true,
      updatedAt: true,
    },
  });

  const hasMore = records.length > limit;
  const slice = hasMore ? records.slice(0, limit) : records;
  const badges = slice.map((record) => {
    const imageCid = record.imageCid ?? getCidFromIpfsUrl(record.ipfsUrl);
    const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;
    return {
      id: record.id,
      name: record.name,
      owner: record.userId,
      status: record.status as BadgeRecordStatus,
      config: record.config as Partial<BadgeConfig> | null,
      tokenId: record.tokenId,
      price: record.price,
      listingId: record.listingId,
      imageUrl,
      updatedAt: record.updatedAt.toISOString(),
    };
  });

  return {
    badges,
    hasMore,
    nextOffset: offset + badges.length,
  };
};

export const listMarketPurchases = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<{
  records: MarketPurchaseRecord[];
  hasMore: boolean;
  nextOffset: number;
}> => {
  const records = await prisma.purchaseRecord.findMany({
    orderBy: {
      purchasedAt: "desc",
    },
    skip: offset,
    take: limit + 1,
    select: {
      id: true,
      tokenId: true,
      buyer: true,
      seller: true,
      price: true,
      listingId: true,
      purchasedAt: true,
    },
  });

  const hasMore = records.length > limit;
  const slice = hasMore ? records.slice(0, limit) : records;

  const tokenIds = slice
    .map((record) =>
      typeof record.tokenId === "string" ? record.tokenId.trim() : ""
    )
    .filter(Boolean);
  const tokenLookup = new Set<string>();
  tokenIds.forEach((tokenId) => {
    tokenLookup.add(tokenId);
    const normalized = normalizeTokenId(tokenId);
    if (normalized) {
      tokenLookup.add(normalized);
      tokenLookup.add(`#${normalized}`);
    }
  });

  const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);
  const badgeMeta = new Map<string, { name: string; imageUrl: string | null }>();
  if (tokenLookup.size > 0) {
    const badges = await prisma.badgeRecord.findMany({
      where: {
        tokenId: { in: Array.from(tokenLookup) },
      },
      select: {
        name: true,
        tokenId: true,
        imageCid: true,
        ipfsUrl: true,
      },
    });
    badges.forEach((badge) => {
      if (!badge.tokenId) return;
      const normalized = normalizeTokenId(badge.tokenId);
      if (normalized && !badgeMeta.has(normalized)) {
        const imageCid = badge.imageCid ?? getCidFromIpfsUrl(badge.ipfsUrl);
        const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;
        badgeMeta.set(normalized, { name: badge.name, imageUrl });
      }
    });
  }

  const mapped = slice.map((record) => {
    const normalized =
      typeof record.tokenId === "string"
        ? normalizeTokenId(record.tokenId)
        : "";
    const meta = normalized ? badgeMeta.get(normalized) : null;
    return {
      id: record.id,
      tokenId: record.tokenId ?? null,
      badgeName: normalized ? meta?.name ?? null : null,
      imageUrl: normalized ? meta?.imageUrl ?? null : null,
      buyer: record.buyer,
      seller: record.seller,
      price: record.price ?? null,
      listingId: record.listingId ?? null,
      purchasedAt: record.purchasedAt.toISOString(),
    };
  });

  return {
    records: mapped,
    hasMore,
    nextOffset: offset + mapped.length,
  };
};

export const getExploreBadgeByTokenId = async (
  tokenId: string
): Promise<BadgeDetailRecord | null> => {
  const normalized = normalizeTokenId(tokenId);
  if (!normalized) return null;

  const record = await prisma.badgeRecord.findFirst({
    where: {
      status: {
        in: [BadgeRecordStatus.Minted, BadgeRecordStatus.Listed],
      },
      OR: [{ tokenId: normalized }, { tokenId: `#${normalized}` }],
    },
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
      status: true,
      config: true,
      tokenId: true,
      tokenUri: true,
      ipfsUrl: true,
      listingId: true,
      price: true,
      imageCid: true,
      metadataCid: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!record) return null;

  const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);
  const imageCid = record.imageCid ?? getCidFromIpfsUrl(record.ipfsUrl);
  const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    owner: record.userId,
    status: record.status as BadgeRecordStatus,
    config: record.config as Partial<BadgeConfig> | null,
    tokenId: record.tokenId,
    tokenUri: record.tokenUri,
    ipfsUrl: record.ipfsUrl,
    listingId: record.listingId,
    price: record.price,
    imageUrl,
    imageCid,
    metadataCid: record.metadataCid,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
};

export const createBadgeForUser = async ({
  userId,
  name,
  description,
  config,
}: CreateBadgeInput) => {
  //TODO 增加事务处理
  const { imageCid, ipfsUrl } = await uploadBadgeImage(name, config);

  const meta = buildBadgeMetadata(name, config, imageCid, description);
  const { metadataCid, tokenUri } = await uploadBadgeMetadata(meta);

  const record = await prisma.badgeRecord.create({
    data: {
      userId: userId as string,
      name,
      description: description || null,
      config,
      status: BadgeRecordStatus.Saved,
      imageCid,
      metadataCid,
      tokenUri,
      ipfsUrl,
    },
    select: { id: true },
  });

  return {
    id: record.id,
    imageCid,
    metadataCid,
    tokenUri,
    ipfsUrl,
  };
};

export const updateBadgeStatusForUser = async ({
  userId,
  badgeId,
  status,
  tokenId,
  listingId,
  price,
}: {
  userId: string;
  badgeId: string;
  status: BadgeRecordStatus;
  tokenId?: string;
  listingId?: string | null;
  price?: string | null;
}) => {
  const data: {
    status: BadgeRecordStatus;
    tokenId?: string;
    listingId?: string | null;
    price?: string | null;
  } = { status };
  if (tokenId) {
    data.tokenId = tokenId;
  }
  if (listingId !== undefined) {
    data.listingId = listingId;
  }
  if (price !== undefined) {
    data.price = price;
  }
  return prisma.badgeRecord.updateMany({
    where: {
      id: badgeId,
      userId,
    },
    data,
  });
};

export const updateBadgeStatusByTokenUri = async ({
  tokenUri,
  status,
  tokenId,
}: {
  tokenUri: string;
  status: BadgeRecordStatus;
  tokenId?: string;
}) => {
  const data: { status: BadgeRecordStatus; tokenId?: string | null } = {
    status,
  };
  if (tokenId !== undefined) {
    data.tokenId = tokenId;
  }
  return prisma.badgeRecord.updateMany({
    where: {
      tokenUri,
    },
    data,
  });
};

export const finalizeMarketPurchase = async ({
  badgeId,
  buyer,
}: {
  badgeId: string;
  buyer: string;
}) => {
  const record = await prisma.badgeRecord.findFirst({
    where: {
      id: badgeId,
      status: BadgeRecordStatus.Listed,
    },
    select: {
      userId: true,
      price: true,
      listingId: true,
      tokenId: true,
    },
  });

  if (!record) {
    return { ok: false, updated: 0 };
  }

  const updated = await prisma.badgeRecord.updateMany({
    where: {
      id: badgeId,
      status: BadgeRecordStatus.Listed,
    },
    data: {
      userId: buyer,
      status: BadgeRecordStatus.Minted,
      listingId: null,
      price: null,
    },
  });

  if (updated.count === 0) {
    return { ok: false, updated: 0 };
  }

  await prisma.purchaseRecord.create({
    data: {
      tokenId: record.tokenId as string,
      buyer,
      seller: record.userId,
      price: record.price as string,
      listingId: record.listingId as string,
    },
  });

  return { ok: true, updated: updated.count };
};
