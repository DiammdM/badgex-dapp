import { type BadgeConfig, BadgeRecordStatus } from "@src/types/badge";

export type BadgeStatus = Lowercase<BadgeRecordStatus>;

export type BadgeListItem = {
  id: string;
  name: string;
  status: BadgeStatus;
  theme: string;
  updated: string;
  tokenURI?: string;
  imageCid?: string;
  imageUrl?: string;
  metadataCid?: string;
  config?: Partial<BadgeConfig> | null;
  tokenId?: string;
  price?: string;
  listingId?: string;
};

export type BadgeRecordResponse = {
  id: string;
  name: string;
  status: BadgeRecordStatus;
  config?: Partial<BadgeConfig> | null;
  imageCid?: string | null;
  imageUrl?: string | null;
  metadataCid?: string | null;
  tokenUri?: string | null;
  tokenId?: string | null;
  ipfsUrl?: string | null;
  updatedAt: string;
  price?: string | null;
  listingId?: string | null;
};

export type MintContext = {
  badgeId: string;
  contractAddress: `0x${string}`;
  fingerprint: `0x${string}`;
  signature: `0x${string}`;
  tokenUri: string;
  account: `0x${string}`;
  value?: bigint;
};

export type ListingContext = {
  badgeId: string;
  price: string;
  fallbackListingId: string;
  account: `0x${string}`;
  tokenId: string;
};

export type CancelContext = {
  listingId: string;
  account: `0x${string}`;
  badgeId: string;
};
