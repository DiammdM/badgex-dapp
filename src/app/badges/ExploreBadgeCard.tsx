"use client";

import Image from "next/image";
import Link from "next/link";
import { badgesContent, type Language } from "../i18n";

type BadgeCopy = (typeof badgesContent)[keyof typeof badgesContent];

export type ExploreBadge = {
  id: string;
  tokenId?: string;
  name: string;
  owner: string;
  theme: string;
  category: string;
  mintedAt: string;
  listed: boolean;
  price?: string;
  imageUrl?: string | null;
};

type ExploreBadgeCardProps = {
  badge: ExploreBadge;
  copy: BadgeCopy;
  language: Language;
};

export function ExploreBadgeCard({
  badge,
  copy,
  language,
}: ExploreBadgeCardProps) {
  const displayId = badge.tokenId ?? badge.id;
  const priceLabel = badge.price
    ? badge.price.toLowerCase().includes("eth")
      ? badge.price
      : `${badge.price} ETH`
    : "--";

  return (
    <div className="rounded-[26px] border border-slate-900/10 bg-white/75 p-5 shadow-sm border-bright">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
          #{displayId}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 p-6">
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-[8px] border-amber-900/60 bg-white text-xs font-semibold text-amber-900">
          {badge.imageUrl ? (
            <Image
              alt={badge.name}
              className="object-cover"
              fill
              sizes="128px"
              src={badge.imageUrl}
            />
          ) : (
            badge.name
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-lg font-semibold text-slate-900">{badge.name}</p>
        <p className="text-sm text-slate-500">{badge.theme}</p>
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
          <span className="text-slate-500">{copy.listingLabel}</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              badge.listed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {badge.listed ? copy.listedTag : copy.notListedTag}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{copy.priceLabel}</span>
          {badge.listed ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              {priceLabel}
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {copy.notListedTag}
            </span>
          )}
        </div>
      </div>
      <div className="mt-5">
        <Link
          className="block w-full rounded-full border border-slate-900/10 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-600 border-bright hover:-translate-y-0.5"
          href={`/badges/${displayId}`}
        >
          {copy.viewDetails}
        </Link>
      </div>
    </div>
  );
}
