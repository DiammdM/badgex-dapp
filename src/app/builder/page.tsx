"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Flame, Leaf, Star, Sun, Zap, type LucideIcon } from "lucide-react";
import { useLanguage } from "@src/components/LanguageProvider";
import {
  BADGE_BORDER_OPTIONS,
  BADGE_CATEGORY_OPTIONS,
  BADGE_DEFAULTS,
  BADGE_ICON_OPTIONS,
  BADGE_SHAPE_OPTIONS,
  BADGE_THEME_OPTIONS,
  type BadgeBorderId,
  type BadgeCategoryValue,
  type BadgeShapeId,
  type BadgeThemeId,
  type BadgeIconId,
} from "@src/types/badge-options";
import { builderContent, global } from "../i18n";
import { BadgePropertyNames } from "@src/types/badge";
import { BadgeApiPayload } from "@src/types/badge";
import { useConnection } from "wagmi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog";

const PREVIEW_SIZE = 512;

const DEFAULT_THEME_ID = BADGE_DEFAULTS.themeId;
const DEFAULT_SHAPE_ID = BADGE_DEFAULTS.shapeId;
const DEFAULT_BORDER_ID = BADGE_DEFAULTS.borderId;
const DEFAULT_ICON_ID = BADGE_DEFAULTS.iconId;
const DEFAULT_CATEGORY_ID = BADGE_DEFAULTS.categoryId;

