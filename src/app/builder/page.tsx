"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Flame, Leaf, Star, Sun, Zap } from "lucide-react";
import { useLanguage } from "../_components/LanguageProvider";
import { builderContent } from "../i18n";

const PREVIEW_SIZE = 512;
const DEFAULT_LEVEL = 3;
const DEFAULT_THEME_INDEX = 0;
const DEFAULT_SHAPE_INDEX = 1;
const DEFAULT_BORDER_INDEX = 1;
const DEFAULT_ICON_INDEX = 0;
const DEFAULT_CATEGORY_INDEX = 1;

const THEME_PRESETS = [
  {
    id: "seafoam",
    fill: ["#f1fffa", "#a7f3d0"],
    border: "#0f766e",
    text: "#115e59",
    icon: "#0f766e",
    backdrop: "from-emerald-200 via-emerald-100 to-amber-100",
  },
  {
    id: "sandstone",
    fill: ["#fff5db", "#f5c47a"],
    border: "#b45309",
    text: "#92400e",
    icon: "#b45309",
    backdrop: "from-amber-200 via-amber-100 to-orange-100",
  },
  {
    id: "copper",
    fill: ["#ffe8d5", "#f0a26b"],
    border: "#9a3412",
    text: "#7c2d12",
    icon: "#9a3412",
    backdrop: "from-orange-200 via-orange-100 to-amber-100",
  },
];

const SHAPE_IDS = ["circle", "hexagon", "shield"] as const;
const BORDER_IDS = ["none", "thin", "bold"] as const;
const BORDER_WIDTHS = [0, 6, 12];
const ICON_IDS = ["none", "star", "bolt", "leaf", "flame", "sun"] as const;
const ICON_COMPONENTS = [null, Star, Zap, Leaf, Flame, Sun];

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

const buildShieldPath = () =>
  "M256 58 L428 122 V252 C428 354 354 430 256 468 C158 430 84 354 84 252 V122 Z";

const getTextSize = (text: string) => {
  const length = text.length;
  if (length > 8) return 32;
  if (length > 5) return 40;
  return 48;
};

