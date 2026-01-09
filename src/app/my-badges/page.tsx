"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@src/components/LanguageProvider";
import { myBadgesContent, global } from "../i18n";
import {
  useConnection,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { BaseError, ContractFunctionRevertedError, parseEventLogs } from "viem";
import { badgeNftAbi, useWriteBadgeNftMintBadge } from "@src/generated/wagmi";
import { BadgeRecordStatus, type BadgeConfig } from "@src/types/badge";
import { BADGE_THEME_OPTIONS } from "@src/types/badge-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog";

type BadgeRecordResponse = {
  id: string;
  name: string;
  status: BadgeRecordStatus;
  config?: Partial<BadgeConfig> | null;
  imageCid?: string | null;
  imageUrl?: string | null;
  metadataCid?: string | null;
  tokenUri?: string | null;
  tokenId?: string | null;
  ipfsUrl?: string | null;
  updatedAt: string;
};

type BadgeStatus = Lowercase<BadgeRecordStatus>;

type BadgeListItem = {
  id: string;
  name: string;
  status: BadgeStatus;
  theme: string;
  updated: string;
  tokenURI?: string;
  imageCid?: string;
  imageUrl?: string;
  metadataCid?: string;
  config?: Partial<BadgeConfig> | null;
  tokenId?: string;
  price?: string;
  listed?: boolean;
  listingId?: string;
};

type MintContext = {
  badgeId: string;
  contractAddress: `0x${string}`;
  fingerprint: `0x${string}`;
  signature: `0x${string}`;
  tokenUri: string;
  account: `0x${string}`;
  value?: bigint;
};

const statusStyles: Record<BadgeStatus, string> = {
  draft: "bg-amber-100 text-amber-900",
  saved: "bg-emerald-100 text-emerald-900",
  minted: "bg-slate-900 text-amber-100",
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
  const languageDic = myBadgesContent[language];
  const globalDic = global[language];
  const locale = language === "zh" ? "zh-CN" : "en-US";

  const [badges, setBadges] = useState<BadgeRecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConnectAlert, setShowConnectAlert] = useState(false);
  const [mintFeedback, setMintFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [mintContext, setMintContext] = useState<MintContext | null>(null);
  const [mintTxHash, setMintTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );

  const { isConnected, address, chainId } = useConnection();
  const publicClient = usePublicClient();
  const { mutateAsync: mintBadgeAsync, isPending: isMinting } =
    useWriteBadgeNftMintBadge();
  const resolveMintErrorMessage = useCallback(
    (error: unknown) => {
      debugger;
      const fallback = languageDic.mintFeedback.error;
      if (error instanceof BaseError) {
        const rejected = error.walk(
          (err) =>
            (err as { name?: string }).name === "UserRejectedRequestError"
        );
        if (rejected) {
          return languageDic.mintErrors.userRejected;
        }

        const reverted = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        ) as ContractFunctionRevertedError | null;
        const errorName = reverted?.data?.errorName;
        if (errorName) {
          if (errorName === "BadgeAlreadyMinted") {
            const tokenId = reverted?.data?.args?.[1];
            const tokenIdLabel =
              typeof tokenId === "bigint" ? ` #${tokenId.toString()}` : "";
            return `${languageDic.mintErrors.BadgeAlreadyMinted}${tokenIdLabel}`;
          }
          if (errorName === "EmptyTokenURI") {
            return languageDic.mintErrors.EmptyTokenURI;
          }
          if (errorName === "NotEnoughTokens") {
            return languageDic.mintErrors.NotEnoughTokens;
          }
          if (errorName === "BeyondPerWallectMaxTokens") {
            return languageDic.mintErrors.BeyondPerWallectMaxTokens;
          }
          if (errorName === "InsufficientFee") {
            return languageDic.mintErrors.InsufficientFee;
          }
          if (errorName === "InvalidSignature") {
            return languageDic.mintErrors.InvalidSignature;
          }
          if (errorName === "NotAllowedReduceMaxPerWallet") {
            return languageDic.mintErrors.NotAllowedReduceMaxPerWallet;
          }
        }

        if (reverted?.reason) {
          return reverted.reason;
        }
      }

      if (error instanceof Error && error.message) {
        return error.message;
      }

      return fallback;
    },
    [languageDic.mintFeedback.error, languageDic.mintErrors]
  );

  const clearMintContext = useCallback(() => {
    setMintContext(null);
  }, []);

  const loadBadges = useCallback(async () => {
    if (!address) {
      setBadges([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/badges?userId=${encodeURIComponent(address)}`
      );
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
  }, [address]);

  // Receipt is for on-chain success/revert status only;
  // errors here indicate receipt polling failures (RPC, timeout, replaced tx), not contract reverts.
  const { data: mintReceipt, error: mintReceiptError } =
    useWaitForTransactionReceipt({ hash: mintTxHash });

  useEffect(() => {
    if (!mintReceipt || !mintTxHash) return;
    if (mintReceipt.status === "reverted") {
      const resolveRevert = async () => {
        if (!publicClient || !mintContext) {
          setMintFeedback({
            type: "error",
            message: languageDic.mintFeedback.error,
          });
          clearMintContext();
          setMintTxHash(undefined);
          return;
        }

        const {
          contractAddress,
          fingerprint,
          signature,
          tokenUri,
          account,
          value,
        } = mintContext;

        try {
          await publicClient.simulateContract({
            address: contractAddress,
            abi: badgeNftAbi,
            functionName: "mintBadge",
            args: [account, tokenUri, fingerprint, signature],
            account,
            value,
            blockNumber: mintReceipt.blockNumber,
          });
          setMintFeedback({
            type: "error",
            message: languageDic.mintFeedback.error,
          });
        } catch (error) {
          setMintFeedback({
            type: "error",
            message: resolveMintErrorMessage(error),
          });
        } finally {
          clearMintContext();
          setMintTxHash(undefined);
        }
      };

      void resolveRevert();
      return;
    }
    const finalizeMint = async () => {
      const badgeId = mintContext?.badgeId;
      const mintedTokenId = (() => {
        if (!mintContext) return undefined;
        try {
          const logs = parseEventLogs({
            abi: badgeNftAbi,
            logs: mintReceipt.logs,
            eventName: "BadgeMinted",
            strict: false,
          });
          const account = mintContext.account.toLowerCase();
          const fingerprint = mintContext.fingerprint.toLowerCase();
          const match = logs.find((log) => {
            const to = log.args?.to;
            const logFingerprint = log.args?.fingerprint;
            if (!to || !logFingerprint) return false;
            return (
              to.toLowerCase() === account &&
              logFingerprint.toLowerCase() === fingerprint
            );
          });
          const tokenId = match?.args?.tokenId;
          return typeof tokenId === "bigint" ? tokenId.toString() : undefined;
        } catch (error) {
          console.warn("Failed to parse BadgeMinted event", error);
          return undefined;
        }
      })();

      if (!mintedTokenId) {
        console.warn("Minted tokenId not found in receipt logs.");
      }

      const userId = mintContext?.account;
      if (badgeId && userId) {
        try {
          const response = await fetch(`/api/badges/${badgeId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: BadgeRecordStatus.Minted,
              tokenId: mintedTokenId,
              userId,
            }),
          });
          if (!response.ok) {
            console.error("Failed to update badge status");
          }
        } catch (error) {
          console.error("Failed to update badge status", error);
        }
      }

      setMintFeedback({
        type: "success",
        message: languageDic.mintFeedback.success,
      });
      clearMintContext();
      setMintTxHash(undefined);
      void loadBadges();
    };

    void finalizeMint();
  }, [
    mintReceipt,
    mintTxHash,
    languageDic.mintFeedback.success,
    languageDic.mintFeedback.error,
    clearMintContext,
    loadBadges,
    mintContext,
    publicClient,
    resolveMintErrorMessage,
  ]);

  useEffect(() => {
    if (!mintReceiptError || !mintTxHash) return;
    setMintFeedback({
      type: "error",
      message: resolveMintErrorMessage(mintReceiptError),
    });
    clearMintContext();
    setMintTxHash(undefined);
  }, [mintReceiptError, mintTxHash, resolveMintErrorMessage, clearMintContext]);

  useEffect(() => {
    void loadBadges();
  }, [loadBadges]);

  const displayBadges = useMemo<BadgeListItem[]>(() => {
    return badges.map((badge) => {
      const config =
        badge.config && typeof badge.config === "object"
          ? (badge.config as Partial<BadgeConfig>)
          : {};
      const theme = BADGE_THEME_OPTIONS.find(
        (option) => option.id === config.Theme
      )?.labels[language];
      const updated = new Date(badge.updatedAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const status = badge.status.toLowerCase() as BadgeStatus;
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
        updated,
        tokenId: typeof badge.tokenId === "string" ? badge.tokenId : undefined,
        tokenURI,
        imageCid: imageCid ?? undefined,
        imageUrl,
        metadataCid: metadataCid ?? undefined,
        config,
      };
    });
  }, [badges, language, locale]);

  const badgeStats = useMemo(() => {
    const saved = badges.filter(
      (badge) => badge.status === BadgeRecordStatus.Saved
    ).length;
    const minted = badges.filter(
      (badge) => badge.status === BadgeRecordStatus.Minted
    ).length;
    return { saved, minted };
  }, [badges]);

  const mint = async (badge: BadgeListItem) => {
    // check the login state
    if (!isConnected || !address || !chainId) {
      setShowConnectAlert(true);
      return;
    }

    if (!badge.tokenURI || !badge.metadataCid) {
      console.error("Missing token metadata for minting.");
      return;
    }

    try {
      setMintFeedback(null);
      setMintTxHash(undefined);

      // get the finger and signature
      const response = await fetch("/api/mint-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: address,
          // tokenURI: badge.tokenURI,
          cid: badge.metadataCid,
          chainId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get mint signature");
      }
      const { signature, fingerprint, contractAddress } =
        (await response.json()) as {
          signature?: `0x${string}`;
          fingerprint?: `0x${string}`;
          contractAddress?: `0x${string}`;
        };

      if (!signature || !fingerprint || !contractAddress) {
        throw new Error("Invalid mint signature response");
      }

      // call the mint function on the contract
      let mintValue: bigint | undefined;
      if (publicClient) {
        try {
          const price = await publicClient.readContract({
            address: contractAddress,
            abi: badgeNftAbi,
            functionName: "price",
          });
          if (typeof price === "bigint" && price > 0n) {
            mintValue = price;
          }
          console.log(`read mint price: ${mintValue}`);
        } catch (error) {
          console.warn("Failed to read mint price", error);
        }

        try {
          await publicClient.simulateContract({
            address: contractAddress,
            abi: badgeNftAbi,
            functionName: "mintBadge",
            args: [address, badge.tokenURI, fingerprint, signature],
            account: address,
            value: mintValue,
          });
        } catch (error) {
          setMintFeedback({
            type: "error",
            message: resolveMintErrorMessage(error),
          });
          clearMintContext();
          return;
        }
      }

      setMintContext({
        badgeId: badge.id,
        contractAddress,
        fingerprint,
        signature,
        tokenUri: badge.tokenURI,
        account: address,
        value: mintValue,
      });
      const txHash = await mintBadgeAsync({
        abi: badgeNftAbi,
        functionName: "mintBadge",
        address: contractAddress,
        args: [address, badge.tokenURI, fingerprint, signature],
        value: mintValue,
      });
      console.log("mint tx hash:", txHash);
      setMintTxHash(txHash);
    } catch (error) {
      console.error("Failed to mint badge", error);
      setMintFeedback({
        type: "error",
        message: resolveMintErrorMessage(error),
      });
      clearMintContext();
      setMintTxHash(undefined);
    }
  };

  return (
    <div className="space-y-10">
      <AlertDialog open={showConnectAlert} onOpenChange={setShowConnectAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{globalDic.connectAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {globalDic.connectAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {globalDic.connectAlert.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
              href="/builder"
            >
              {languageDic.newBadge}
            </Link>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              disabled={loading}
              onClick={loadBadges}
              type="button"
            >
              {loading ? `${languageDic.refresh}...` : languageDic.refresh}
            </button>
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {languageDic.walletSnapshot}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: languageDic.walletStats[0]?.label ?? "Saved",
                value: badgeStats.saved,
              },
              {
                label: languageDic.walletStats[1]?.label ?? "Minted",
                value: badgeStats.minted,
              },
              {
                label: languageDic.walletStats[2]?.label ?? "Listed",
                value: 0,
              },
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
            {languageDic.tokenNote}
          </div>
          {mintFeedback ? (
            <div
              className={`mt-4 rounded-2xl border p-4 text-xs ${
                mintFeedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50/80 text-emerald-900"
                  : "border-rose-200 bg-rose-50/80 text-rose-900"
              }`}
            >
              {mintFeedback.message}
            </div>
          ) : null}
        </div>
      </section>

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
                    {badge.listed ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-900">
                        {languageDic.listedTag}
                      </span>
                    ) : null}
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
                        {badge.price ?? languageDic.actions.notListed}
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
                        mint(badge);
                      }}
                    >
                      {languageDic.actions.mint}
                    </button>
                  ) : null}
                  {badge.status === "minted" && badge.listed ? (
                    <button
                      className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900"
                      type="button"
                    >
                      {languageDic.actions.cancel}
                    </button>
                  ) : null}
                  {badge.status === "minted" && !badge.listed ? (
                    <button
                      className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-900"
                      type="button"
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
    </div>
  );
}
