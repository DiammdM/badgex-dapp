import { NextResponse } from "next/server";
import { createBadgeForUser, listBadgesForUser } from "@src/server/badges";
import { BadgeApiPayload } from "@src/types/badge";
import { parseJson } from "@src/utils/request";

const FIXED_USER_ID = "user_demo_001";

export const runtime = "nodejs";

export async function GET() {
  try {
    const badges = await listBadgesForUser(FIXED_USER_ID);
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

    if (!name || !config || typeof config !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await createBadgeForUser({
      userId: FIXED_USER_ID,
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
