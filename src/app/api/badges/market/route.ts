import { NextResponse } from "next/server";
import { listMarketBadges } from "@src/server/badges";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 30;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const offsetParam = Number.parseInt(searchParams.get("offset") ?? "", 10);
    const search = searchParams.get("search")?.trim();
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;
    const offset =
      Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

    const result = await listMarketBadges({
      limit,
      offset,
      search: search || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to load market badges", error);
    return NextResponse.json(
      { error: "Failed to load market badges" },
      { status: 500 }
    );
  }
}
