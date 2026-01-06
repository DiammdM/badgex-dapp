"server only";

import { BadgeConfig, Metadata } from "@src/types/badge";
import { buildBadgeSvg } from "@src/utils/badgeSvg";
import { Resvg } from "@resvg/resvg-js";
import { pinata } from "@src/utils/pinata";

const GROUP_ID = process.env.GROUP_ID as string;
const PNG_SIZE = 512;

const buildBadgeImage = (config: BadgeConfig) => {
  const svg = buildBadgeSvg(config);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: PNG_SIZE,
    },
  });
  return resvg.render().asPng().toString("base64");
};

const normalizeMetadata = async (value: unknown): Promise<Metadata | null> => {
  let data = value;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== "object") return null;

  const metadata = data as Record<string, unknown>;
  if (
    typeof metadata.name !== "string" ||
    typeof metadata.image !== "string" ||
    !Array.isArray(metadata.attributes)
  ) {
    return null;
  }

  return metadata as Metadata;
};

export const uploadBadgeImage = async (name: string, config: BadgeConfig) => {
  const pngBase64 = buildBadgeImage(config);

  const uploadResponse = await pinata.upload.public
    .base64(pngBase64)
    .name(`${name}.png`)
    .group(GROUP_ID);

  const imageCid = uploadResponse.cid;
  const ipfsUrl = `ipfs://${imageCid}`;
  return { imageCid, ipfsUrl };
};

export const uploadBadgeMetadata = async (metadata: Metadata) => {
  const metadataUploadResponse = await pinata.upload.public
    .json(metadata)
    .name(`${metadata.name}.json`)
    .group(GROUP_ID);

  const metadataCid = metadataUploadResponse.cid;
  const tokenUri = `ipfs://${metadataCid}`;
  return { metadataCid, tokenUri };
};

export const getIpfsFilesByCid = async (
  cid: string
): Promise<Metadata | null> => {
  const response = await pinata.gateways.public.get(cid);
  const payload = (response?.data as JSON) ?? null;
  if (!payload) return null;

  return normalizeMetadata(payload);
};