export default function BuilderPage() {
  const { language } = useLanguage();
  const copy = builderContent[language];
  const englishCopy = builderContent.en;

  const [badgeName, setBadgeName] = useState("");
  const [description, setDescription] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [themeIndex, setThemeIndex] = useState(DEFAULT_THEME_INDEX);
  const [shapeIndex, setShapeIndex] = useState(DEFAULT_SHAPE_INDEX);
  const [borderIndex, setBorderIndex] = useState(DEFAULT_BORDER_INDEX);
  const [iconIndex, setIconIndex] = useState(DEFAULT_ICON_INDEX);
  const [categoryIndex, setCategoryIndex] = useState(DEFAULT_CATEGORY_INDEX);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const englishThemes = englishCopy.themes;
  const englishShapes = englishCopy.shapes;
  const englishBorders = englishCopy.borders;
  const englishIcons = englishCopy.icons;
  const englishCategories = englishCopy.categories;

  const themeOptions = copy.themes.map((theme, index) => ({
    ...THEME_PRESETS[index],
    label: theme.name,
    englishLabel: englishThemes[index]?.name ?? theme.name,
    accentClass: theme.accent,
  }));

  const iconOptions = copy.icons.map((label, index) => ({
    id: ICON_IDS[index] ?? ICON_IDS[0],
    label,
    Icon: ICON_COMPONENTS[index],
  }));

  const selectedTheme = themeOptions[themeIndex] ?? themeOptions[0];
  const selectedShape = SHAPE_IDS[shapeIndex] ?? SHAPE_IDS[0];
  const selectedBorderWidth = BORDER_WIDTHS[borderIndex] ?? BORDER_WIDTHS[0];
  const selectedBorderId = BORDER_IDS[borderIndex] ?? BORDER_IDS[0];
  const selectedCategory = copy.categories[categoryIndex] ?? copy.categories[0];
  const selectedCategoryEnglish =
    englishCategories[categoryIndex] ?? englishCategories[0];
  const selectedShapeLabel = copy.shapes[shapeIndex] ?? copy.shapes[0];
  const selectedShapeEnglishLabel =
    englishShapes[shapeIndex] ?? englishShapes[0];
  const selectedBorderLabel = copy.borders[borderIndex] ?? copy.borders[0];
  const selectedBorderEnglishLabel =
    englishBorders[borderIndex] ?? englishBorders[0];
  const selectedIcon = iconOptions[iconIndex] ?? iconOptions[0];
  const selectedIconEnglishLabel = englishIcons[iconIndex] ?? englishIcons[0];
  const selectedThemeEnglishLabel = selectedTheme?.englishLabel ?? "";
  const displayText = badgeText.trim().slice(0, 10) || copy.previewText;
  const displayName = badgeName.trim() || copy.metadataPreview.name;
  const displayDescription =
    description.trim() || copy.metadataPreview.description;
  const textSize = getTextSize(displayText);
  const Icon = selectedIcon?.Icon ?? null;
  const iconSize = 96;
  const iconY = 190;
  const textY = Icon ? 340 : 300;

  const metadataPreview = useMemo(
    () => ({
      name: displayName,
      description: displayDescription,
      image: "ipfs://<image_cid>",
      attributes: [
        { trait_type: "Level", value: level },
        { trait_type: "Category", value: selectedCategoryEnglish },
        { trait_type: "Theme", value: selectedThemeEnglishLabel },
      ],
    }),
    [
      displayDescription,
      displayName,
      level,
      selectedCategoryEnglish,
      selectedThemeEnglishLabel,
    ],
  );

  const metadataJson = JSON.stringify(metadataPreview, null, 2);

  const handleSave = async () => {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          description: displayDescription,
          config: {
            themeId: selectedTheme?.id ?? "",
            themeLabel: selectedThemeEnglishLabel,
            shapeId: selectedShape,
            shapeLabel: selectedShapeEnglishLabel,
            borderId: selectedBorderId,
            borderLabel: selectedBorderEnglishLabel,
            iconId: selectedIcon?.id ?? "",
            iconLabel: selectedIconEnglishLabel,
            text: displayText,
            level,
            category: selectedCategoryEnglish,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save badge");
      }

      setSaveStatus("success");
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  const handleReset = () => {
    setBadgeName("");
    setDescription("");
    setBadgeText("");
    setThemeIndex(DEFAULT_THEME_INDEX);
    setShapeIndex(DEFAULT_SHAPE_INDEX);
    setBorderIndex(DEFAULT_BORDER_INDEX);
    setIconIndex(DEFAULT_ICON_INDEX);
    setCategoryIndex(DEFAULT_CATEGORY_INDEX);
    setLevel(DEFAULT_LEVEL);
    setSaveStatus("idle");
  };

  const hexagonPoints = buildHexagonPoints(256, 256, 200);
  const shieldPath = buildShieldPath();

  return (
    <div className="space-y-10">
      <section className="flex animate-[fade-in-up_0.6s_ease-out_both] flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {copy.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {copy.statusDraft}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {copy.statusLocal}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              onClick={handleReset}
              type="button"
            >
              {copy.reset}
            </button>
            <button
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saveStatus === "saving"}
              onClick={handleSave}
              type="button"
            >
              {saveStatus === "saving" ? copy.saveSaving : copy.saveToIpfs}
            </button>
          </div>
          {saveStatus !== "idle" ? (
            <p className="text-xs text-slate-500">
              {copy.saveStatus[saveStatus]}
            </p>
          ) : null}
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-8 lg:grid-cols-[1fr_1fr]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 shadow-lg shadow-slate-900/5">
          <h2 className="text-lg font-semibold text-slate-900">
            {copy.configTitle}
          </h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.badgeName}
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) => setBadgeName(event.target.value)}
                placeholder={copy.badgeNamePlaceholder}
                type="text"
                value={badgeName}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.descriptionLabel}
              </label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) => setDescription(event.target.value)}
                placeholder={copy.descriptionPlaceholder}
                rows={3}
                value={description}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.category}
              </label>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) => setCategoryIndex(Number(event.target.value))}
                value={categoryIndex}
              >
                {copy.categories.map((category, index) => (
                  <option key={category} value={index}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.theme}
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {themeOptions.map((theme, index) => (
                  <button
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 ${
                      index === themeIndex
                        ? "border-slate-900/40 bg-white text-slate-900"
                        : "border-slate-900/10 bg-white text-slate-600"
                    }`}
                    key={theme.id}
                    onClick={() => setThemeIndex(index)}
                    type="button"
                  >
                    {theme.label}
                    <span
                      className={`h-4 w-4 rounded-full ${theme.accentClass}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.shape}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.shapes.map((shape, index) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        index === shapeIndex
                          ? "border-slate-900/40 bg-white text-slate-900"
                          : "border-slate-900/10 bg-white text-slate-600"
                      }`}
                      key={shape}
                      onClick={() => setShapeIndex(index)}
                      type="button"
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.border}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.borders.map((border, index) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        index === borderIndex
                          ? "border-slate-900/40 bg-white text-slate-900"
                          : "border-slate-900/10 bg-white text-slate-600"
                      }`}
                      key={border}
                      onClick={() => setBorderIndex(index)}
                      type="button"
                    >
                      {border}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.icon}
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {iconOptions.map((icon, index) => {
                    const IconComponent = icon.Icon;
                    return (
                      <button
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                          index === iconIndex
                            ? "border-slate-900/40 bg-white text-slate-900"
                            : "border-slate-900/10 bg-white text-slate-600"
                        }`}
                        key={icon.label}
                        onClick={() => setIconIndex(index)}
                        type="button"
                      >
                        {IconComponent ? (
                          <IconComponent className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-dashed border-slate-300" />
                        )}
                        {icon.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.text}
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                  maxLength={10}
                  onChange={(event) => setBadgeText(event.target.value)}
                  placeholder={copy.textPlaceholder}
                  type="text"
                  value={badgeText}
                />
                <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.level}
                </label>
                <input
                  className="mt-2 w-full accent-slate-900"
                  max={5}
                  min={1}
                  onChange={(event) => setLevel(Number(event.target.value))}
                  step={1}
                  type="range"
                  value={level}
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{copy.previewTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {copy.previewPill}
              </span>
            </div>
            <div
              className={`mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br p-6 ${
                selectedTheme?.backdrop ?? "from-emerald-200 via-emerald-100 to-amber-100"
              }`}
            >
              <svg
                aria-hidden="true"
                className="h-52 w-52 drop-shadow-xl"
                height={PREVIEW_SIZE}
                viewBox="0 0 512 512"
                width={PREVIEW_SIZE}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="badgeFill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor={selectedTheme?.fill[0]} />
                    <stop offset="100%" stopColor={selectedTheme?.fill[1]} />
                  </linearGradient>
                </defs>
                {selectedShape === "circle" && (
                  <circle
                    cx={256}
                    cy={256}
                    fill="url(#badgeFill)"
                    r={200}
                    stroke={selectedBorderWidth ? selectedTheme?.border : "none"}
                    strokeWidth={selectedBorderWidth}
                  />
                )}
                {selectedShape === "hexagon" && (
                  <polygon
                    fill="url(#badgeFill)"
                    points={hexagonPoints}
                    stroke={selectedBorderWidth ? selectedTheme?.border : "none"}
                    strokeWidth={selectedBorderWidth}
                  />
                )}
                {selectedShape === "shield" && (
                  <path
                    d={shieldPath}
                    fill="url(#badgeFill)"
                    stroke={selectedBorderWidth ? selectedTheme?.border : "none"}
                    strokeWidth={selectedBorderWidth}
                  />
                )}
                {Icon ? (
                  <Icon
                    color={selectedTheme?.icon}
                    height={iconSize}
                    strokeWidth={2.4}
                    width={iconSize}
                    x={256 - iconSize / 2}
                    y={iconY - iconSize / 2}
                  />
                ) : null}
                <text
                  fill={selectedTheme?.text}
                  fontFamily="Helvetica Neue, Arial, sans-serif"
                  fontSize={textSize}
                  fontWeight={700}
                  textAnchor="middle"
                  x={256}
                  y={textY}
                >
                  {displayText}
                </text>
              </svg>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.theme}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedTheme?.label}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.shape}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedShapeLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.text}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {displayText}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.level}
                </p>
                <p className="mt-2 font-semibold text-slate-900">{level}</p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.category}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedCategory}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{copy.metadataTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {copy.metadataPill}
              </span>
            </div>
            <pre className="mt-5 max-h-56 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-amber-100/90">
              {metadataJson}
            </pre>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-xs text-slate-600">
              {copy.metadataNote}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {copy.afterSaveTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {copy.afterSaveSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900">
              {copy.afterSaveNote}
            </div>
            <Link
              className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900"
              href="/my-badges"
            >
              {copy.afterSaveCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
