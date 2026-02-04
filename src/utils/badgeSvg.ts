import { BadgeConfig, BadgePropertyNames } from "@src/types/badge";

type ThemePreset = {
  fill: [string, string];
  border: string;
  text: string;
  icon: string;
};

type IconNode =
  | { type: "path"; d: string }
  | { type: "circle"; cx: number; cy: number; r: number };

const THEME_PRESETS: Record<string, ThemePreset> = {
  seafoam: {
    fill: ["#f1fffa", "#a7f3d0"],
    border: "#0f766e",
    text: "#115e59",
    icon: "#0f766e",
  },
  sandstone: {
    fill: ["#fff5db", "#f5c47a"],
    border: "#b45309",
    text: "#92400e",
    icon: "#b45309",
  },
  copper: {
    fill: ["#ffe8d5", "#f0a26b"],
    border: "#9a3412",
    text: "#7c2d12",
    icon: "#9a3412",
  },
};

const ICON_NODES: Record<string, IconNode[]> = {
  star: [
    {
      type: "path",
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
    },
  ],
  bolt: [
    {
      type: "path",
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
    },
  ],
  leaf: [
    {
      type: "path",
      d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    },
    {
      type: "path",
      d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
    },
  ],
  flame: [
    {
      type: "path",
      d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
    },
  ],
  sun: [
    { type: "circle", cx: 12, cy: 12, r: 4 },
    { type: "path", d: "M12 2v2" },
    { type: "path", d: "M12 20v2" },
    { type: "path", d: "m4.93 4.93 1.41 1.41" },
    { type: "path", d: "m17.66 17.66 1.41 1.41" },
    { type: "path", d: "M2 12h2" },
    { type: "path", d: "M20 12h2" },
    { type: "path", d: "m6.34 17.66-1.41 1.41" },
    { type: "path", d: "m19.07 4.93-1.41 1.41" },
  ],
};

const PREVIEW_SIZE = 512;
const ICON_VIEWBOX = 24;

const buildHexagonPoints = (cx: number, cy: number, radius: number) => {
  const points: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const MAX_BADGE_TEXT_LENGTH = 20;
const WRAP_TEXT_AT = 10;

const splitBadgeText = (text: string) => {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return [];
  const limited = normalized.slice(0, MAX_BADGE_TEXT_LENGTH);

  if (/\s/.test(limited)) {
    const words = limited.split(" ").filter(Boolean);
    if (words.length >= 2) {
      const splitIndex =
        words.length === 2 ? 1 : words.length === 3 ? 2 : Math.ceil(words.length / 2);
      const lineOne = words.slice(0, splitIndex).join(" ");
      const lineTwo = words.slice(splitIndex).join(" ");
      if (lineTwo) return [lineOne, lineTwo];
    }
  }

  if (limited.length <= WRAP_TEXT_AT) return [limited];
  return [limited.slice(0, WRAP_TEXT_AT), limited.slice(WRAP_TEXT_AT)];
};

const getTextSize = (maxLineLength: number, lineCount: number) => {
  if (lineCount > 1) {
    if (maxLineLength > 8) return 28;
    if (maxLineLength > 5) return 32;
    return 36;
  }
  if (maxLineLength > 8) return 32;
  if (maxLineLength > 5) return 40;
  return 48;
};

const buildIconMarkup = (
  iconId: string | undefined,
  color: string,
  x: number,
  y: number,
  size: number
) => {
  if (!iconId || iconId === "none") return "";
  const nodes = ICON_NODES[iconId];
  if (!nodes) return "";

  const scale = size / ICON_VIEWBOX;
  const parts = nodes
    .map((node) => {
      if (node.type === "circle") {
        return `<circle cx=\"${node.cx}\" cy=\"${node.cy}\" r=\"${node.r}\" />`;
      }
      return `<path d=\"${node.d}\" />`;
    })
    .join("");

  return `
    <g transform=\"translate(${x.toFixed(2)} ${y.toFixed(
    2
  )}) scale(${scale.toFixed(
    4
  )})\" fill=\"none\" stroke=\"${color}\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\">${parts}</g>`;
};

export const buildBadgeSvg = (config: BadgeConfig) => {
  const themeId = config[BadgePropertyNames.Theme];
  const shapeId = config[BadgePropertyNames.Shape];
  const borderId = config[BadgePropertyNames.Border];
  const iconValue = config[BadgePropertyNames.Icon];
  const textValue = config[BadgePropertyNames.Text];
  const theme = THEME_PRESETS[themeId] ?? THEME_PRESETS.seafoam;
  const borderWidth = borderId === "none" ? 0 : borderId === "bold" ? 12 : 6;
  const rawText = (textValue || "BADGE").trim();
  const limitedText = rawText.slice(0, MAX_BADGE_TEXT_LENGTH);
  const rawTextLines = splitBadgeText(limitedText);
  const textLines =
    rawTextLines.length > 0 ? rawTextLines : ["BADGE"];
  const maxLineLength = Math.max(...textLines.map((line) => line.length));
  const textSize = getTextSize(maxLineLength, textLines.length);
  const textLineHeight = Math.round(textSize * 1.15);
  const iconSize = 96;
  const iconCenterY = 190;
  const iconMarkup = buildIconMarkup(
    iconValue,
    theme.icon,
    256 - iconSize / 2,
    iconCenterY - iconSize / 2,
    iconSize
  );
  const textY = iconMarkup ? 340 : 300;
  const textBlockHeight = textLineHeight * textLines.length;
  const textStartY = textY - (textBlockHeight - textLineHeight) / 2;
  const hexagonPoints = buildHexagonPoints(256, 256, 200);
  const borderColor = borderWidth ? theme.border : "none";

  const shapeMarkup =
    shapeId === "circle"
      ? `<circle cx=\"256\" cy=\"256\" r=\"200\" fill=\"url(#badgeFill)\" stroke=\"${borderColor}\" stroke-width=\"${borderWidth}\" />`
      : shapeId === "shield"
      ? `<path d=\"M256 58 L428 122 V252 C428 354 354 430 256 468 C158 430 84 354 84 252 V122 Z\" fill=\"url(#badgeFill)\" stroke=\"${borderColor}\" stroke-width=\"${borderWidth}\" />`
      : `<polygon points=\"${hexagonPoints}\" fill=\"url(#badgeFill)\" stroke=\"${borderColor}\" stroke-width=\"${borderWidth}\" />`;

  const textMarkup = textLines
    .map((line, index) => {
      const safeLine = escapeXml(line);
      const dy = index === 0 ? 0 : textLineHeight;
      return `    <tspan x=\"256\" dy=\"${dy}\">${safeLine}</tspan>`;
    })
    .join("\n");

  return `
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${PREVIEW_SIZE}\" height=\"${PREVIEW_SIZE}\" viewBox=\"0 0 ${PREVIEW_SIZE} ${PREVIEW_SIZE}\">
  <defs>
    <linearGradient id=\"badgeFill\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"1\">
      <stop offset=\"0%\" stop-color=\"${theme.fill[0]}\" />
      <stop offset=\"100%\" stop-color=\"${theme.fill[1]}\" />
    </linearGradient>
  </defs>
  ${shapeMarkup}
  ${iconMarkup}
  <text fill=\"${theme.text}\" font-family=\"Helvetica Neue, Arial, sans-serif\" font-size=\"${textSize}\" font-weight=\"700\" text-anchor=\"middle\" x=\"256\" y=\"${textStartY}\">
${textMarkup}
  </text>
</svg>`.trim();
};
