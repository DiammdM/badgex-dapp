import { BadgeApiPayload, BadgeRecordStatus } from "@src/types/badge";

type ApiOptions = {
  signal?: AbortSignal;
};

type MarketPurchasePayload = {
  badgeId: string;
  buyer: string;
  chainId: number;
};

type BadgePatchPayload = {
  status?: BadgeRecordStatus;
  userId?: string;
  listingId?: string | null;
  price?: string | null;
  chainId: number;
};

type BadgeTokenUriPatchPayload = {
  status: BadgeRecordStatus;
  tokenId: string;
  tokenUri: string;
  chainId: number;
};

type MintSignaturePayload = {
  to: string;
  cid: string;
  chainId: number;
};

const JSON_HEADERS = { "Content-Type": "application/json" };

const withSignal = (options?: ApiOptions) =>
  options?.signal ? { signal: options.signal } : undefined;

const withJsonBody = (body: unknown, options?: ApiOptions): RequestInit => ({
  method: "POST",
  headers: JSON_HEADERS,
  body: JSON.stringify(body),
  signal: options?.signal,
});

const withJsonPatch = (body: unknown, options?: ApiOptions): RequestInit => ({
  method: "PATCH",
  headers: JSON_HEADERS,
  body: JSON.stringify(body),
  signal: options?.signal,
});

const withJsonDelete = (body: unknown, options?: ApiOptions): RequestInit => ({
  method: "DELETE",
  headers: JSON_HEADERS,
  body: JSON.stringify(body),
  signal: options?.signal,
});

const withChainId = (params: URLSearchParams, chainId: number) => {
  const next = new URLSearchParams(params);
  next.set("chainId", String(chainId));
  return next;
};

export const fetchBadgeByTokenId = (
  tokenId: string,
  chainId: number,
  options?: ApiOptions
) =>
  fetch(
    `/api/badges/by-token-id?tokenId=${encodeURIComponent(
      tokenId
    )}&chainId=${encodeURIComponent(String(chainId))}`,
    withSignal(options)
  );

export const fetchMarketListings = (
  params: URLSearchParams,
  chainId: number,
  options?: ApiOptions
) =>
  fetch(
    `/api/badges/market?${withChainId(params, chainId).toString()}`,
    withSignal(options)
  );

export const fetchMarketActivity = (
  params: URLSearchParams,
  chainId: number,
  options?: ApiOptions
) =>
  fetch(
    `/api/badges/market/activity?${withChainId(params, chainId).toString()}`,
    withSignal(options)
  );

export const createMarketPurchase = (
  payload: MarketPurchasePayload,
  options?: ApiOptions
) => fetch("/api/badges/market/purchase", withJsonBody(payload, options));

export const createBadge = (payload: BadgeApiPayload, options?: ApiOptions) =>
  fetch("/api/badges", withJsonBody(payload, options));

export const fetchExploreBadges = (
  params: URLSearchParams,
  chainId: number,
  options?: ApiOptions
) =>
  fetch(
    `/api/badges/explore?${withChainId(params, chainId).toString()}`,
    withSignal(options)
  );

export const fetchBadgesByUser = (
  userId: string,
  chainId: number,
  options?: ApiOptions
) => {
  const params = new URLSearchParams({
    userId,
    chainId: String(chainId),
  });
  return fetch(`/api/badges?${params.toString()}`, withSignal(options));
};

export const updateBadge = (
  badgeId: string,
  payload: BadgePatchPayload,
  options?: ApiOptions
) => fetch(`/api/badges/${badgeId}`, withJsonPatch(payload, options));

export const updateBadgeByTokenUri = (
  payload: BadgeTokenUriPatchPayload,
  options?: ApiOptions
) => fetch("/api/badges/by-token-uri", withJsonPatch(payload, options));

export const requestMintSignature = (
  payload: MintSignaturePayload,
  options?: ApiOptions
) => fetch("/api/mint-signature", withJsonBody(payload, options));

export const deleteBadge = (
  badgeId: string,
  payload: { userId: string; chainId: number },
  options?: ApiOptions
) => fetch(`/api/badges/${badgeId}`, withJsonDelete(payload, options));
