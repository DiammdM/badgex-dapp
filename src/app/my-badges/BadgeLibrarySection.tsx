import Image from "next/image";
import Link from "next/link";
import { type BadgeListItem, type BadgeStatus } from "./types";
import { myBadgesContent } from "../i18n";

type BadgeLanguageDict = (typeof myBadgesContent)[keyof typeof myBadgesContent];

const statusStyles: Record<BadgeStatus, string> = {
  draft: "bg-amber-100 text-amber-900",
  saved: "bg-emerald-100 text-emerald-900",
  minted: "bg-slate-900 text-amber-100",
  listed: "bg-amber-100 text-amber-900",
};

type BadgeLibrarySectionProps = {
  badges: BadgeListItem[];
  languageDic: BadgeLanguageDict;
  isMinting: boolean;
  isListingBusy?: boolean;
  onMint: (badge: BadgeListItem) => void;
  onList: (badge: BadgeListItem) => void;
  onCancel: (badge: BadgeListItem) => void;
};

export function BadgeLibrarySection({
  badges,
  languageDic,
  isMinting,
  isListingBusy,
  onMint,
  onList,
  onCancel,
}: BadgeLibrarySectionProps) {
  return (
    <section
      className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 animate-[fade-in-up_0.6s_ease-out_both]"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {languageDic.libraryTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {languageDic.filters.map((filter, index) => (
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
        {badges.map((badge) => {
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
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 text-xs font-semibold text-slate-700">
                    {badge.imageUrl ? (
                      <Image
                        alt={badge.name}
                        className="object-cover"
                        fill
                        sizes="64px"
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
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[badge.status]
                    }`}
                  >
                    {languageDic.statusLabels[badge.status]}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3">
                  <p className="uppercase tracking-[0.28em]">
                    {languageDic.cardLabels.updated}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {badge.updated}
                  </p>
                </div>
                {badge.tokenId ? (
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                    <p className="uppercase tracking-[0.28em]">
                      {languageDic.cardLabels.tokenId}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {`#${badge.tokenId}`} -{" "}
                      {badge.status === "listed"
                        ? `${badge.price} ETH`
                        : languageDic.actions.notListed}
                    </p>
                  </div>
                ) : null}
                {badge.listingId ? (
                  <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                    <p className="uppercase tracking-[0.28em]">
                      {languageDic.cardLabels.listing}
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
                    {languageDic.actions.save}
                  </button>
                ) : null}
                {badge.status === "saved" ? (
                  <button
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isMinting}
                    type="button"
                    onClick={() => {
                      onMint(badge);
                    }}
                  >
                    {languageDic.actions.mint}
                  </button>
                ) : null}
                {badge.status === "listed" ? (
                  <button
                    className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 cursor-pointer"
                    disabled={isListingBusy}
                    type="button"
                    onClick={() => {
                      onCancel(badge);
                    }}
                  >
                    {languageDic.actions.cancel}
                  </button>
                ) : null}
                {badge.status === "minted" ? (
                  <button
                    className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 cursor-pointer"
                    disabled={isListingBusy}
                    type="button"
                    onClick={() => {
                      onList(badge);
                    }}
                  >
                    {languageDic.actions.list}
                  </button>
                ) : null}
                <Link
                  className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                  href={`/badges/${detailId}`}
                >
                  {languageDic.actions.view}
                </Link>
                <button
                  className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                  type="button"
                >
                  {languageDic.actions.delete}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
