export enum BadgePropertyNames {
  Category = "Category",
  Theme = "Theme",
  Shape = "Shape",
  Border = "Border",
  Icon = "Icon",
  Text = "Text",
}

export const BADGE_TRAITS = Object.values(BadgePropertyNames);

export type BadgeTraitType = BadgePropertyNames;

export type BadgeConfig = {
  [K in BadgePropertyNames]: string;
};

export type BadgeApiPayload = {
  name: string;
  description: string;
  config: BadgeConfig;
};

export type BadgeListItem = {
  id: string;
  name: string;
  status: string;
  config: unknown;
  imageCid: string | null;
  metadataCid: string | null;
  tokenUri: string | null;
  ipfsUrl: string | null;
  updatedAt: string;
  imageUrl: string | null;
};

export type CreateBadgeInput = {
  userId: string;
  name: string;
  description?: string;
  config: BadgeConfig;
};

export type Metadata = {
  name: string;
  description?: string;
  image: string;
  attributes: MetaAttribute[];
};

export type MetaAttribute = {
  trait_type: BadgeTraitType;
  value: string | number | boolean;
};
