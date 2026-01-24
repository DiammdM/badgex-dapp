import { NextResponse } from "next/server";
import { finalizeMarketPurchase } from "@src/server/badges";
import { parseJson } from "@src/utils/request";

export const runtime = "nodejs";

type MarketPurchasePayload = {
  badgeId?: string;
  buyer?: `0x${string}`;
};

export async function POST(request: Request) {
  try {
    const body = await parseJson<MarketPurchasePayload>(request);
    const badgeId =
      typeof body.badgeId === "string" ? body.badgeId.trim() : "";
    const buyer = typeof body.buyer === "string" ? body.buyer.trim() : "";

    if (!badgeId || !buyer) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await finalizeMarketPurchase({ badgeId, buyer });

    if (result.count === 0) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to finalize market purchase", error);
    return NextResponse.json(
      { error: "Failed to finalize market purchase" },
      { status: 500 }
    );
  }
}
