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
  Listed = "LISTED",
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
  listingId?: string | null;
  price?: string | null;
};

export type CreateBadgeInput = {
  userId: `0x${string}` | undefined;
  name: string;
  description?: string;
  config: BadgeConfig;
};

export type BadgeExploreRecord = {
  id: string;
  name: string;
  owner: string;
  status: BadgeRecordStatus;
  config?: Partial<BadgeConfig> | null;
  tokenId?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  updatedAt: string;
};

export type BadgeMarketRecord = {
  id: string;
  name: string;
  owner: string;
  status: BadgeRecordStatus;
  config?: Partial<BadgeConfig> | null;
  tokenId?: string | null;
  price?: string | null;
  listingId?: string | null;
  imageUrl?: string | null;
  updatedAt: string;
};

export type BadgeExploreStats = {
  mintedSupply: number;
  uniqueOwners: number;
  floorPrice: string | null;
  latestMint: string | null;
};

export type BadgeDetailRecord = {
  id: string;
  name: string;
  description?: string | null;
  owner: string;
  status: BadgeRecordStatus;
  config?: Partial<BadgeConfig> | null;
  tokenId?: string | null;
  tokenUri?: string | null;
  ipfsUrl?: string | null;
  listingId?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  imageCid?: string | null;
  metadataCid?: string | null;
  createdAt: string;
  updatedAt: string;
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