const ICON_COMPONENTS: Record<BadgeIconId, LucideIcon | null> = {
  none: null,
  star: Star,
  bolt: Zap,
  leaf: Leaf,
  flame: Flame,
  sun: Sun,
};

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
  const languageDic = builderContent[language];
  const globalDic = global[language];
  const [badgeName, setBadgeName] = useState("");
  const [description, setDescription] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [themeId, setThemeId] = useState<BadgeThemeId>(DEFAULT_THEME_ID);
  const [shapeId, setShapeId] = useState<BadgeShapeId>(DEFAULT_SHAPE_ID);
  const [borderId, setBorderId] = useState<BadgeBorderId>(DEFAULT_BORDER_ID);
  const [iconId, setIconId] = useState<BadgeIconId>(DEFAULT_ICON_ID);
  const [categoryId, setCategoryId] =
    useState<BadgeCategoryValue>(DEFAULT_CATEGORY_ID);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const themeOptions = BADGE_THEME_OPTIONS.map((theme) => ({
    ...theme,
    label: theme.labels[language],
    englishLabel: theme.labels.en,
  }));

  const shapeOptions = BADGE_SHAPE_OPTIONS.map((shape) => ({
    ...shape,
    label: shape.labels[language],
    englishLabel: shape.labels.en,
  }));

  const borderOptions = BADGE_BORDER_OPTIONS.map((border) => ({
    ...border,
    label: border.labels[language],
    englishLabel: border.labels.en,
  }));

  const iconOptions = BADGE_ICON_OPTIONS.map((icon) => ({
    ...icon,
    label: icon.labels[language],
    englishLabel: icon.labels.en,
    Icon: ICON_COMPONENTS[icon.id],
  }));

  const categoryOptions = BADGE_CATEGORY_OPTIONS.map((category) => ({
    ...category,
    label: category.labels[language],
    englishLabel: category.labels.en,
  }));

  const selectedTheme =
    themeOptions.find((theme) => theme.id === themeId) ?? themeOptions[0];
  const selectedShape =
    shapeOptions.find((shape) => shape.id === shapeId) ?? shapeOptions[0];
  const selectedBorder =
    borderOptions.find((border) => border.id === borderId) ?? borderOptions[0];
  const selectedIcon =
    iconOptions.find((icon) => icon.id === iconId) ?? iconOptions[0];
  const selectedCategory =
    categoryOptions.find((category) => category.id === categoryId) ??
    categoryOptions[0];
  const selectedShapeId = selectedShape?.id ?? BADGE_SHAPE_OPTIONS[0].id;
  const selectedBorderId = selectedBorder?.id ?? BADGE_BORDER_OPTIONS[0].id;
  const selectedBorderWidth =
    selectedBorder?.width ?? BADGE_BORDER_OPTIONS[0].width;
  const selectedCategoryLabel =
    selectedCategory?.label ?? categoryOptions[0].label;
  const selectedCategoryEnglish =
    selectedCategory?.englishLabel ?? categoryOptions[0].englishLabel;
  const selectedShapeLabel = selectedShape?.label ?? shapeOptions[0].label;
  const selectedThemeEnglishLabel = selectedTheme?.englishLabel ?? "";
  const displayText = badgeText.trim().slice(0, 10) || languageDic.previewText;
  const displayName = badgeName.trim() || languageDic.metadataPreview.name;
  const displayDescription =
    description.trim() || languageDic.metadataPreview.description;
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
        { trait_type: "Category", value: selectedCategoryEnglish },
        { trait_type: "Theme", value: selectedThemeEnglishLabel },
      ],
    }),
    [
      displayDescription,
      displayName,
      selectedCategoryEnglish,
      selectedThemeEnglishLabel,
    ]
  );

  const metadataJson = JSON.stringify(metadataPreview, null, 2);

  const { isConnected, address } = useConnection();
  const [showConnectAlert, setShowConnectAlert] = useState(false);

  const handleSave = async () => {
    // check the login status
    if (!isConnected || !address) {
      setShowConnectAlert(true);
      return;
    }

    // generate params
    const params: BadgeApiPayload = {
      userId: address,
      name: displayName,
      description: displayDescription,
      config: {
        [BadgePropertyNames.Theme]: selectedTheme.id,
        [BadgePropertyNames.Shape]: selectedShapeId,
        [BadgePropertyNames.Border]: selectedBorderId,
        [BadgePropertyNames.Icon]: selectedIcon.id,
        [BadgePropertyNames.Text]: displayText,
        [BadgePropertyNames.Category]: selectedCategoryEnglish,
      },
    };

    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
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
    setThemeId(DEFAULT_THEME_ID);
    setShapeId(DEFAULT_SHAPE_ID);
    setBorderId(DEFAULT_BORDER_ID);
    setIconId(DEFAULT_ICON_ID);
    setCategoryId(DEFAULT_CATEGORY_ID);
    setSaveStatus("idle");
  };

  const hexagonPoints = buildHexagonPoints(256, 256, 200);
  const shieldPath = buildShieldPath();

  return (
    <div className="space-y-10">
      <AlertDialog open={showConnectAlert} onOpenChange={setShowConnectAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{globalDic.connectAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {globalDic.connectAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {globalDic.connectAlert.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <section className="flex animate-[fade-in-up_0.6s_ease-out_both] flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {languageDic.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {languageDic.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {languageDic.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {languageDic.statusDraft}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {languageDic.statusLocal}
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
              {languageDic.reset}
            </button>
            <button
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saveStatus === "saving"}
              onClick={handleSave}
              type="button"
            >
              {saveStatus === "saving"
                ? languageDic.saveSaving
                : languageDic.saveToIpfs}
            </button>
          </div>
          {saveStatus !== "idle" ? (
            <p className="text-xs text-slate-500">
              {languageDic.saveStatus[saveStatus]}
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
            {languageDic.configTitle}
          </h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {languageDic.badgeName}
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) => setBadgeName(event.target.value)}
                placeholder={languageDic.badgeNamePlaceholder}
                type="text"
                value={badgeName}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {languageDic.descriptionLabel}
              </label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) => setDescription(event.target.value)}
                placeholder={languageDic.descriptionPlaceholder}
                rows={3}
                value={description}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {languageDic.category}
              </label>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                onChange={(event) =>
                  setCategoryId(event.target.value as BadgeCategoryValue)
                }
                value={categoryId}
              >
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {languageDic.theme}
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {themeOptions.map((theme) => (
                  <button
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 ${
                      theme.id === themeId
                        ? "border-slate-900/40 bg-white text-slate-900"
                        : "border-slate-900/10 bg-white text-slate-600"
                    }`}
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
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
                  {languageDic.shape}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shapeOptions.map((shape) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        shape.id === shapeId
                          ? "border-slate-900/40 bg-white text-slate-900"
                          : "border-slate-900/10 bg-white text-slate-600"
                      }`}
                      key={shape.id}
                      onClick={() => setShapeId(shape.id)}
                      type="button"
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {languageDic.border}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {borderOptions.map((border) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        border.id === borderId
                          ? "border-slate-900/40 bg-white text-slate-900"
                          : "border-slate-900/10 bg-white text-slate-600"
                      }`}
                      key={border.id}
                      onClick={() => setBorderId(border.id)}
                      type="button"
                    >
                      {border.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {languageDic.icon}
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {iconOptions.map((icon) => {
                    const IconComponent = icon.Icon;
                    return (
                      <button
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                          icon.id === iconId
                            ? "border-slate-900/40 bg-white text-slate-900"
                            : "border-slate-900/10 bg-white text-slate-600"
                        }`}
                        key={icon.id}
                        onClick={() => setIconId(icon.id)}
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
                  {languageDic.text}
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                  maxLength={10}
                  onChange={(event) => setBadgeText(event.target.value)}
                  placeholder={languageDic.textPlaceholder}
                  type="text"
                  value={badgeText}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{languageDic.previewTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {languageDic.previewPill}
              </span>
            </div>
            <div
              className={`mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br p-6 ${
                selectedTheme?.backdrop ??
                "from-emerald-200 via-emerald-100 to-amber-100"
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
                {selectedShapeId === "circle" && (
                  <circle
                    cx={256}
                    cy={256}
                    fill="url(#badgeFill)"
                    r={200}
                    stroke={
                      selectedBorderWidth ? selectedTheme?.border : "none"
                    }
                    strokeWidth={selectedBorderWidth}
                  />
                )}
                {selectedShapeId === "hexagon" && (
                  <polygon
                    fill="url(#badgeFill)"
                    points={hexagonPoints}
                    stroke={
                      selectedBorderWidth ? selectedTheme?.border : "none"
                    }
                    strokeWidth={selectedBorderWidth}
                  />
                )}
                {selectedShapeId === "shield" && (
                  <path
                    d={shieldPath}
                    fill="url(#badgeFill)"
                    stroke={
                      selectedBorderWidth ? selectedTheme?.border : "none"
                    }
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
                  {languageDic.summary.theme}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedTheme?.label}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {languageDic.summary.shape}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedShapeLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {languageDic.summary.text}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {displayText}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {languageDic.summary.category}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {selectedCategoryLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{languageDic.metadataTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {languageDic.metadataPill}
              </span>
            </div>
            <pre className="mt-5 max-h-56 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-amber-100/90">
              {metadataJson}
            </pre>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-xs text-slate-600">
              {languageDic.metadataNote}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
