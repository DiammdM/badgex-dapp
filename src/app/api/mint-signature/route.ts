import { NextResponse } from "next/server";
import { getAddress } from "ethers";
import { buildFingerprint, buildSignature } from "@src/utils/signature";
import { getIpfsFilesByCid } from "@src/server/ipfs";

const BADGE_NFT_ADDRESS = process.env.BADGE_NFT_ADDRESS ?? "";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = typeof body?.to === "string" ? body.to : "";
    const tokenURI = body?.tokenURI;
    const cid = body?.cid;
    const chainId = BigInt(body?.chainId);

    if (!to || !tokenURI || !cid || !chainId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // get attributes from ipfs
    const metadata = await getIpfsFilesByCid(cid);
    if (metadata === null) {
      return NextResponse.json(
        { error: "Failed to fetch metadata from IPFS" },
        { status: 400 }
      );
    }
    const { attributes } = metadata;

    if (attributes.length === 0) {
      return NextResponse.json(
        { error: "Invalid attributes" },
        { status: 400 }
      );
    }

    if (!BADGE_NFT_ADDRESS) {
      return NextResponse.json(
        { error: "Signature configuration missing" },
        { status: 500 }
      );
    }

    let normalizedContractAddr: string;
    try {
      normalizedContractAddr = getAddress(BADGE_NFT_ADDRESS);
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
      contractAddr: normalizedContractAddr,
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
