"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { builderContent, myBadgesContent } from "../i18n";

type BadgeStatus = "draft" | "saved" | "minted";

const statusStyles: Record<BadgeStatus, string> = {
  draft: "bg-amber-100 text-amber-900",
  saved: "bg-emerald-100 text-emerald-900",
  minted: "bg-slate-900 text-amber-100",
};

type BadgeRecordResponse = {
  id: string;
  name: string;
  status: "DRAFT" | "SAVED" | "MINTED";
  config?: {
    themeId?: string;
    level?: number;
  } | null;
  imageCid?: string | null;
  imageUrl?: string | null;
  metadataCid?: string | null;
  tokenUri?: string | null;
  ipfsUrl?: string | null;
  updatedAt: string;
};

type BadgeListItem = {
  id: string;
  name: string;
  status: BadgeStatus;
  theme: string;
  level: number;
  updated: string;
  tokenURI?: string;
  imageCid?: string;
  imageUrl?: string;
  metadataCid?: string;
  tokenId?: string;
  price?: string;
  listed?: boolean;
  listingId?: string;
};

const THEME_LABELS: Record<string, number> = {
  seafoam: 0,
  sandstone: 1,
  copper: 2,
};

const getCidFromIpfs = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("ipfs://")) {
    return trimmed.slice("ipfs://".length);
  }
  const parts = trimmed.split("/ipfs/");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return undefined;
};

export default function MyBadgesPage() {
  const { language } = useLanguage();
  const copy = myBadgesContent[language];
  const locale = language === "zh" ? "zh-CN" : "en-US";
  const themeNames = builderContent[language].themes;

  const [badges, setBadges] = useState<BadgeRecordResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBadges = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/badges");
      if (!response.ok) {
        throw new Error("Failed to load badges");
      }
      const data = await response.json();
      setBadges(Array.isArray(data?.badges) ? data.badges : []);
    } catch (error) {
      console.error(error);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBadges();
  }, [loadBadges]);

  const displayBadges = useMemo<BadgeListItem[]>(() => {
    return badges.map((badge) => {
      const config =
        badge.config && typeof badge.config === "object" ? badge.config : {};
      const themeId = typeof config?.themeId === "string" ? config.themeId : "";
      const themeIndex =
        themeId && themeId in THEME_LABELS ? THEME_LABELS[themeId] : -1;
      const theme =
        themeIndex >= 0 ? themeNames[themeIndex]?.name ?? themeId : themeId;
      const level = typeof config?.level === "number" ? config.level : 0;
      const updated = new Date(badge.updatedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const status =
        badge.status === "MINTED"
          ? "minted"
          : badge.status === "SAVED"
          ? "saved"
          : "draft";
      const tokenUri =
        typeof badge.tokenUri === "string"
          ? badge.tokenUri
          : typeof (badge as { tokenURI?: string | null }).tokenURI === "string"
          ? (badge as { tokenURI?: string }).tokenURI
          : undefined;
      const imageCid = badge.imageCid ?? getCidFromIpfs(badge.ipfsUrl);
      const imageUrl =
        typeof badge.imageUrl === "string" && badge.imageUrl
          ? badge.imageUrl
          : undefined;
      const metadataCid = badge.metadataCid ?? getCidFromIpfs(tokenUri);
      const tokenURI =
        tokenUri ?? (metadataCid ? `ipfs://${metadataCid}` : undefined);

      return {
        id: badge.id,
        name: badge.name,
        status,
        theme: theme || "-",
        level,
        updated,
        tokenURI,
        imageCid: imageCid ?? undefined,
        imageUrl,
        metadataCid: metadataCid ?? undefined,
      };
    });
  }, [badges, locale, themeNames]);

  const badgeStats = useMemo(() => {
    const saved = badges.filter((badge) => badge.status === "SAVED").length;
    const minted = badges.filter((badge) => badge.status === "MINTED").length;
    return { saved, minted };
  }, [badges]);

  const mint = async (badge: BadgeListItem) => {
    // check the login state
    // TODO

    // get the finger and signature
    const response = await fetch("/api/mint-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "",
        attributes: [],
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to get mint signature");
    }
    const { signature, fingerprint } = await response.json();

    // call the mint function on the contract
    // TODO
  };

  return (
    <div className="space-y-10">
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {copy.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
              href="/builder"
            >
              {copy.newBadge}
            </Link>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              disabled={loading}
              onClick={loadBadges}
              type="button"
            >
              {loading ? `${copy.refresh}...` : copy.refresh}
            </button>
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.walletSnapshot}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: copy.walletStats[0]?.label ?? "Saved",
                value: badgeStats.saved,
              },
              {
                label: copy.walletStats[1]?.label ?? "Minted",
                value: badgeStats.minted,
              },
              { label: copy.walletStats[2]?.label ?? "Listed", value: 0 },
            ].map((item) => (
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
          <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-900">
            {copy.tokenNote}
          </div>
        </div>
      </section>

      <section
        className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 animate-[fade-in-up_0.6s_ease-out_both]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {copy.libraryTitle}
          </h2>
          <div className="flex flex-wrap gap-2">
            {copy.filters.map((filter, index) => (
              <button
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  index === 0
                    ? "border-slate-900/20 bg-slate-900 text-amber-100"
                    : "border-slate-900/10 bg-white text-slate-600"
                }`}
                key={filter}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {displayBadges.map((badge) => {
            const detailId = badge.tokenId
              ? badge.tokenId.replace("#", "")
              : badge.id;
            return (
              <div
                className="flex flex-col gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 shadow-sm"
                key={badge.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 text-xs font-semibold text-slate-700">
                      {badge.imageUrl ? (
                        <img
                          alt={badge.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={badge.imageUrl}
                        />
                      ) : (
                        badge.name
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {badge.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {badge.listed ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-900">
                        {copy.listedTag}
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[badge.status]
                      }`}
                    >
                      {copy.statusLabels[badge.status]}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                    <p className="uppercase tracking-[0.28em]">
                      {copy.cardLabels.level}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {badge.level}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                    <p className="uppercase tracking-[0.28em]">
                      {copy.cardLabels.updated}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {badge.updated}
                    </p>
                  </div>
                  {badge.tokenId ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.tokenId}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {badge.tokenId} -{" "}
                        {badge.price ?? copy.actions.notListed}
                      </p>
                    </div>
                  ) : null}
                  {badge.listingId ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.listing}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {badge.listingId}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  {badge.status === "draft" ? (
                    <button
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-50"
                      type="button"
                    >
                      {copy.actions.save}
                    </button>
                  ) : null}
                  {badge.status === "saved" ? (
                    <button
                      className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-50"
                      type="button"
                    >
                      {copy.actions.mint}
                    </button>
                  ) : null}
                  {badge.status === "minted" && badge.listed ? (
                    <button
                      className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900"
                      type="button"
                    >
                      {copy.actions.cancel}
                    </button>
                  ) : null}
                  {badge.status === "minted" && !badge.listed ? (
                    <button
                      className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900"
                      type="button"
                      onClick={() => {
                        mint(badge);
                      }}
                    >
                      {copy.actions.list}
                    </button>
                  ) : null}
                  <Link
                    className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                    href={`/badges/${detailId}`}
                  >
                    {copy.actions.view}
                  </Link>
                  <button
                    className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                    type="button"
                  >
                    {copy.actions.delete}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
