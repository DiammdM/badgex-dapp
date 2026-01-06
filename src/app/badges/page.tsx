"use client";

import Link from "next/link";
import { useLanguage } from "@src/components/LanguageProvider";
import { badgesContent } from "../i18n";

export default function BadgesPage() {
  const { language } = useLanguage();
  const copy = badgesContent[language];

  return (
    <div className="space-y-10">
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.toolsTitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              className="w-56 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm"
              placeholder={copy.searchPlaceholder}
              type="text"
            />
            <select className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm">
              {copy.themeFilter.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-sm">
              {copy.levelFilter.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {copy.stats.map((item) => (
              <div
                className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4"
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
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 md:grid-cols-2 xl:grid-cols-3"
        style={{ animationDelay: "120ms" }}
      >
        {copy.badges.map((badge) => (
          <div
            className="rounded-[26px] border border-slate-900/10 bg-white/75 p-5 shadow-sm"
            key={badge.id}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                #{badge.id}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {copy.levelLabel} {badge.level}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 p-6">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-amber-900/60 bg-white text-xs font-semibold text-amber-900">
                {badge.name}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-lg font-semibold text-slate-900">
                {badge.name}
              </p>
              <p className="text-sm text-slate-500">
                {badge.owner} - {badge.theme}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                <span className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1">
                  {badge.category}
                </span>
                <span className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1">
                  {language === "zh"
                    ? `铸造 ${badge.mintedAt}`
                    : `Minted ${badge.mintedAt}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{copy.priceLabel}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  {badge.price}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Link
                className="flex-1 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-600"
                href={`/badges/${badge.id}`}
              >
                {copy.viewDetails}
              </Link>
              <Link
                className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-amber-50"
                href="/market"
              >
                {copy.buyNow}
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
