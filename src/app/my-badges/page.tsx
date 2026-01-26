"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@src/components/LanguageProvider";
import { myBadgesContent, global } from "../i18n";
import { toast } from "sonner";
import {
  useConnection,
  usePublicClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  BaseError,
  ContractFunctionRevertedError,
  parseEther,
  parseEventLogs,
} from "viem";
import {
  badgeNftAbi,
  marketplaceAbi,
  useWriteBadgeNftMintBadge,
  useWriteBadgeNftSetApprovalForAll,
  useWriteMarketplaceList,
  useWriteMarketplaceCancel,
} from "@src/generated/wagmi";
import { BadgeRecordStatus, type BadgeConfig } from "@src/types/badge";
import { BADGE_THEME_OPTIONS } from "@src/types/badge-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@src/components/ui/alert-dialog";
import { BadgeLibrarySection } from "./BadgeLibrarySection";
import {
  type BadgeListItem,
  type BadgeStatus,
  type BadgeFilter,
  type BadgeRecordResponse,
  type MintContext,
  type ListingContext,
  type CancelContext,
} from "./types";

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

const BADGE_NFT_ADDRESS = process.env
  .NEXT_PUBLIC_BADGE_NFT_ADDRESS as `0x${string}`;

const BADGE_MARKETPLACE_ADDRESS = process.env
  .NEXT_PUBLIC_BADGE_MARKETPLACE_ADDRESS as `0x${string}`;

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
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [mintContext, setMintContext] = useState<MintContext | null>(null);
  const [mintTxHash, setMintTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [listingTxHash, setListingTxHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [listingContext, setListingContext] = useState<ListingContext | null>(
    null
  );
  const [cancelContext, setCancelContext] = useState<CancelContext | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [cancelTxHash, setCancelTxHash] = useState<`0x${string}` | undefined>();
  const [listingDialog, setListingDialog] = useState<{
    open: boolean;
    badge: BadgeListItem | null;
    price: string;
    error?: string;
  }>({
    open: false,
    badge: null,
    price: "",
  });
  const { isConnected, address, chainId } = useConnection();
  const publicClient = usePublicClient();
  const { mutateAsync: mintBadgeAsync, isPending: isMinting } =
    useWriteBadgeNftMintBadge();
  const { mutateAsync: listBadgeAsync, isPending: isListing } =
    useWriteMarketplaceList();
  const { mutateAsync: cancelListingAsync, isPending: isCancelingTx } =
    useWriteMarketplaceCancel();
  const { mutateAsync: approveMarketplaceAsync } =
    useWriteBadgeNftSetApprovalForAll();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const manualRefreshRef = useRef(false);
  const [activeFilter, setActiveFilter] = useState<BadgeFilter>("all");
  const isCanceling = isCancelingTx || cancelingId !== null;
  const isListingBusy =
    isListing || isApproving || !!listingTxHash || isCanceling;

  const loadBadges = useCallback(async () => {
    const wasManualRefresh = manualRefreshRef.current;
    manualRefreshRef.current = false;
    if (!address) {
      setBadges([]);
      if (wasManualRefresh) {
        toast.error(languageDic.refreshFeedback?.error ?? "Refresh failed");
      }
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
      if (wasManualRefresh) {
        toast.success(languageDic.refreshFeedback?.success ?? "Status updated");
      }
    } catch (error) {
      console.error(error);
      setBadges([]);
      if (wasManualRefresh) {
        toast.error(languageDic.refreshFeedback?.error ?? "Refresh failed");
      }
    } finally {
      setLoading(false);
    }
  }, [
    address,
    languageDic.refreshFeedback?.error,
    languageDic.refreshFeedback?.success,
  ]);

  const resolveMarketErrorMessage = useCallback(
    (error: unknown) => {
      if (error instanceof BaseError) {
        const reverted = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        ) as ContractFunctionRevertedError | null;
        const errorName = reverted?.data?.errorName;
        if (errorName) {
          const map = languageDic.marketplaceErrors;
          if (errorName in map) {
            return map[errorName as keyof typeof map];
          }
          return errorName;
        }
        return error.shortMessage || error.message;
      }
      if (error instanceof Error && error.message) {
        return error.message;
      }
    },
    [languageDic.marketplaceErrors]
  );
  const resolveMintErrorMessage = useCallback(
    (error: unknown) => {
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

  const resetListingDialog = useCallback(() => {
    setListingDialog({ open: false, badge: null, price: "", error: undefined });
  }, []);

  const handleCanceledListing = useCallback(
    async ({
      badgeId,
      account,
    }: {
      badgeId?: string;
      account?: `0x${string}`;
    }) => {
      const userId = account ?? address;
      if (badgeId && userId) {
        try {
          const response = await fetch(`/api/badges/${badgeId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: BadgeRecordStatus.Minted,
              userId,
              listingId: null,
              price: null,
            }),
          });
          if (!response.ok) {
            console.error("Failed to update badge after cancel");
          }
        } catch (error) {
          console.error("Failed to update badge after cancel", error);
        }
      }

      void loadBadges();
    },
    [address, loadBadges]
  );

  const finalizeMintFromEvent = useCallback(
    async (tokenId: string, tokenUri: string) => {
      try {
        const response = await fetch(`/api/badges/by-token-uri`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: BadgeRecordStatus.Minted,
            tokenId,
            tokenUri,
          }),
        });
        if (!response.ok) {
          console.error("Failed to update badge status");
        }
      } catch (error) {
        console.error("Failed to update badge status", error);
      }

      setMintFeedback({
        type: "success",
        message: languageDic.mintFeedback.success,
      });
      clearMintContext();
      setMintTxHash(undefined);
      void loadBadges();
    },
    [languageDic.mintFeedback.success, clearMintContext, loadBadges]
  );

  const openListingDialog = useCallback((badge: BadgeListItem) => {
    const normalizedPrice =
      typeof badge.price === "string"
        ? badge.price.replace(/\s*eth$/i, "").trim()
        : "";
    setListingDialog({
      open: true,
      badge,
      price: normalizedPrice,
      error: undefined,
    });
  }, []);

  // Receipt is for on-chain success/revert status only;
  // errors here indicate receipt polling failures (RPC, timeout, replaced tx), not contract reverts.
  const { data: mintReceipt, error: mintReceiptError } =
    useWaitForTransactionReceipt({ hash: mintTxHash });
  const { data: listingReceipt, error: listingReceiptError } =
    useWaitForTransactionReceipt({ hash: listingTxHash });
  const { data: cancelReceipt, error: cancelReceiptError } =
    useWaitForTransactionReceipt({ hash: cancelTxHash });

  const finalizeListingStatus = useCallback(
    async ({
      badgeId,
      account,
      price,
      listingId,
    }: {
      badgeId: string;
      account: string;
      price: string;
      listingId: string;
    }) => {
      try {
        const response = await fetch(`/api/badges/${badgeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: BadgeRecordStatus.Listed,
            userId: account,
            price,
            listingId,
          }),
        });
        if (!response.ok) {
          console.error("Failed to update listing status");
        }
      } catch (error) {
        console.error("Failed to update listing status", error);
      }

      setListingContext(null);
      setListingTxHash(undefined);
      void loadBadges();
    },
    [loadBadges]
  );

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

    if (mintReceipt.status !== "success") return;

    const finalizeFromReceipt = async () => {
      try {
        const logs = parseEventLogs({
          abi: badgeNftAbi,
          logs: mintReceipt.logs,
          eventName: "BadgeMinted",
          strict: false,
        });

        const log = logs[0];
        const tokenId = log?.args?.tokenId?.toString();
        const tokenUri = log?.args?.tokenURI;
        if (!tokenUri || !tokenId) {
          throw new Error("Missing tokenUri or userId from BadgeMinted log");
        }

        await finalizeMintFromEvent(tokenId, tokenUri);
        return;
      } catch (error) {
        console.warn("Failed to parse BadgeMinted event", error);
      }

      clearMintContext();
      setMintTxHash(undefined);
    };

    void finalizeFromReceipt();
  }, [
    mintReceipt,
    mintTxHash,
    languageDic.mintFeedback.error,
    languageDic.mintFeedback.success,
    clearMintContext,
    mintContext,
    publicClient,
    resolveMintErrorMessage,
    finalizeMintFromEvent,
    address,
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
    if (!listingReceipt || !listingTxHash || !listingContext) return;
    if (listingReceipt.status === "reverted") {
      const resolveRevert = async () => {
        let message = languageDic.listingDialog.txError as string;
        try {
          if (!publicClient) {
            setListingDialog((prev) => ({
              ...prev,
              open: true,
              error: message,
            }));
            setListingContext(null);
            setListingTxHash(undefined);
            return;
          }

          const tokenId = BigInt(listingContext.tokenId);
          const priceInWei = parseEther(listingContext.price);
          await publicClient.simulateContract({
            address: BADGE_MARKETPLACE_ADDRESS,
            abi: marketplaceAbi,
            functionName: "list",
            args: [BADGE_NFT_ADDRESS, tokenId, priceInWei],
            account: listingContext.account,
            blockNumber: listingReceipt.blockNumber,
          });
        } catch (error) {
          const resolved = resolveMarketErrorMessage(error);
          if (resolved) {
            message = resolved;
          }
        }
        setListingDialog((prev) => ({
          ...prev,
          open: true,
          error: message,
        }));
        setListingContext(null);
        setListingTxHash(undefined);
        return;
      };

      void resolveRevert();
      return;
    }

    if (listingReceipt.status !== "success") return;

    const finalizeListing = async () => {
      let listingId: string | undefined;
      try {
        const logs = parseEventLogs({
          abi: marketplaceAbi,
          logs: listingReceipt.logs,
          eventName: "Listed",
          strict: false,
        });
        listingId = logs[0]?.args?.listingId?.toString();
      } catch (error) {
        console.warn("Failed to parse listing logs", error);
      }

      await finalizeListingStatus({
        badgeId: listingContext.badgeId,
        account: listingContext.account,
        price: listingContext.price,
        listingId: listingId ?? listingContext.fallbackListingId,
      });
    };

    void finalizeListing();
  }, [
    listingReceipt,
    listingTxHash,
    listingContext,
    languageDic.listingDialog.txError,
    publicClient,
    resolveMarketErrorMessage,
    finalizeListingStatus,
    loadBadges,
  ]);

  useEffect(() => {
    if (!cancelReceipt || !cancelTxHash || !cancelContext) return;
    if (cancelReceipt.status === "reverted") {
      const resolveRevert = async () => {
        let message = languageDic.listingDialog.txError as string;
        try {
          if (publicClient) {
            const listingId = BigInt(cancelContext.listingId);
            await publicClient.simulateContract({
              address: BADGE_MARKETPLACE_ADDRESS,
              abi: marketplaceAbi,
              functionName: "cancel",
              args: [listingId],
              account: cancelContext.account,
              blockNumber: cancelReceipt.blockNumber,
            });
          }
        } catch (error) {
          const resolved = resolveMarketErrorMessage(error);
          if (resolved) {
            message = resolved;
          }
        }
        setCancelError(message);
        setCancelContext(null);
        setCancelTxHash(undefined);
        setCancelingId(null);
      };

      void resolveRevert();
      return;
    }

    if (cancelReceipt.status !== "success") return;

    const finalizeCancel = async () => {
      await handleCanceledListing({
        badgeId: cancelContext.badgeId,
        account: cancelContext.account,
      });

      setCancelContext(null);
      setCancelTxHash(undefined);
      setCancelingId(null);
    };

    void finalizeCancel();
  }, [
    cancelReceipt,
    cancelTxHash,
    cancelContext,
    languageDic.listingDialog.txError,
    publicClient,
    resolveMarketErrorMessage,
    handleCanceledListing,
  ]);

  useEffect(() => {
    if (!listingReceiptError || !listingTxHash) return;
    setListingDialog((prev) => ({
      ...prev,
      open: true,
      error: resolveMarketErrorMessage(listingReceiptError),
    }));
    setListingContext(null);
    setListingTxHash(undefined);
  }, [listingReceiptError, listingTxHash, resolveMarketErrorMessage]);

  useEffect(() => {
    if (!cancelReceiptError || !cancelTxHash) return;
    setCancelError(
      resolveMarketErrorMessage(cancelReceiptError) ??
        languageDic.listingDialog.txError
    );
    setCancelContext(null);
    setCancelTxHash(undefined);
    setCancelingId(null);
  }, [
    cancelReceiptError,
    cancelTxHash,
    resolveMarketErrorMessage,
    languageDic.listingDialog.txError,
  ]);

  useEffect(() => {
    void loadBadges();
  }, [loadBadges]);

  const filterOptions = useMemo(() => {
    const labels = Array.isArray(languageDic.filters)
      ? languageDic.filters
      : [];
    return [
      { key: "all" as const, label: labels[0] ?? "All" },
      { key: "saved" as const, label: labels[1] ?? "Saved" },
      { key: "minted" as const, label: labels[2] ?? "Minted" },
      { key: "listed" as const, label: labels[3] ?? "Listed" },
    ];
  }, [languageDic.filters]);

  const displayBadges = useMemo<BadgeListItem[]>(() => {
    return badges
      .filter((badge) => badge.status !== BadgeRecordStatus.Draft)
      .map((badge) => {
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
            : typeof (badge as { tokenURI?: string | null }).tokenURI ===
              "string"
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
          tokenId:
            typeof badge.tokenId === "string" ? badge.tokenId : undefined,
          tokenURI,
          imageCid: imageCid ?? undefined,
          imageUrl,
          metadataCid: metadataCid ?? undefined,
          config,
          price: badge.price ?? undefined,
          listingId: badge.listingId ?? undefined,
        };
      });
  }, [badges, language, locale]);

  const filteredBadges = useMemo(() => {
    if (activeFilter === "all") {
      return displayBadges;
    }
    return displayBadges.filter((badge) => badge.status === activeFilter);
  }, [activeFilter, displayBadges]);

  const badgeStats = useMemo(() => {
    const saved = badges.filter(
      (badge) => badge.status === BadgeRecordStatus.Saved
    ).length;
    const minted = badges.filter(
      (badge) => badge.status === BadgeRecordStatus.Minted
    ).length;
    const listed = badges.filter(
      (badge) => badge.status === BadgeRecordStatus.Listed
    ).length;
    return { saved, minted, listed };
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

  const list = (badge: BadgeListItem) => {
    // check the login state
    if (!isConnected || !address || !chainId) {
      setShowConnectAlert(true);
      return;
    }

    if (isListingBusy) return;

    if (badge.status !== "minted") {
      return;
    }

    openListingDialog(badge);
  };

  const cancel = async (badge: BadgeListItem) => {
    if (!isConnected || !address || !chainId) {
      setShowConnectAlert(true);
      return;
    }

    if (isListingBusy) return;

    if (!badge.listingId) {
      console.error("Missing listingId for cancel.");
      return;
    }

    if (!BADGE_MARKETPLACE_ADDRESS) {
      console.error("Missing marketplace address for cancel.");
      return;
    }

    const listingIdStr = badge.listingId.trim().replace(/^#/, "");
    if (!listingIdStr || Number.isNaN(Number(listingIdStr))) {
      console.error("Invalid listingId for cancel.");
      return;
    }

    try {
      setCancelingId(badge.id);
      setCancelError(null);
      const listingId = BigInt(listingIdStr);

      if (publicClient) {
        await publicClient.simulateContract({
          address: BADGE_MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "cancel",
          args: [listingId],
          account: address,
        });
      }

      const txHash = await cancelListingAsync({
        address: BADGE_MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "cancel",
        args: [listingId],
        account: address,
      });

      setCancelContext({
        listingId: listingIdStr,
        account: address,
        badgeId: badge.id,
      });
      setCancelTxHash(txHash);
    } catch (error) {
      console.error("Failed to cancel listing", error);
      const message =
        resolveMarketErrorMessage(error) ?? languageDic.listingDialog.txError;
      setCancelError(message);
      setCancelingId(null);
    }
  };

  const confirmListing = async () => {
    const badge = listingDialog.badge;
    setListingDialog((prev) => ({ ...prev, error: undefined }));
    if (!badge) return;

    if (!isConnected || !address || !chainId) {
      setShowConnectAlert(true);
      return;
    }

    if (!badge.tokenId) {
      setListingDialog((prev) => ({
        ...prev,
        error: languageDic.listingDialog.txError,
      }));
      return;
    }

    if (!BADGE_MARKETPLACE_ADDRESS || !BADGE_NFT_ADDRESS) {
      setListingDialog((prev) => ({
        ...prev,
        error: languageDic.listingDialog.missingConfig,
      }));
      return;
    }

    const rawPrice = listingDialog.price.trim();
    const parsed = Number.parseFloat(rawPrice);
    if (!rawPrice || Number.isNaN(parsed) || parsed <= 0) {
      setListingDialog((prev) => ({
        ...prev,
        error: languageDic.listingDialog.error,
      }));
      return;
    }

    const tokenIdStr = badge.tokenId.replace(/^#/, "").trim();
    if (!tokenIdStr || Number.isNaN(Number(tokenIdStr))) {
      setListingDialog((prev) => ({
        ...prev,
        error: languageDic.listingDialog.txError,
      }));
      return;
    }

    const fallbackListingId =
      badge.listingId ??
      `L-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    try {
      const tokenId = BigInt(tokenIdStr);
      const priceInWei = parseEther(rawPrice);

      const approved = await publicClient.readContract({
        address: BADGE_NFT_ADDRESS,
        abi: badgeNftAbi,
        functionName: "isApprovedForAll",
        args: [address, BADGE_MARKETPLACE_ADDRESS],
      });
      if (!approved) {
        setIsApproving(true);
        try {
          await publicClient.simulateContract({
            address: BADGE_NFT_ADDRESS,
            abi: badgeNftAbi,
            functionName: "setApprovalForAll",
            args: [BADGE_MARKETPLACE_ADDRESS, true],
            account: address,
          });
          const approvalTx = await approveMarketplaceAsync({
            address: BADGE_NFT_ADDRESS,
            abi: badgeNftAbi,
            functionName: "setApprovalForAll",
            args: [BADGE_MARKETPLACE_ADDRESS, true],
            account: address,
          });
          await publicClient.waitForTransactionReceipt({
            hash: approvalTx,
          });
        } finally {
          setIsApproving(false);
        }
      }

      await publicClient.simulateContract({
        address: BADGE_MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "list",
        args: [BADGE_NFT_ADDRESS, tokenId, priceInWei],
        account: address,
      });

      const txHash = await listBadgeAsync({
        address: BADGE_MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "list",
        args: [BADGE_NFT_ADDRESS, tokenId, priceInWei],
        account: address,
      });

      setListingContext({
        badgeId: badge.id,
        price: parsed.toString(),
        fallbackListingId,
        account: address,
        tokenId: tokenIdStr,
      });
      setListingTxHash(txHash);
      resetListingDialog();
    } catch (error) {
      const message = resolveMarketErrorMessage(error);
      setListingDialog((prev) => ({ ...prev, error: message }));
    }
  };

  return (
    <div className="space-y-3">
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
      <AlertDialog
        open={listingDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            resetListingDialog();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {languageDic.listingDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {languageDic.listingDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {listingDialog.badge ? (
            <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                {listingDialog.badge.name}{" "}
                {listingDialog.badge.tokenId
                  ? `#${listingDialog.badge.tokenId}`
                  : ""}
              </p>
              {listingDialog.badge.tokenURI ? (
                <p className="mt-1 truncate text-[11px]">
                  {listingDialog.badge.tokenURI}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {languageDic.listingDialog.priceLabel}
            </label>
            <input
              className="w-full rounded-xl border border-slate-900/10 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-900/30 focus:ring-0"
              inputMode="decimal"
              min="0"
              onChange={(event) => {
                const value = event.target.value;
                setListingDialog((prev) => ({
                  ...prev,
                  price: value,
                  error: undefined,
                }));
              }}
              placeholder={languageDic.listingDialog.pricePlaceholder}
              step="0.0001"
              type="number"
              value={listingDialog.price}
            />
            {listingDialog.error ? (
              <p className="text-xs text-rose-600">{listingDialog.error}</p>
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetListingDialog}>
              {languageDic.listingDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isListingBusy}
              onClick={(event) => {
                event.preventDefault();
                confirmListing();
              }}
            >
              {languageDic.listingDialog.confirm}
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
              className="rounded-full border border-amber-400/70 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(251,191,36,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(251,191,36,0.45)] dark:border-cyan-300/45 dark:from-cyan-400/30 dark:via-sky-400/30 dark:to-emerald-400/30 dark:text-cyan-100 dark:shadow-[0_0_18px_rgba(34,211,238,0.35)] dark:hover:shadow-[0_0_26px_rgba(34,211,238,0.45)]"
              href="/builder"
            >
              {languageDic.newBadge}
            </Link>
            <button
              className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              disabled={loading}
              onClick={() => {
                manualRefreshRef.current = true;
                loadBadges();
              }}
              type="button"
            >
              {loading ? `${languageDic.refresh}...` : languageDic.refresh}
            </button>
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 border-bright">
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
                value: badgeStats.listed,
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
          <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-900 dark:border-cyan-300/40 dark:bg-cyan-500/10 dark:text-cyan-100">
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
          {cancelError ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-900">
              {cancelError}
            </div>
          ) : null}
        </div>
      </section>

      <BadgeLibrarySection
        badges={filteredBadges}
        languageDic={languageDic}
        isLoading={loading}
        isMinting={isMinting || isListingBusy}
        isListingBusy={isListingBusy}
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onList={list}
        onMint={mint}
        onCancel={cancel}
      />
    </div>
  );
}
