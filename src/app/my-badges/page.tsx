"use client";

import Link from "next/link";
import { useLanguage } from "../_components/LanguageProvider";
import { myBadgesContent } from "../i18n";

type BadgeStatus = "draft" | "saved" | "minted";

const statusStyles: Record<BadgeStatus, string> = {
  draft: "bg-amber-100 text-amber-900",
  saved: "bg-emerald-100 text-emerald-900",
  minted: "bg-slate-900 text-amber-100",
};

export default function MyBadgesPage() {
  const { language } = useLanguage();
  const copy = myBadgesContent[language];

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
              type="button"
            >
              {copy.refresh}
            </button>
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.walletSnapshot}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {copy.walletStats.map((item) => (
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
          <div className="mt-5 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            {copy.pipelineStats.map((item) => (
              <div
                className="rounded-2xl border border-slate-900/10 bg-white/80 p-3"
                key={item.label}
              >
                <p className="uppercase tracking-[0.24em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-500">{item.note}</p>
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
          {copy.badges.map((badge) => {
            const detailId = badge.tokenId ? badge.tokenId.replace("#", "") : "112";
            return (
              <div
                className="flex flex-col gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 shadow-sm"
                key={badge.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 text-xs font-semibold text-slate-700">
                      {badge.name}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {badge.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {badge.id} - {badge.theme}
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
                  {badge.note ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.status}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {badge.note}
                      </p>
                    </div>
                  ) : null}
                  {badge.tokenURI ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.tokenUri}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {badge.tokenURI}
                      </p>
                    </div>
                  ) : null}
                  {badge.imageCid ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.imageCid}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {badge.imageCid}
                      </p>
                    </div>
                  ) : null}
                  {badge.metadataCid ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.metadataCid}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {badge.metadataCid}
                      </p>
                    </div>
                  ) : null}
                  {badge.tokenId ? (
                    <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                      <p className="uppercase tracking-[0.28em]">
                        {copy.cardLabels.tokenId}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {badge.tokenId} - {badge.price ?? copy.actions.notListed}
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
