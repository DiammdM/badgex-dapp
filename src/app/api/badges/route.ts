import { NextResponse } from "next/server";
import { createBadgeForUser, listBadgesForUser } from "@src/server/badges";
import { BadgeApiPayload } from "@src/types/badge";
import { parseChainId, parseJson } from "@src/utils/request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const chainId = parseChainId(searchParams.get("chainId"));

    if (!userId || !chainId) {
      return NextResponse.json(
        { error: "Missing userId or chainId" },
        { status: 400 }
      );
    }

    const badges = await listBadgesForUser(userId, chainId);
    return NextResponse.json({ badges });
  } catch (error) {
    console.error("Failed to load badges", error);
    return NextResponse.json(
      { error: "Failed to load badges" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<BadgeApiPayload>(request);
    const name = body.name.trim();
    const description = body.description.trim();
    const config = body.config;
    const userId = body.userId;
    const chainId = parseChainId(body.chainId);

    if (!name || !config || typeof config !== "object" || !chainId) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const result = await createBadgeForUser({
      userId,
      chainId,
      name,
      description,
      config: config,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to save badge", error);
    return NextResponse.json(
      { error: "Failed to save badge" },
      { status: 500 }
    );
  }
}
