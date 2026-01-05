"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { marketContent } from "../i18n";

export default function MarketPage() {
  const { language } = useLanguage();
  const copy = marketContent[language];

  return (
    <div className="space-y-10">
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.snapshot}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {copy.stats.map((item) => (
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
              {copy.feePill}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {copy.royaltyPill}
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
            {copy.latestTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            <input
              className="w-48 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm"
              placeholder={copy.searchPlaceholder}
              type="text"
            />
            <select className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm">
              {copy.sortOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700"
              type="button"
            >
              {copy.priceRange}
            </button>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700"
              type="button"
            >
              {copy.onlyBuyable}
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {copy.listings.map((listing) => (
            <div
              className="flex flex-col gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 shadow-sm"
              key={listing.id}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                  {listing.id}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {copy.royaltyLabel} {listing.royalty}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 text-xs font-semibold text-slate-700">
                  {listing.name}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {listing.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {listing.tokenId} - {listing.seller}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <span className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1">
                      {language === "zh"
                        ? `等级 ${listing.level}`
                        : `Level ${listing.level}`}
                    </span>
                    <span className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1">
                      {listing.theme}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {copy.priceLabel}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {listing.price}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {copy.feeLabel}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    1.5%
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {copy.listedLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {listing.listedAt}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-50"
                  type="button"
                >
                  {copy.buyNow}
                </button>
                <Link
                  className="flex-1 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-600"
                  href={`/badges/${listing.tokenId.replace("#", "")}`}
                >
                  {copy.viewDetails}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
