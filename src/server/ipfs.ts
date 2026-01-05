"server only";

import { BadgeConfig, Metadata } from "@/types/badge";
import { buildBadgeSvg } from "@/utils/badgeSvg";
import { Resvg } from "@resvg/resvg-js";
import { pinata } from "@/utils/pinata";

const GROUP_ID = process.env.GROUP_ID as string;
const PNG_SIZE = 512;

const buildBadgeImage = (config: BadgeConfig) => {
  const svg = buildBadgeSvg({
    themeId: config.themeId,
    shapeId: config.shapeId,
    borderId: config.borderId,
    iconId: config.iconId,
    text: config.text,
  });
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: PNG_SIZE,
    },
  });
  return resvg.render().asPng().toString("base64");
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
