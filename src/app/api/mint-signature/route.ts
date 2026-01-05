import { NextResponse } from "next/server";
import { getAddress } from "ethers";
import { buildFingerprint, buildSignature } from "@/utils/signature";
import { MetaAttribute } from "@/types/badge";

const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY ?? "";
const BADGE_NFT_ADDRESS = process.env.BADGE_NFT_ADDRESS ?? "";
const BADGE_CHAIN_ID = process.env.BADGE_CHAIN_ID ?? process.env.CHAIN_ID ?? "";

export const runtime = "nodejs";

const normalizePrivateKey = (value: string) => {
  if (!value) return "";
  return value.startsWith("0x") ? value : `0x${value}`;
};

// Request body:
// {
//   to: string; // user wallet address, "0x..." format
//   attributes: Array<{
//     trait_type: string; // badge trait name
//     value: string | number | boolean;
//   }>;
// }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = typeof body?.to === "string" ? body.to : "";
    const rawAttributes = body?.attributes;

    if (!to || !rawAttributes) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const attributes: MetaAttribute[] = Array.isArray(rawAttributes)
      ? rawAttributes
          .filter((item) => item && typeof item === "object")
          .map((item) => {
            const attr = item as { trait_type?: unknown; value?: unknown };
            if (
              typeof attr.trait_type !== "string" ||
              (typeof attr.value !== "string" &&
                typeof attr.value !== "number" &&
                typeof attr.value !== "boolean")
            ) {
              return null;
            }
            return { trait_type: attr.trait_type, value: attr.value };
          })
          .filter((item): item is MetaAttribute => item !== null)
      : [];

    if (attributes.length === 0) {
      return NextResponse.json(
        { error: "Invalid attributes" },
        { status: 400 }
      );
    }

    if (!ISSUER_PRIVATE_KEY || !BADGE_NFT_ADDRESS || !BADGE_CHAIN_ID) {
      return NextResponse.json(
        { error: "Signature configuration missing" },
        { status: 500 }
      );
    }

    let chainId: bigint;
    try {
      chainId = BigInt(BADGE_CHAIN_ID);
    } catch {
      return NextResponse.json({ error: "Invalid chain id" }, { status: 500 });
    }

    let verifyingContract: string;
    try {
      verifyingContract = getAddress(BADGE_NFT_ADDRESS);
    } catch {
      return NextResponse.json(
        { error: "Invalid badge contract address" },
        { status: 500 }
      );
    }

    let normalizedTo: string;
    try {
      normalizedTo = getAddress(to);
    } catch {
      return NextResponse.json(
        { error: "Invalid target address" },
        { status: 400 }
      );
    }

    const fingerprint = buildFingerprint(attributes);
    const signature = buildSignature({
      to: normalizedTo,
      fingerprint,
      chainId,
      verifyingContract,
      issuerPrivateKey: normalizePrivateKey(ISSUER_PRIVATE_KEY),
    });

    return NextResponse.json({ signature, fingerprint });
  } catch (error) {
    console.error("Failed to sign mint payload", error);
    return NextResponse.json(
      { error: "Failed to sign mint payload" },
      { status: 500 }
    );
  }
}
