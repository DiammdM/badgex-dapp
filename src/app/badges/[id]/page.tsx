"use client";

import Link from "next/link";
import { useLanguage } from "../../_components/LanguageProvider";
import { badgeDetailContent } from "../../i18n";

type BadgeAttribute = {
  trait: string;
  value: string | number;
};

type BadgeDetail = {
  id: string;
  name: string;
  description: string;
  owner: string;
  price?: string;
  status: "on-sale" | "not-listed";
  tokenURI: string;
  attributes: BadgeAttribute[];
  royalty: string;
  mintedAt: string;
  theme: string;
  listingId?: string;
  lastSale?: string;
};

export default function BadgeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { language } = useLanguage();
  const copy = badgeDetailContent[language];
  const data = copy.data as Record<string, BadgeDetail>;
  const badge = data[params.id] ?? {
    ...copy.fallback,
    id: params.id,
  };

  const metadataJson = JSON.stringify(
    {
      name: `${language === "zh" ? "徽章：" : "Badge: "}${badge.name}`,
      description: badge.description,
      image: "ipfs://<image_cid>",
      attributes: badge.attributes.map((attr) => ({
        trait_type: attr.trait,
        value: attr.value,
      })),
    },
    null,
    2
  );

  return (
    <div className="space-y-10">
      <section className="flex animate-[fade-in-up_0.6s_ease-out_both] flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {badge.name} #{badge.id}
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
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50"
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
            <div className="flex h-48 w-48 items-center justify-center rounded-full border-[10px] border-amber-900/60 bg-white text-sm font-semibold text-amber-900">
              {badge.name}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm text-slate-600">
            {badge.description}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {copy.onChainTitle}
              </h2>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                {badge.status === "on-sale"
                  ? copy.statusLabels.onSale
                  : copy.statusLabels.notListed}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { label: copy.dataLabels.owner, value: badge.owner },
                { label: copy.dataLabels.theme, value: badge.theme },
                { label: copy.dataLabels.minted, value: badge.mintedAt },
                { label: copy.dataLabels.royalty, value: badge.royalty },
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
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {copy.dataLabels.tokenUri}
                </p>
                <p className="mt-2 font-semibold text-slate-700">
                  {badge.tokenURI}
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
            <div className="mt-5 flex flex-wrap gap-3">
              {badge.status === "on-sale" ? (
                <button
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-amber-50"
                  type="button"
                >
                  {copy.actions.buy} {badge.price}
                </button>
              ) : (
                <button
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-amber-50"
                  type="button"
                >
                  {copy.actions.list}
                </button>
              )}
              {badge.status === "on-sale" ? (
                <button
                  className="rounded-full border border-slate-900/10 bg-white px-5 py-2 text-xs font-semibold text-slate-600"
                  type="button"
                >
                  {copy.actions.cancel}
                </button>
              ) : null}
              <button
                className="rounded-full border border-slate-900/10 bg-white px-5 py-2 text-xs font-semibold text-slate-600"
                type="button"
              >
                {copy.actions.transfer}
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {copy.attributesTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {badge.attributes.map((attr) => (
                <div
                  className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm"
                  key={attr.trait}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {attr.trait}
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
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {badge.lastSale ?? "--"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                <p className="uppercase tracking-[0.28em]">
                  {copy.listingStatus}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {badge.status === "on-sale"
                    ? copy.listingActive
                    : copy.listingInactive}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
