import { BadgeApiPayload, BadgeRecordStatus } from "@src/types/badge";

type ApiOptions = {
  signal?: AbortSignal;
};

type MarketPurchasePayload = {
  badgeId: string;
  buyer: string;
};

type BadgePatchPayload = {
  status?: BadgeRecordStatus;
  userId?: string;
  listingId?: string | null;
  price?: string | null;
};

type BadgeTokenUriPatchPayload = {
  status: BadgeRecordStatus;
  tokenId: string;
  tokenUri: string;
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

export const fetchBadgeByTokenId = (tokenId: string, options?: ApiOptions) =>
  fetch(
    `/api/badges/by-token-id?tokenId=${encodeURIComponent(tokenId)}`,
    withSignal(options)
  );

export const fetchMarketListings = (
  params: URLSearchParams,
  options?: ApiOptions
) =>
  fetch(`/api/badges/market?${params.toString()}`, withSignal(options));

export const fetchMarketActivity = (
  params: URLSearchParams,
  options?: ApiOptions
) =>
  fetch(`/api/badges/market/activity?${params.toString()}`, withSignal(options));

export const createMarketPurchase = (
  payload: MarketPurchasePayload,
  options?: ApiOptions
) => fetch("/api/badges/market/purchase", withJsonBody(payload, options));

export const createBadge = (payload: BadgeApiPayload, options?: ApiOptions) =>
  fetch("/api/badges", withJsonBody(payload, options));

export const fetchExploreBadges = (
  params: URLSearchParams,
  options?: ApiOptions
) =>
  fetch(`/api/badges/explore?${params.toString()}`, withSignal(options));

export const fetchBadgesByUser = (userId: string, options?: ApiOptions) =>
  fetch(
    `/api/badges?userId=${encodeURIComponent(userId)}`,
    withSignal(options)
  );

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
  payload: { userId: string },
  options?: ApiOptions
) => fetch(`/api/badges/${badgeId}`, withJsonDelete(payload, options));
