"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@src/components/LanguageProvider";
import { badgeDetailContent } from "../../i18n";
import {
  BadgePropertyNames,
  BadgeRecordStatus,
  type BadgeConfig,
  type BadgeDetailRecord,
} from "@src/types/badge";
import {
  BADGE_BORDER_OPTIONS,
  BADGE_CATEGORY_OPTIONS,
  BADGE_ICON_OPTIONS,
  BADGE_SHAPE_OPTIONS,
  BADGE_THEME_OPTIONS,
} from "@src/types/badge-options";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@src/components/ui/hover-card";

type BadgeAttribute = {
  label: string;
  value: string;
  traitType: BadgePropertyNames;
};

const resolveOptionLabel = (
  options: readonly { id: string; labels: { en: string; zh: string } }[],
  value: string | undefined,
  language: "en" | "zh"
) => {
  if (!value) return "--";
  return (
    options.find((option) => option.id === value)?.labels[language] ?? value
  );
};

const normalizeTokenId = (value?: string | null) => {
  if (!value) return undefined;
  return value.replace(/^#/, "").trim();
};

const truncateOwner = (value: string) => {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function BadgeDetailPage() {
  const params = useParams<{ id: string }>();
  const tokenId = params?.id;
  const { language } = useLanguage();
  const copy = badgeDetailContent[language];
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const [badge, setBadge] = useState<BadgeDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not-found" | "error" | null>(null);

  useEffect(() => {
    if (!tokenId) return;
    const controller = new AbortController();
    const loadBadge = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/badges/by-token-id?tokenId=${encodeURIComponent(tokenId)}`,
          { signal: controller.signal }
        );
        if (response.status === 404) {
          setBadge(null);
          setError("not-found");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load badge");
        }
        const data = await response.json();
        setBadge(data?.badge ?? null);
      } catch (err) {
        if ((err as { name?: string }).name !== "AbortError") {
          console.error(err);
          setError("error");
          setBadge(null);
        }
      } finally {
        setLoading(false);
      }
    };
    void loadBadge();
    return () => controller.abort();
  }, [tokenId]);

  const config = useMemo(() => {
    if (badge?.config && typeof badge.config === "object") {
      return badge.config as Partial<BadgeConfig>;
    }
    return {};
  }, [badge]);

  const themeLabel = useMemo(
    () =>
      resolveOptionLabel(
        BADGE_THEME_OPTIONS,
        typeof config.Theme === "string" ? config.Theme : undefined,
        language
      ),
    [config.Theme, language]
  );

  const categoryLabel = useMemo(
    () =>
      resolveOptionLabel(
        BADGE_CATEGORY_OPTIONS,
        typeof config.Category === "string" ? config.Category : undefined,
        language
      ),
    [config.Category, language]
  );

  const attributes = useMemo<BadgeAttribute[]>(() => {
    const labels = {
      Category: language === "zh" ? "类别" : "Category",
      Theme: language === "zh" ? "主题" : "Theme",
      Shape: language === "zh" ? "形状" : "Shape",
      Border: language === "zh" ? "边框" : "Border",
      Icon: language === "zh" ? "图标" : "Icon",
      Text: language === "zh" ? "文本" : "Text",
    };

    const entries: BadgeAttribute[] = [
      {
        label: labels.Category,
        value: categoryLabel,
        traitType: BadgePropertyNames.Category,
      },
      {
        label: labels.Theme,
        value: themeLabel,
        traitType: BadgePropertyNames.Theme,
      },
    ];

    const shapeValue = resolveOptionLabel(
      BADGE_SHAPE_OPTIONS,
      typeof config.Shape === "string" ? config.Shape : undefined,
      language
    );
    const borderValue = resolveOptionLabel(
      BADGE_BORDER_OPTIONS,
      typeof config.Border === "string" ? config.Border : undefined,
      language
    );
    const iconValue = resolveOptionLabel(
      BADGE_ICON_OPTIONS,
      typeof config.Icon === "string" ? config.Icon : undefined,
      language
    );
    const textValue =
      typeof config.Text === "string" && config.Text.trim()
        ? config.Text.trim()
        : "--";

    if (shapeValue !== "--") {
      entries.push({
        label: labels.Shape,
        value: shapeValue,
        traitType: BadgePropertyNames.Shape,
      });
    }
    if (borderValue !== "--") {
      entries.push({
        label: labels.Border,
        value: borderValue,
        traitType: BadgePropertyNames.Border,
      });
    }
    if (iconValue !== "--") {
      entries.push({
        label: labels.Icon,
        value: iconValue,
        traitType: BadgePropertyNames.Icon,
      });
    }
    if (textValue !== "--") {
      entries.push({
        label: labels.Text,
        value: textValue,
        traitType: BadgePropertyNames.Text,
      });
    }

    return entries;
  }, [
    categoryLabel,
    config.Border,
    config.Icon,
    config.Shape,
    config.Text,
    language,
    themeLabel,
  ]);

  const mintedAt = useMemo(() => {
    if (!badge?.updatedAt) return "--";
    const timestamp = Date.parse(badge.updatedAt);
    if (Number.isNaN(timestamp)) return badge.updatedAt;
    return new Date(timestamp).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [badge?.updatedAt, locale]);

  const statusLabel =
    badge?.status === BadgeRecordStatus.Listed
      ? copy.statusLabels.onSale
      : copy.statusLabels.notListed;
  const listingStatusLabel =
    badge?.status === BadgeRecordStatus.Listed
      ? copy.listingActive
      : copy.listingInactive;
  const displayTokenId = normalizeTokenId(badge?.tokenId ?? tokenId);
  const displayPrice =
    badge?.price && badge.price.toLowerCase().includes("eth")
      ? badge.price
      : badge?.price
      ? `${badge.price} ETH`
      : "--";
  const ownerNode = badge?.owner ? (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="inline-flex max-w-full cursor-help truncate text-sm font-semibold text-slate-900">
          {truncateOwner(badge.owner)}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <p className="text-xs font-semibold text-slate-700">{badge.owner}</p>
      </HoverCardContent>
    </HoverCard>
  ) : (
    "--"
  );

  const metadataJson = useMemo(() => {
    const imageUri = badge?.imageCid
      ? `ipfs://${badge.imageCid}`
      : badge?.ipfsUrl ?? "ipfs://<image_cid>";

    return JSON.stringify(
      {
        name: badge?.name ?? copy.fallback.name,
        description: badge?.description ?? copy.fallback.description,
        image: imageUri,
        attributes: attributes.map((attr) => ({
          trait_type: attr.traitType,
          value: attr.value,
        })),
      },
      null,
      2
    );
  }, [
    attributes,
    badge?.description,
    badge?.imageCid,
    badge?.name,
    badge?.tokenUri,
    copy.fallback.description,
    copy.fallback.name,
  ]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
        {copy.loadingText}
      </div>
    );
  }

  if (error === "not-found") {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
        {copy.notFoundText}
      </div>
    );
  }

  if (error || !badge) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
        {copy.errorText}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="flex animate-[fade-in-up_0.6s_ease-out_both] flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {badge.name} {displayTokenId ? `#${displayTokenId}` : ""}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700"
            href="/badges"
          >
            {copy.back}
          </Link>
          <Link
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 neon-cta"
            href="/market"
          >
            {copy.viewMarket}
          </Link>
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span>{copy.previewTitle}</span>
            <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
              512 x 512
            </span>
          </div>
          <div className="mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 p-8">
            <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-[10px] border-amber-900/60 bg-white text-sm font-semibold text-amber-900">
              {badge.imageUrl ? (
                <Image
                  alt={badge.name}
                  className="object-cover"
                  fill
                  sizes="192px"
                  src={badge.imageUrl}
                />
              ) : (
                badge.name
              )}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm text-slate-600">
            {badge.description ?? copy.fallback.description}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {copy.onChainTitle}
              </h2>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                {statusLabel}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { label: copy.dataLabels.owner, value: ownerNode },
                { label: copy.dataLabels.theme, value: themeLabel },
                { label: copy.dataLabels.minted, value: mintedAt },
                {
                  label: copy.dataLabels.tokenId,
                  value: displayTokenId ? `#${displayTokenId}` : "--",
                },
              ].map((item) => (
                <div
                  className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm"
                  key={item.label}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {item.label}
                  </p>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {item.value}
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {copy.dataLabels.tokenUri}
                </p>
                <p className="mt-2 font-semibold text-slate-700">
                  {badge.tokenUri ?? "--"}
                </p>
              </div>
              {badge.listingId ? (
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {copy.dataLabels.listingId}
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {badge.listingId}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {copy.attributesTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {attributes.map((attr) => (
                <div
                  className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm"
                  key={attr.label}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {attr.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {attr.value}
                  </p>
                </div>
              ))}
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
            <div className="mt-4 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                <p className="uppercase tracking-[0.28em]">{copy.lastSale}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">--</p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                <p className="uppercase tracking-[0.28em]">
                  {copy.listingStatus}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {listingStatusLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
