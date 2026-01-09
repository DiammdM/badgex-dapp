export enum BadgePropertyNames {
  Category = "Category",
  Theme = "Theme",
  Shape = "Shape",
  Border = "Border",
  Icon = "Icon",
  Text = "Text",
}

export const BADGE_TRAITS = Object.values(BadgePropertyNames);

export enum BadgeRecordStatus {
  Draft = "DRAFT",
  Saved = "SAVED",
  Minted = "MINTED",
}

export type BadgeTraitType = BadgePropertyNames;

export type BadgeConfig = {
  [K in BadgePropertyNames]: string;
};

export type BadgeApiPayload = {
  userId: `0x${string}` | undefined;
  name: string;
  description: string;
  config: BadgeConfig;
};

export type BadgeListItem = {
  id: string;
  name: string;
  status: BadgeRecordStatus;
  config: unknown;
  imageCid: string | null;
  metadataCid: string | null;
  tokenUri: string | null;
  tokenId: string | null;
  ipfsUrl: string | null;
  updatedAt: string;
  imageUrl: string | null;
};

export type CreateBadgeInput = {
  userId: `0x${string}` | undefined;
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
