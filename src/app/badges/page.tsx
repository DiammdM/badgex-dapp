"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, Search, Sparkles, Tag, Users } from "lucide-react";
import { useLanguage } from "@src/components/LanguageProvider";
import { badgesContent } from "../i18n";
import {
  BadgeRecordStatus,
  type BadgeConfig,
  type BadgeExploreRecord,
  type BadgeExploreStats,
} from "@src/types/badge";
import { fetchExploreBadges } from "@src/lib/api/badges";
import {
  BADGE_CATEGORY_OPTIONS,
  BADGE_ICON_OPTIONS,
  BADGE_SHAPE_OPTIONS,
  BADGE_THEME_OPTIONS,
} from "@src/types/badge-options";
import { ExploreBadgeCard, type ExploreBadge } from "./ExploreBadgeCard";
import { Button } from "@src/components/ui/button";

type ExploreFilters = {
  search?: string;
  category?: string;
  theme?: string;
  shape?: string;
  icon?: string;
};

const normalizeTokenId = (value?: string | null) => {
  if (!value) return undefined;
  return value.startsWith("#") ? value.slice(1) : value;
};

const parsePriceValue = (value?: string | null) => {
  if (!value) return null;
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const PAGE_SIZE = 9;
const FILTER_BUTTON_CLASS =
  "h-8 rounded-full border border-slate-900/10 bg-white px-3 text-xs font-semibold text-slate-600 shadow-none transition hover:border-slate-900/20 hover:text-slate-900 data-[active=true]:border-slate-900 data-[active=true]:bg-slate-900 data-[active=true]:text-amber-100";

export default function BadgesPage() {
  const { language } = useLanguage();
  const copy = badgesContent[language];
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const [badges, setBadges] = useState<BadgeExploreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [stats, setStats] = useState<BadgeExploreStats | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [shapeFilter, setShapeFilter] = useState("all");
  const [iconFilter, setIconFilter] = useState("all");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchTerm]);

  const activeFilters = useMemo<ExploreFilters>(
    () => ({
      search: debouncedSearch || undefined,
      category: categoryFilter === "all" ? undefined : categoryFilter,
      theme: themeFilter === "all" ? undefined : themeFilter,
      shape: shapeFilter === "all" ? undefined : shapeFilter,
      icon: iconFilter === "all" ? undefined : iconFilter,
    }),
    [categoryFilter, debouncedSearch, iconFilter, shapeFilter, themeFilter]
  );

  const loadBadges = useCallback(
    async (nextOffset: number, initial: boolean, filters: ExploreFilters) => {
      if (initial) {
        requestAbortRef.current?.abort();
        const controller = new AbortController();
        requestAbortRef.current = controller;
        setLoading(true);
        setHasError(false);
        setHasMore(true);
        setOffset(0);
        setBadges([]);
        setStats(null);
        try {
          const params = new URLSearchParams({
            offset: String(nextOffset),
            limit: String(PAGE_SIZE),
          });
          if (filters.search) params.set("search", filters.search);
          if (filters.category) params.set("category", filters.category);
          if (filters.theme) params.set("theme", filters.theme);
          if (filters.shape) params.set("shape", filters.shape);
          if (filters.icon) params.set("icon", filters.icon);

          const response = await fetchExploreBadges(params, {
            signal: controller.signal,
          });
          if (!response.ok) {
            throw new Error("Failed to load badges");
          }
          const data = await response.json();
          const nextBadges = Array.isArray(data?.badges) ? data.badges : [];
          setBadges(nextBadges);
          setHasMore(Boolean(data?.hasMore));
          setOffset(
            typeof data?.nextOffset === "number"
              ? data.nextOffset
              : nextOffset + nextBadges.length
          );
          if (data?.stats) {
            setStats(data.stats);
          }
        } catch (error) {
          if ((error as { name?: string }).name !== "AbortError") {
            console.error(error);
            setHasError(true);
            setBadges([]);
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      setIsLoadingMore(true);
      try {
        const params = new URLSearchParams({
          offset: String(nextOffset),
          limit: String(PAGE_SIZE),
        });
        if (filters.search) params.set("search", filters.search);
        if (filters.category) params.set("category", filters.category);
        if (filters.theme) params.set("theme", filters.theme);
        if (filters.shape) params.set("shape", filters.shape);
        if (filters.icon) params.set("icon", filters.icon);

        const response = await fetchExploreBadges(params);
        if (!response.ok) {
          throw new Error("Failed to load badges");
        }
        const data = await response.json();
        const nextBadges = Array.isArray(data?.badges) ? data.badges : [];
        setBadges((prev) => [...prev, ...nextBadges]);
        setHasMore(Boolean(data?.hasMore));
        setOffset(
          typeof data?.nextOffset === "number"
            ? data.nextOffset
            : nextOffset + nextBadges.length
        );
        if (data?.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (loading || isLoadingMore || !hasMore) return;
    void loadBadges(offset, false, activeFilters);
  }, [activeFilters, hasMore, isLoadingMore, loadBadges, loading, offset]);

  useEffect(() => {
    void loadBadges(0, true, activeFilters);
  }, [activeFilters, loadBadges]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore || loading || isLoadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore, loading]);

  const displayBadges = useMemo<ExploreBadge[]>(() => {
    return badges.map((badge) => {
      const config =
        badge.config && typeof badge.config === "object"
          ? (badge.config as Partial<BadgeConfig>)
          : {};
      const themeId =
        typeof config.Theme === "string" ? config.Theme : undefined;
      const categoryId =
        typeof config.Category === "string" ? config.Category : undefined;
      const theme =
        BADGE_THEME_OPTIONS.find((option) => option.id === themeId)?.labels[
          language
        ] ??
        themeId ??
        "--";
      const category =
        BADGE_CATEGORY_OPTIONS.find((option) => option.id === categoryId)
          ?.labels[language] ??
        categoryId ??
        "--";
      const mintedTimestamp = Date.parse(badge.updatedAt);
      const mintedAt = Number.isNaN(mintedTimestamp)
        ? badge.updatedAt
        : new Date(mintedTimestamp).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
      const tokenId = normalizeTokenId(badge.tokenId);
      return {
        id: badge.id,
        tokenId,
        name: badge.name,
        owner: badge.owner,
        theme,
        category,
        mintedAt,
        listed: badge.status === BadgeRecordStatus.Listed,
        price: typeof badge.price === "string" ? badge.price : undefined,
        imageUrl: badge.imageUrl ?? null,
      };
    });
  }, [badges, language, locale]);

  const statsItems = useMemo(() => {
    if (stats) {
      const floorValue = stats.floorPrice
        ? stats.floorPrice.toLowerCase().includes("eth")
          ? stats.floorPrice
          : `${stats.floorPrice} ETH`
        : copy.stats[2].value;
      const latestValue = stats.latestMint
        ? new Date(stats.latestMint).toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : copy.stats[3].value;
      return [
        { label: copy.stats[0].label, value: stats.mintedSupply.toString() },
        { label: copy.stats[1].label, value: stats.uniqueOwners.toString() },
        { label: copy.stats[2].label, value: floorValue },
        { label: copy.stats[3].label, value: latestValue },
      ];
    }

    if (loading && badges.length === 0) {
      return copy.stats;
    }

    const mintedSupply = badges.length.toString();
    const ownerCount = new Set(badges.map((badge) => badge.owner)).size;
    let floor: { value: number; raw: string } | null = null;
    let latestMint = 0;

    badges.forEach((badge) => {
      const priceValue = parsePriceValue(badge.price);
      if (priceValue !== null && typeof badge.price === "string") {
        if (!floor || priceValue < floor.value) {
          floor = { value: priceValue, raw: badge.price };
        }
      }
      const timestamp = Date.parse(badge.updatedAt);
      if (!Number.isNaN(timestamp) && timestamp > latestMint) {
        latestMint = timestamp;
      }
    });

    const floorValue = floor
      ? floor.raw.includes("ETH")
        ? floor.raw
        : `${floor.raw} ETH`
      : copy.stats[2].value;
    const latestValue = latestMint
      ? new Date(latestMint).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : copy.stats[3].value;

    return [
      { label: copy.stats[0].label, value: mintedSupply },
      { label: copy.stats[1].label, value: ownerCount.toString() },
      { label: copy.stats[2].label, value: floorValue },
      { label: copy.stats[3].label, value: latestValue },
    ];
  }, [badges, copy.stats, locale, loading, stats]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside
        className="lg:fixed lg:top-24 lg:bottom-10 lg:w-[320px]"
        style={{
          left: "max(1.5rem, calc((100vw - 1440px) / 2 + 1.5rem))",
        }}
      >
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 animate-[fade-in-up_0.6s_ease-out_both] lg:h-full lg:overflow-y-auto border-bright">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.toolsTitle}
          </p>
          <div className="mt-4 grid gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-full border border-slate-900/10 bg-white px-4 py-2 pl-9 text-sm"
                placeholder={copy.searchPlaceholder}
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {copy.filters.categoryLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={FILTER_BUTTON_CLASS}
                    data-active={categoryFilter === "all"}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCategoryFilter("all")}
                  >
                    {copy.filters.allLabel}
                  </Button>
                  {BADGE_CATEGORY_OPTIONS.map((option) => (
                    <Button
                      className={FILTER_BUTTON_CLASS}
                      data-active={categoryFilter === option.id}
                      key={option.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCategoryFilter(option.id)}
                    >
                      {option.labels[language]}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {copy.filters.themeLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={FILTER_BUTTON_CLASS}
                    data-active={themeFilter === "all"}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setThemeFilter("all")}
                  >
                    {copy.filters.allLabel}
                  </Button>
                  {BADGE_THEME_OPTIONS.map((option) => (
                    <Button
                      className={FILTER_BUTTON_CLASS}
                      data-active={themeFilter === option.id}
                      key={option.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setThemeFilter(option.id)}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${option.accentClass}`}
                      />
                      {option.labels[language]}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {copy.filters.shapeLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={FILTER_BUTTON_CLASS}
                    data-active={shapeFilter === "all"}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShapeFilter("all")}
                  >
                    {copy.filters.allLabel}
                  </Button>
                  {BADGE_SHAPE_OPTIONS.map((option) => (
                    <Button
                      className={FILTER_BUTTON_CLASS}
                      data-active={shapeFilter === option.id}
                      key={option.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShapeFilter(option.id)}
                    >
                      {option.labels[language]}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {copy.filters.iconLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={FILTER_BUTTON_CLASS}
                    data-active={iconFilter === "all"}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIconFilter("all")}
                  >
                    {copy.filters.allLabel}
                  </Button>
                  {BADGE_ICON_OPTIONS.map((option) => (
                    <Button
                      className={FILTER_BUTTON_CLASS}
                      data-active={iconFilter === option.id}
                      key={option.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIconFilter(option.id)}
                    >
                      {option.labels[language]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 md:grid-cols-2 xl:grid-cols-3 lg:col-start-2 lg:pl-[40px]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="col-span-full grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          {statsItems.map((item, index) => {
            const iconSet = [BadgeCheck, Users, Tag, Sparkles] as const;
            const accentSet = [
              "bg-emerald-100 text-emerald-700",
              "bg-sky-100 text-sky-700",
              "bg-amber-100 text-amber-700",
              "bg-violet-100 text-violet-700",
            ] as const;
            const Icon = iconSet[index % iconSet.length];
            const accent = accentSet[index % accentSet.length];
            return (
              <div
                className="flex items-center gap-3 rounded-3xl border border-slate-900/10 bg-white/80 p-4 shadow-sm border-bright"
                key={item.label}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {loading ? (
          <div className="col-span-full rounded-[26px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
            {copy.loadingText}
          </div>
        ) : hasError ? (
          <div className="col-span-full rounded-[26px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
            {copy.errorText}
          </div>
        ) : displayBadges.length === 0 ? (
          <div className="col-span-full rounded-[26px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
            {copy.emptyText}
          </div>
        ) : (
          displayBadges.map((badge) => (
            <ExploreBadgeCard
              badge={badge}
              copy={copy}
              key={badge.id}
              language={language}
            />
          ))
        )}
        {!loading && !hasError && displayBadges.length > 0 ? (
          <div
            className="col-span-full flex items-center justify-center"
            ref={loadMoreRef}
          >
            {hasMore ? (
              isLoadingMore ? (
                <span className="text-sm text-slate-500">
                  {copy.loadingMore}
                </span>
              ) : (
                <Button variant="outline" type="button" onClick={loadMore}>
                  {copy.loadMore}
                </Button>
              )
            ) : (
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {copy.endText}
              </span>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
