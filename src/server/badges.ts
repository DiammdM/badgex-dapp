"server only";

import { prisma } from "@src/lib/prisma";
import {
  BadgeConfig,
  BadgeListItem,
  BadgeRecordStatus,
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
