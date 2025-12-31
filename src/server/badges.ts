import { prisma } from "@/lib/prisma";
import { BadgeConfig, BadgeListItem, CreateBadgeInput, Metadata } from "./type";
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
  const attributes: { trait_type: string; value: string | number }[] = [
    { trait_type: "Level", value: config.level },
  ];
  if (config.category) {
    attributes.push({ trait_type: "Category", value: config.category });
  }
  const themeValue = config.themeLabel || config.themeId;
  if (themeValue) {
    attributes.push({ trait_type: "Theme", value: themeValue });
  }
  const shapeValue = config.shapeLabel || config.shapeId;
  if (shapeValue) {
    attributes.push({ trait_type: "Shape", value: shapeValue });
  }
  const borderValue = config.borderLabel || config.borderId;
  if (borderValue) {
    attributes.push({ trait_type: "Border", value: borderValue });
  }
  const iconValue = config.iconLabel || config.iconId;
  if (iconValue) {
    attributes.push({ trait_type: "Icon", value: iconValue });
  }
  if (config.text) {
    attributes.push({ trait_type: "Text", value: config.text });
  }

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
      userId,
      name,
      description: description || null,
      config: {
        themeId: config.themeId,
        shapeId: config.shapeId,
        borderId: config.borderId,
        iconId: config.iconId,
        text: config.text,
        level: config.level,
      },
      status: "SAVED",
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
