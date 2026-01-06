export type BadgeOptionLabel = {
  en: string;
  zh: string;
};

export const BADGE_THEME_OPTIONS = [
  {
    id: "seafoam",
    labels: { en: "Seafoam Mint", zh: "海沫薄荷" },
    accentClass: "bg-emerald-200",
    fill: ["#f1fffa", "#a7f3d0"],
    border: "#0f766e",
    text: "#115e59",
    icon: "#0f766e",
    backdrop: "from-emerald-200 via-emerald-100 to-amber-100",
  },
  {
    id: "sandstone",
    labels: { en: "Sandstone Amber", zh: "砂岩琥珀" },
    accentClass: "bg-amber-200",
    fill: ["#fff5db", "#f5c47a"],
    border: "#b45309",
    text: "#92400e",
    icon: "#b45309",
    backdrop: "from-amber-200 via-amber-100 to-orange-100",
  },
  {
    id: "copper",
    labels: { en: "Copper Dusk", zh: "铜色暮光" },
    accentClass: "bg-orange-200",
    fill: ["#ffe8d5", "#f0a26b"],
    border: "#9a3412",
    text: "#7c2d12",
    icon: "#9a3412",
    backdrop: "from-orange-200 via-orange-100 to-amber-100",
  },
] as const;

export const BADGE_SHAPE_OPTIONS = [
  { id: "circle", labels: { en: "Circle", zh: "圆形" } },
  { id: "hexagon", labels: { en: "Hexagon", zh: "六边形" } },
  { id: "shield", labels: { en: "Shield", zh: "盾牌" } },
] as const;

export const BADGE_BORDER_OPTIONS = [
  { id: "none", labels: { en: "None", zh: "无" }, width: 0 },
  { id: "thin", labels: { en: "Thin", zh: "细" }, width: 6 },
  { id: "bold", labels: { en: "Bold", zh: "粗" }, width: 12 },
] as const;

export const BADGE_ICON_OPTIONS = [
  { id: "none", labels: { en: "None", zh: "无" } },
  { id: "star", labels: { en: "Star", zh: "星形" } },
  { id: "bolt", labels: { en: "Bolt", zh: "闪电" } },
  { id: "leaf", labels: { en: "Leaf", zh: "叶子" } },
  { id: "flame", labels: { en: "Flame", zh: "火焰" } },
  { id: "sun", labels: { en: "Sun", zh: "太阳" } },
] as const;

export const BADGE_CATEGORY_OPTIONS = [
  { id: "Achievement", labels: { en: "Achievement", zh: "成就" } },
  { id: "Builder", labels: { en: "Builder", zh: "建造者" } },
  { id: "Community", labels: { en: "Community", zh: "社群" } },
  { id: "Mentor", labels: { en: "Mentor", zh: "导师" } },
] as const;

export const BADGE_DEFAULTS = {
  themeId: "seafoam",
  shapeId: "hexagon",
  borderId: "thin",
  iconId: "none",
  categoryId: "Builder",
} as const;

export type BadgeThemeId = (typeof BADGE_THEME_OPTIONS)[number]["id"];
export type BadgeShapeId = (typeof BADGE_SHAPE_OPTIONS)[number]["id"];
export type BadgeBorderId = (typeof BADGE_BORDER_OPTIONS)[number]["id"];
export type BadgeIconId = (typeof BADGE_ICON_OPTIONS)[number]["id"];
export type BadgeCategoryValue = (typeof BADGE_CATEGORY_OPTIONS)[number]["id"];
