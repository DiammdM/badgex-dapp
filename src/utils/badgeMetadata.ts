import {
  BadgeConfig,
  BadgePropertyNames,
  Metadata,
  MetaAttribute,
} from "@src/types/badge";

export const buildBadgeMetadata = (
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
