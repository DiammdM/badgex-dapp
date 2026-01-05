export type BadgeConfig = {
  themeId: string;
  themeLabel: string;
  shapeId: string;
  shapeLabel: string;
  borderId: string;
  borderLabel: string;
  iconId: string;
  iconLabel: string;
  text: string;
  level: number;
  category: string;
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

export type BadgeTraitType =
  | "Level"
  | "Category"
  | "Theme"
  | "Shape"
  | "Border"
  | "Icon"
  | "Text";
