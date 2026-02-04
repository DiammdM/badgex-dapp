import { NextResponse } from "next/server";
import { getExploreBadgeByTokenId } from "@src/server/badges";
import { parseChainId } from "@src/utils/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId")?.trim();
    const chainId = parseChainId(searchParams.get("chainId"));

    if (!tokenId || !chainId) {
      return NextResponse.json(
        { error: "Missing tokenId or chainId" },
        { status: 400 }
      );
    }

    const badge = await getExploreBadgeByTokenId(tokenId, chainId);
    if (!badge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    return NextResponse.json({ badge });
  } catch (error) {
    console.error("Failed to load badge detail", error);
    return NextResponse.json(
      { error: "Failed to load badge detail" },
      { status: 500 }
    );
  }
}
