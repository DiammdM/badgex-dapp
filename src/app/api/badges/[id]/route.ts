import { NextResponse } from "next/server";
import { updateBadgeStatusForUser } from "@src/server/badges";
import { BadgeRecordStatus } from "@src/types/badge";
import { parseJson } from "@src/utils/request";

export const runtime = "nodejs";

type UpdateBadgePayload = {
  status?: BadgeRecordStatus;
  tokenId?: string;
  userId?: `0x${string}`;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await parseJson<UpdateBadgePayload>(request);
    const status = body.status;
    const userId = body.userId;
    const tokenId =
      typeof body.tokenId === "string" ? body.tokenId.trim() : undefined;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!status || status !== BadgeRecordStatus.Minted) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (body.tokenId && !tokenId) {
      return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
    }

    const result = await updateBadgeStatusForUser({
      userId,
      badgeId: id,
      status,
      tokenId,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update badge status", error);
    return NextResponse.json(
      { error: "Failed to update badge status" },
      { status: 500 }
    );
  }
}
