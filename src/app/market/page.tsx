"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@src/components/LanguageProvider";
import { global, marketActivityContent, marketContent } from "../i18n";
import {
  type BadgeConfig,
  type BadgeMarketRecord,
  type MarketPurchaseRecord,
} from "@src/types/badge";
import { BADGE_THEME_OPTIONS } from "@src/types/badge-options";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@src/components/ui/popover";
import {
  useConnection,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BaseError, ContractFunctionRevertedError, parseEther } from "viem";
import { marketplaceAbi, useWriteMarketplaceBuy } from "@src/generated/wagmi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog";
import { MarketListingCard, type MarketListing } from "./MarketListingCard";

const PAGE_SIZE = 6;
const ACTIVITY_PAGE_SIZE = 6;
const DEFAULT_ROYALTY = "2.5%";

const BADGE_MARKETPLACE_ADDRESS = process.env
  .NEXT_PUBLIC_BADGE_MARKETPLACE_ADDRESS as `0x${string}`;

const normalizeTokenId = (value?: string | null) => {
  if (!value) return undefined;
  return value.startsWith("#") ? value.slice(1) : value;
};

const formatTokenLabel = (value?: string | null) => {
  const normalized = normalizeTokenId(value);
  return normalized ? `#${normalized}` : "--";
};

const formatPriceLabel = (value?: string | null) => {
  if (!value) return "--";
  return value.toLowerCase().includes("eth") ? value : `${value} ETH`;
};

