import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  type BadgeFilter,
  type BadgeListItem,
  type BadgeStatus,
} from "./types";
import { myBadgesContent } from "../i18n";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";

type BadgeLanguageDict = (typeof myBadgesContent)[keyof typeof myBadgesContent];

const statusStyles: Record<BadgeStatus, string> = {
  saved: "bg-amber-100 text-amber-900",
  minted: "bg-slate-900 text-amber-100",
  listed: "bg-emerald-100 text-emerald-900",
};

type BadgeLibrarySectionProps = {
  badges: BadgeListItem[];
  languageDic: BadgeLanguageDict;
  isLoading?: boolean;
  isMinting: boolean;
  isListingBusy?: boolean;
  isDeleting?: boolean;
  filters: Array<{ key: BadgeFilter; label: string }>;
  activeFilter: BadgeFilter;
  onFilterChange: (filter: BadgeFilter) => void;
  onMint: (badge: BadgeListItem) => void;
  onList: (badge: BadgeListItem) => void;
  onCancel: (badge: BadgeListItem) => void;
  onDelete: (badge: BadgeListItem) => void;
};

export function BadgeLibrarySection({
  badges,
  languageDic,
  isLoading,
  isMinting,
  isListingBusy,
  isDeleting,
  filters,
  activeFilter,
  onFilterChange,
  onMint,
  onList,
  onCancel,
  onDelete,
}: BadgeLibrarySectionProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "cancel" | "delete" | null;
    badge: BadgeListItem | null;
  }>({
    open: false,
    action: null,
    badge: null,
  });

  const dialogCopy = languageDic.confirmDialog;
  const dialogTitle =
    confirmDialog.action === "delete"
      ? dialogCopy.deleteTitle
      : dialogCopy.cancelTitle;
  const dialogDescription =
    confirmDialog.action === "delete"
      ? dialogCopy.deleteDescription
      : dialogCopy.cancelDescription;
  const confirmDisabled =
    confirmDialog.action === "cancel"
      ? Boolean(isListingBusy)
      : confirmDialog.action === "delete"
      ? Boolean(isDeleting)
      : false;
  const confirmClassName =
    confirmDialog.action === "delete"
      ? "rounded-full border border-rose-200 bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-900 shadow-sm shadow-rose-200/60 transition hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-300/30 dark:bg-rose-500/10 dark:text-rose-100 dark:shadow-[0_0_12px_rgba(244,63,94,0.25)] dark:hover:bg-rose-500/20 dark:hover:shadow-[0_0_18px_rgba(244,63,94,0.35)]"
      : "rounded-full border border-slate-900/10 bg-slate-900 px-4 py-2 text-xs font-semibold text-amber-50 shadow-sm shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-300/30 dark:bg-cyan-500/10 dark:text-cyan-100 dark:shadow-[0_0_12px_rgba(34,211,238,0.3)] dark:hover:bg-cyan-500/20 dark:hover:shadow-[0_0_18px_rgba(34,211,238,0.45)]";

  const handleConfirm = () => {
    if (!confirmDialog.badge || !confirmDialog.action) {
      setConfirmDialog({ open: false, action: null, badge: null });
      return;
    }
    if (confirmDialog.action === "cancel") {
      onCancel(confirmDialog.badge);
    } else {
      onDelete(confirmDialog.badge);
    }
    setConfirmDialog({ open: false, action: null, badge: null });
  };

  return (
    <section
      className="relative rounded-[28px] p-6 animate-[fade-in-up_0.6s_ease-out_both]"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {languageDic.libraryTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "border-slate-900/20 bg-slate-900 text-amber-100"
                    : "border-slate-900/10 bg-white text-slate-600 hover:border-slate-900/20 hover:text-slate-900"
                }`}
                key={filter.key}
                type="button"
                onClick={() => {
                  onFilterChange(filter.key);
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {badges.map((badge) => {
          const detailId = badge.tokenId
            ? badge.tokenId.replace("#", "")
            : badge.id;
          const tokenIdLabel = badge.tokenId ? `#${badge.tokenId}` : "--";
          const listingPriceLabel =
            badge.status === "listed"
              ? badge.price
                ? `${badge.price} ETH`
                : "--"
              : languageDic.actions.notListed;
          const tokenIdDetail = badge.tokenId
            ? `${tokenIdLabel} - ${listingPriceLabel}`
            : "--";
          const listingIdDetail = badge.listingId ?? "--";
          return (
            <div
              className="flex flex-col gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 shadow-sm border-bright"
              key={badge.id}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
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
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
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
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                  <p className="uppercase tracking-[0.28em]">
                    {languageDic.cardLabels.tokenId}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {tokenIdDetail}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 sm:col-span-2">
                  <p className="uppercase tracking-[0.28em]">
                    {languageDic.cardLabels.listing}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {listingIdDetail}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {badge.status === "saved" ? (
                  <button
                    className="rounded-full border border-emerald-300/50 bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm shadow-emerald-200/60 transition hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-300/30 dark:bg-emerald-500/10 dark:text-emerald-100 dark:shadow-[0_0_12px_rgba(16,185,129,0.25)] dark:hover:bg-emerald-500/20 dark:hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]"
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
                    className="rounded-full border border-slate-900/10 bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-900 shadow-sm shadow-rose-200/60 transition hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-300/30 dark:bg-rose-500/10 dark:text-rose-100 dark:shadow-[0_0_12px_rgba(244,63,94,0.25)] dark:hover:bg-rose-500/20 dark:hover:shadow-[0_0_18px_rgba(244,63,94,0.35)]"
                    disabled={isListingBusy}
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        action: "cancel",
                        badge,
                      });
                    }}
                  >
                    {languageDic.actions.cancel}
                  </button>
                ) : null}
                {badge.status === "minted" ? (
                  <button
                    className="rounded-full border border-slate-900/10 bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900 shadow-sm shadow-amber-200/60 transition hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-300/30 dark:bg-amber-400/10 dark:text-amber-100 dark:shadow-[0_0_12px_rgba(251,191,36,0.25)] dark:hover:bg-amber-400/20 dark:hover:shadow-[0_0_18px_rgba(251,191,36,0.35)]"
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
                  className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600 border-bright hover:-translate-y-0.5"
                  href={`/badges/${detailId}`}
                >
                  {languageDic.actions.view}
                </Link>
                {badge.status === "saved" ? (
                  <button
                    className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDeleting}
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        action: "delete",
                        badge,
                      });
                    }}
                  >
                    {languageDic.actions.delete}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/80 text-xs font-semibold text-slate-700 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-4 py-2 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            {languageDic.refreshFeedback?.loading ?? "Loading..."}
          </div>
        </div>
      ) : null}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({ open: false, action: null, badge: null });
          }
        }}
      >
        <DialogContent className="border-slate-900/10 bg-white/90 backdrop-blur dark:border-cyan-400/20 dark:bg-slate-900/80">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className="space-y-2">
              <span className="block">{dialogDescription}</span>
              {confirmDialog.badge?.name ? (
                <span className="block text-sm font-semibold text-slate-900">
                  {confirmDialog.badge.name}
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-3">
            <DialogClose asChild>
              <button
                className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:-translate-y-0.5"
                type="button"
              >
                {dialogCopy.cancel}
              </button>
            </DialogClose>
            <button
              className={confirmClassName}
              disabled={confirmDisabled}
              type="button"
              onClick={handleConfirm}
            >
              {dialogCopy.confirm}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
