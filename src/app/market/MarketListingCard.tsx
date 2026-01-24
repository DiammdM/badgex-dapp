"use client";

import Link from "next/link";

export type MarketListing = {
  id: string;
  owner: string;
  updatedAt: string;
  displayId: string;
  name: string;
  tokenLabel: string;
  seller: string;
  priceLabel: string;
  rawPrice?: string | null;
  listingId?: string | null;
  royaltyLabel: string;
  theme: string;
  listedAt: string;
  linkId: string;
};

type MarketListingCardCopy = {
  priceLabel: string;
  feeLabel: string;
  listedLabel: string;
  buyNow: string;
  buying: string;
  viewDetails: string;
};

type MarketListingCardProps = {
  listing: MarketListing;
  languageDic: MarketListingCardCopy;
  isBuying: boolean;
  isBuyDisabled: boolean;
  onBuyNow: (listing: MarketListing) => void;
};

export function MarketListingCard({
  listing,
  languageDic,
  isBuying,
  isBuyDisabled,
  onBuyNow,
}: MarketListingCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
          {listing.displayId}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 text-xs font-semibold text-slate-700">
          {listing.name}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{listing.name}</p>
          <p className="text-sm text-slate-500">
            {listing.tokenLabel} - {listing.seller}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1">
              {listing.theme}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {languageDic.priceLabel}
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {listing.priceLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {languageDic.feeLabel}
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">1.5%</p>
        </div>
        <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {languageDic.listedLabel}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {listing.listedAt}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold cursor-pointer ${
            isBuyDisabled
              ? "cursor-not-allowed bg-slate-400 text-white/80"
              : "bg-slate-900 text-amber-50"
          }`}
          disabled={isBuyDisabled}
          onClick={() => onBuyNow(listing)}
          type="button"
        >
          {isBuying ? languageDic.buying : languageDic.buyNow}
        </button>
        <Link
          className="flex-1 rounded-full border border-slate-900/10 bg-white px-4 py-2 text-center text-xs font-semibold text-slate-600"
          href={`/badges/${listing.linkId}`}
        >
          {languageDic.viewDetails}
        </Link>
      </div>
    </div>
  );
}
