import { NextResponse } from "next/server";
import { getExploreBadgeByTokenId } from "@src/server/badges";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId")?.trim();

    if (!tokenId) {
      return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
    }

    const badge = await getExploreBadgeByTokenId(tokenId);
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