const formatListedAt = (value: string, locale: string) => {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Date(timestamp).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAddress = (value: string) => {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const formatActivityTime = (value: string, locale: string) => {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;
  return new Date(timestamp).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateOwner = (value: string) => {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const resolveThemeLabel = (
  config: Partial<BadgeConfig> | null | undefined,
  language: "en" | "zh"
) => {
  const themeId = typeof config?.Theme === "string" ? config.Theme : undefined;
  return (
    BADGE_THEME_OPTIONS.find((option) => option.id === themeId)?.labels[
      language
    ] ??
    themeId ??
    "--"
  );
};

const parseListingId = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.trim().replace(/^#/, "");
  if (!normalized) return null;
  if (!/^\d+$/.test(normalized)) return null;
  try {
    return BigInt(normalized);
  } catch {
    return null;
  }
};

const parsePriceToWei = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace("eth", "").trim();
  const numeric = normalized.replace(/[^0-9.]/g, "");
  if (!numeric) return null;
  try {
    return parseEther(numeric);
  } catch {
    return null;
  }
};

const parsePriceValue = (value?: string | null) => {
  if (!value) return null;
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

export default function MarketPage() {
  const { language } = useLanguage();
  const languageDic = marketContent[language];
  const globalCopy = global[language];
  const activityCopy = marketActivityContent[language];
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const { isConnected, address, chainId } = useConnection();
  const publicClient = usePublicClient();
  const { mutateAsync: buyBadgeAsync, isPending: isBuying } =
    useWriteMarketplaceBuy();
  const [listings, setListings] = useState<BadgeMarketRecord[]>([]);
  const [activityRecords, setActivityRecords] = useState<
    MarketPurchaseRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityHasError, setActivityHasError] = useState(false);
  const [activityHasMore, setActivityHasMore] = useState(true);
  const [isActivityLoadingMore, setIsActivityLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [activityOffset, setActivityOffset] = useState(0);
  const [showConnectAlert, setShowConnectAlert] = useState(false);
  const [sortKey, setSortKey] = useState("latest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [priceRangeDraft, setPriceRangeDraft] = useState({
    min: "",
    max: "",
  });
  const [priceRangeError, setPriceRangeError] = useState<string | null>(null);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const [buyFeedback, setBuyFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [buyTxHash, setBuyTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [buyContext, setBuyContext] = useState<{
    recordId: string;
    listingId: string;
    account: `0x${string}`;
    price: string;
  } | null>(null);
  const [hiddenListingIds, setHiddenListingIds] = useState<string[]>([]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);
  const activityAbortRef = useRef<AbortController | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: buyReceipt, error: buyReceiptError } =
    useWaitForTransactionReceipt({ hash: buyTxHash });
  const isBuyingBusy = isBuying || !!buyTxHash;

  const sortOptions = useMemo(
    () => [
      { id: "latest", label: languageDic.sortOptions[0] },
      { id: "price-asc", label: languageDic.sortOptions[1] },
      { id: "price-desc", label: languageDic.sortOptions[2] },
    ],
    [languageDic.sortOptions]
  );

  const priceRangeLabel = useMemo(() => {
    if (!priceRange.min && !priceRange.max) return languageDic.priceRange;
    const minLabel = priceRange.min || "--";
    const maxLabel = priceRange.max || "--";
    return `${languageDic.priceRange}: ${minLabel}-${maxLabel}`;
  }, [languageDic.priceRange, priceRange.max, priceRange.min]);

  const resolveMarketErrorMessage = useCallback(
    (error: unknown) => {
      if (error instanceof BaseError) {
        const reverted = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        ) as ContractFunctionRevertedError | null;
        const errorName = reverted?.data?.errorName;
        if (errorName) {
          const map = languageDic.marketplaceErrors;
          if (errorName in map) {
            return map[errorName as keyof typeof map];
          }
          return errorName;
        }
        return error.shortMessage || error.message;
      }
      if (error instanceof Error && error.message) {
        return error.message;
      }
      return languageDic.buyError;
    },
    [languageDic.buyError, languageDic.marketplaceErrors]
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    if (!isPricePopoverOpen) return;
    setPriceRangeDraft(priceRange);
    setPriceRangeError(null);
  }, [isPricePopoverOpen, priceRange]);

  const loadListings = useCallback(
    async (nextOffset: number, initial: boolean, search: string) => {
      if (initial) {
        requestAbortRef.current?.abort();
        const controller = new AbortController();
        requestAbortRef.current = controller;
        setLoading(true);
        setHasError(false);
        setHasMore(true);
        setOffset(0);
        setListings([]);
        try {
          const params = new URLSearchParams({
            offset: String(nextOffset),
            limit: String(PAGE_SIZE),
          });
          if (search) params.set("search", search);

          const response = await fetch(
            `/api/badges/market?${params.toString()}`,
            { signal: controller.signal }
          );
          if (!response.ok) {
            throw new Error("Failed to load market listings");
          }
          const data = await response.json();
          const nextListings = Array.isArray(data?.badges) ? data.badges : [];
          setListings(nextListings);
          setHasMore(Boolean(data?.hasMore));
          setOffset(
            typeof data?.nextOffset === "number"
              ? data.nextOffset
              : nextOffset + nextListings.length
          );
        } catch (error) {
          if ((error as { name?: string }).name !== "AbortError") {
            console.error(error);
            setHasError(true);
            setListings([]);
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
        if (search) params.set("search", search);

        const response = await fetch(`/api/badges/market?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to load market listings");
        }
        const data = await response.json();
        const nextListings = Array.isArray(data?.badges) ? data.badges : [];
        setListings((prev) => [...prev, ...nextListings]);
        setHasMore(Boolean(data?.hasMore));
        setOffset(
          typeof data?.nextOffset === "number"
            ? data.nextOffset
            : nextOffset + nextListings.length
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    []
  );

  const loadActivity = useCallback(async (nextOffset: number, initial: boolean) => {
    if (initial) {
      activityAbortRef.current?.abort();
      const controller = new AbortController();
      activityAbortRef.current = controller;
      setActivityLoading(true);
      setActivityHasError(false);
      setActivityHasMore(true);
      setActivityOffset(0);
      setActivityRecords([]);
      try {
        const params = new URLSearchParams({
          offset: String(nextOffset),
          limit: String(ACTIVITY_PAGE_SIZE),
        });
        const response = await fetch(
          `/api/badges/market/activity?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Failed to load market activity");
        }
        const data = await response.json();
        const nextRecords = Array.isArray(data?.records) ? data.records : [];
        setActivityRecords(nextRecords);
        setActivityHasMore(Boolean(data?.hasMore));
        setActivityOffset(
          typeof data?.nextOffset === "number"
            ? data.nextOffset
            : nextOffset + nextRecords.length
        );
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          console.error(error);
          setActivityHasError(true);
          setActivityRecords([]);
        }
      } finally {
        setActivityLoading(false);
      }
      return;
    }

    setIsActivityLoadingMore(true);
    try {
      const params = new URLSearchParams({
        offset: String(nextOffset),
        limit: String(ACTIVITY_PAGE_SIZE),
      });
      const response = await fetch(
        `/api/badges/market/activity?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to load market activity");
      }
      const data = await response.json();
      const nextRecords = Array.isArray(data?.records) ? data.records : [];
      setActivityRecords((prev) => [...prev, ...nextRecords]);
      setActivityHasMore(Boolean(data?.hasMore));
      setActivityOffset(
        typeof data?.nextOffset === "number"
          ? data.nextOffset
          : nextOffset + nextRecords.length
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsActivityLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (loading || isLoadingMore || !hasMore) return;
    void loadListings(offset, false, debouncedSearch);
  }, [debouncedSearch, hasMore, isLoadingMore, loadListings, loading, offset]);

  const loadMoreActivity = useCallback(() => {
    if (activityLoading || isActivityLoadingMore || !activityHasMore) return;
    void loadActivity(activityOffset, false);
  }, [
    activityHasMore,
    activityLoading,
    activityOffset,
    isActivityLoadingMore,
    loadActivity,
  ]);

  useEffect(() => {
    void loadListings(0, true, debouncedSearch);
  }, [debouncedSearch, loadListings]);

  useEffect(() => {
    void loadActivity(0, true);
  }, [loadActivity]);

  useEffect(() => {
    if (!buyReceipt || !buyTxHash || !buyContext) return;
    if (buyReceipt.status === "reverted") {
      const resolveRevert = async () => {
        let message = languageDic.buyError as string;
        try {
          if (publicClient) {
            const listingId = BigInt(buyContext.listingId);
            const value = parsePriceToWei(buyContext.price);
            await publicClient.simulateContract({
              address: BADGE_MARKETPLACE_ADDRESS,
              abi: marketplaceAbi,
              functionName: "buy",
              args: [listingId],
              account: buyContext.account,
              value: value ?? undefined,
              blockNumber: buyReceipt.blockNumber,
            });
          }
        } catch (error) {
          message = resolveMarketErrorMessage(error);
        }
        setBuyFeedback({ type: "error", message });
        setBuyContext(null);
        setBuyTxHash(undefined);
        setBuyingId(null);
      };

      void resolveRevert();
      return;
    }

    if (buyReceipt.status !== "success") return;

    setBuyFeedback({ type: "success", message: languageDic.buySuccess });
    const purchaseContext = buyContext;
    const syncPurchase = async () => {
      try {
        const response = await fetch("/api/badges/market/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            badgeId: purchaseContext.recordId,
            buyer: purchaseContext.account,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to update market purchase");
        }
      } catch (error) {
        console.error("Failed to sync market purchase", error);
      } finally {
        void loadActivity(0, true);
      }
    };
    void syncPurchase();
    setHiddenListingIds((prev) =>
      prev.includes(buyContext.recordId) ? prev : [...prev, buyContext.recordId]
    );
    setListings((prev) =>
      prev.filter((listing) => listing.id !== buyContext.recordId)
    );
    setBuyContext(null);
    setBuyTxHash(undefined);
    setBuyingId(null);
  }, [
    buyContext,
    buyReceipt,
    buyTxHash,
    languageDic.buyError,
    languageDic.buySuccess,
    loadActivity,
    publicClient,
    resolveMarketErrorMessage,
  ]);

  useEffect(() => {
    if (!buyReceiptError || !buyTxHash) return;
    setBuyFeedback({
      type: "error",
      message: resolveMarketErrorMessage(buyReceiptError),
    });
    setBuyContext(null);
    setBuyTxHash(undefined);
    setBuyingId(null);
  }, [buyReceiptError, buyTxHash, resolveMarketErrorMessage]);

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

  const displayListings = useMemo<MarketListing[]>(() => {
    const minValue = parsePriceValue(priceRange.min);
    const maxValue = parsePriceValue(priceRange.max);
    const hasRange = minValue !== null || maxValue !== null;

    const mapped = listings
      .filter((listing) => !hiddenListingIds.includes(listing.id))
      .filter((listing) => {
        if (!hasRange) return true;
        const priceValue = parsePriceValue(listing.price ?? null);
        if (priceValue === null) return false;
        if (minValue !== null && priceValue < minValue) return false;
        if (maxValue !== null && priceValue > maxValue) return false;
        return true;
      })
      .map((listing) => {
        const config =
          listing.config && typeof listing.config === "object"
            ? (listing.config as Partial<BadgeConfig>)
            : {};
        const tokenLabel = formatTokenLabel(listing.tokenId);
        const displayId =
          listing.listingId ?? (tokenLabel !== "--" ? tokenLabel : listing.id);
        const linkId = normalizeTokenId(listing.tokenId) ?? listing.id;
        return {
          id: listing.id,
          owner: listing.owner,
          updatedAt: listing.updatedAt,
          displayId,
          name: listing.name,
          tokenLabel,
          seller: truncateOwner(listing.owner),
          priceLabel: formatPriceLabel(listing.price),
          rawPrice: listing.price ?? null,
          listingId: listing.listingId ?? null,
          royaltyLabel: DEFAULT_ROYALTY,
          theme: resolveThemeLabel(config, language),
          listedAt: formatListedAt(listing.updatedAt, locale),
          linkId,
        };
      });

    const sorted = [...mapped];
    if (sortKey === "price-asc" || sortKey === "price-desc") {
      sorted.sort((a, b) => {
        const left = parsePriceValue(a.rawPrice);
        const right = parsePriceValue(b.rawPrice);
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        if (left === right) {
          const leftTime = Date.parse(a.updatedAt) || 0;
          const rightTime = Date.parse(b.updatedAt) || 0;
          return rightTime - leftTime;
        }
        return sortKey === "price-asc" ? left - right : right - left;
      });
      return sorted;
    }

    sorted.sort((a, b) => {
      const leftTime = Date.parse(a.updatedAt) || 0;
      const rightTime = Date.parse(b.updatedAt) || 0;
      return rightTime - leftTime;
    });
    return sorted;
  }, [
    hiddenListingIds,
    language,
    listings,
    locale,
    priceRange.max,
    priceRange.min,
    sortKey,
  ]);

  const activityRows = useMemo(() => {
    return activityRecords.map((record) => {
      const tokenLabel = formatTokenLabel(record.tokenId);
      const itemLabel =
        record.badgeName?.trim() || tokenLabel !== "--"
          ? record.badgeName ?? `${activityCopy.badgePrefix} ${tokenLabel}`
          : activityCopy.unknownBadge;
      const linkId = normalizeTokenId(record.tokenId);
      return {
        id: record.id,
        eventLabel: activityCopy.eventSale,
        itemLabel,
        itemLink: linkId ? `/badges/${linkId}` : null,
        priceLabel: formatPriceLabel(record.price),
        fromLabel: formatAddress(record.seller),
        toLabel: formatAddress(record.buyer),
        timeLabel: formatActivityTime(record.purchasedAt, locale),
      };
    });
  }, [activityCopy, activityRecords, locale]);

  const buyNow = async (listing: MarketListing) => {
    if (!isConnected || !address || !chainId) {
      setShowConnectAlert(true);
      return;
    }

    if (isBuyingBusy) return;

    if (!BADGE_MARKETPLACE_ADDRESS) {
      setBuyFeedback({ type: "error", message: languageDic.buyError });
      return;
    }

    if (listing.owner.toLowerCase() === address.toLowerCase()) {
      setBuyFeedback({ type: "error", message: languageDic.buySelfError });
      return;
    }

    const listingId = parseListingId(listing.listingId);
    if (!listingId) {
      setBuyFeedback({ type: "error", message: languageDic.buyError });
      return;
    }

    const value = parsePriceToWei(listing.rawPrice);
    if (!value) {
      setBuyFeedback({ type: "error", message: languageDic.buyError });
      return;
    }

    try {
      setBuyFeedback(null);
      setBuyingId(listing.id);

      if (publicClient) {
        await publicClient.simulateContract({
          address: BADGE_MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "buy",
          args: [listingId],
          account: address,
          value,
        });
      }

      setBuyContext({
        recordId: listing.id,
        listingId: listingId.toString(),
        account: address,
        price: listing.rawPrice ?? "",
      });

      const txHash = await buyBadgeAsync({
        address: BADGE_MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "buy",
        args: [listingId],
        account: address,
        value,
      });
      setBuyTxHash(txHash);
    } catch (error) {
      setBuyFeedback({
        type: "error",
        message: resolveMarketErrorMessage(error),
      });
      setBuyContext(null);
      setBuyingId(null);
      setBuyTxHash(undefined);
    }
  };

  return (
    <div className="space-y-10">
      <AlertDialog open={showConnectAlert} onOpenChange={setShowConnectAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{globalCopy.connectAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {globalCopy.connectAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {globalCopy.connectAlert.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {languageDic.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {languageDic.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {languageDic.description}
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {languageDic.snapshot}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {languageDic.stats.map((item) => (
              <div
                className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm"
                key={item.label}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {languageDic.feePill}
            </span>
          </div>
        </div>
      </section>

      <section
        className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 animate-[fade-in-up_0.6s_ease-out_both]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {languageDic.latestTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            <input
              className="w-48 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm"
              placeholder={languageDic.searchPlaceholder}
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm cursor-pointer"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <Popover
              open={isPricePopoverOpen}
              onOpenChange={setIsPricePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 cursor-pointer"
                  type="button"
                >
                  {priceRangeLabel}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <div className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      {languageDic.priceRangeMinLabel}
                    </label>
                    <Input
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => {
                        setPriceRangeDraft((prev) => ({
                          ...prev,
                          min: event.target.value,
                        }));
                        if (priceRangeError) {
                          setPriceRangeError(null);
                        }
                      }}
                      placeholder={languageDic.priceRangeMinPlaceholder}
                      step="0.0001"
                      type="number"
                      value={priceRangeDraft.min}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      {languageDic.priceRangeMaxLabel}
                    </label>
                    <Input
                      inputMode="decimal"
                      min="0"
                      onChange={(event) => {
                        setPriceRangeDraft((prev) => ({
                          ...prev,
                          max: event.target.value,
                        }));
                        if (priceRangeError) {
                          setPriceRangeError(null);
                        }
                      }}
                      placeholder={languageDic.priceRangeMaxPlaceholder}
                      step="0.0001"
                      type="number"
                      value={priceRangeDraft.max}
                    />
                  </div>
                  {priceRangeError ? (
                    <p className="text-xs text-rose-600">{priceRangeError}</p>
                  ) : null}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        setPriceRange({ min: "", max: "" });
                        setPriceRangeDraft({ min: "", max: "" });
                        setPriceRangeError(null);
                        setIsPricePopoverOpen(false);
                      }}
                    >
                      {languageDic.priceRangeClear}
                    </Button>
                    <Button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => {
                        const minValue = parsePriceValue(priceRangeDraft.min);
                        const maxValue = parsePriceValue(priceRangeDraft.max);
                        if (
                          (minValue !== null && minValue < 0) ||
                          (maxValue !== null && maxValue < 0) ||
                          (minValue !== null &&
                            maxValue !== null &&
                            minValue > maxValue)
                        ) {
                          setPriceRangeError(languageDic.priceRangeError);
                          return;
                        }
                        setPriceRange({
                          min: priceRangeDraft.min.trim(),
                          max: priceRangeDraft.max.trim(),
                        });
                        setPriceRangeError(null);
                        setIsPricePopoverOpen(false);
                      }}
                    >
                      {languageDic.priceRangeApply}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700"
              type="button"
            >
              {languageDic.onlyBuyable}
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            {buyFeedback ? (
              <div
                className={`rounded-[20px] border px-4 py-3 text-sm ${
                  buyFeedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {buyFeedback.message}
              </div>
            ) : null}
            <div className="grid gap-6 md:grid-cols-2">
              {loading ? (
                <div className="md:col-span-2 rounded-[24px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
                  {languageDic.loadingText}
                </div>
              ) : hasError ? (
                <div className="md:col-span-2 rounded-[24px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
                  {languageDic.errorText}
                </div>
              ) : displayListings.length === 0 ? (
                <div className="md:col-span-2 rounded-[24px] border border-dashed border-slate-900/10 bg-white/60 p-8 text-center text-sm text-slate-500">
                  {languageDic.emptyText}
                </div>
              ) : (
                displayListings.map((listing) => (
                  <MarketListingCard
                    copy={languageDic}
                    isBuying={buyingId === listing.id}
                    isBuyDisabled={
                      isBuyingBusy ||
                      !listing.listingId ||
                      !parseListingId(listing.listingId) ||
                      !listing.rawPrice
                    }
                    key={listing.id}
                    listing={listing}
                    onBuyNow={buyNow}
                  />
                ))
              )}
            </div>
            {!loading && !hasError && displayListings.length > 0 ? (
              <div className="flex items-center justify-center" ref={loadMoreRef}>
                {hasMore ? (
                  isLoadingMore ? (
                    <span className="text-sm text-slate-500">
                      {languageDic.loadingMore}
                    </span>
                  ) : (
                    <Button variant="outline" type="button" onClick={loadMore}>
                      {languageDic.loadMore}
                    </Button>
                  )
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {languageDic.endText}
                  </span>
                )}
              </div>
            ) : null}
          </div>
          <aside className="rounded-[24px] border border-slate-900/10 bg-white/80 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                {activityCopy.label}
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {activityCopy.eventSale}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {activityLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-900/10 bg-white/60 p-4 text-center text-sm text-slate-500">
                  {activityCopy.loadingText}
                </div>
              ) : activityHasError ? (
                <div className="rounded-2xl border border-dashed border-slate-900/10 bg-white/60 p-4 text-center text-sm text-slate-500">
                  {activityCopy.errorText}
                </div>
              ) : activityRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-900/10 bg-white/60 p-4 text-center text-sm text-slate-500">
                  {activityCopy.emptyText}
                </div>
              ) : (
                activityRows.map((row) => (
                  <div
                    className="rounded-2xl border border-slate-900/10 bg-white p-4 text-sm text-slate-600"
                    key={row.id}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold uppercase tracking-[0.24em]">
                        {row.eventLabel}
                      </span>
                      <span>{row.timeLabel}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {row.itemLink ? (
                        <Link
                          className="font-semibold text-slate-900 hover:text-slate-700"
                          href={row.itemLink}
                        >
                          {row.itemLabel}
                        </Link>
                      ) : (
                        <span className="font-semibold text-slate-900">
                          {row.itemLabel}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-slate-900">
                        {row.priceLabel}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {activityCopy.columns.from} {row.fromLabel}
                      </span>
                      <span>
                        {activityCopy.columns.to} {row.toLabel}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!activityLoading && !activityHasError && activityRows.length > 0 ? (
              <div className="mt-4 flex items-center justify-center">
                {activityHasMore ? (
                  isActivityLoadingMore ? (
                    <span className="text-sm text-slate-500">
                      {activityCopy.loadingMore}
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={loadMoreActivity}
                    >
                      {activityCopy.loadMore}
                    </Button>
                  )
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {activityCopy.endText}
                  </span>
                )}
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}
