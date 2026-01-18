import { NextResponse } from "next/server";
import { updateBadgeStatusForUser } from "@src/server/badges";
import { BadgeRecordStatus } from "@src/types/badge";
import { parseJson } from "@src/utils/request";

export const runtime = "nodejs";

type UpdateBadgePayload = {
  status?: BadgeRecordStatus;
  tokenId?: string;
  userId?: `0x${string}`;
  price?: string | null;
  listingId?: string | null;
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
    const price =
      typeof body.price === "string"
        ? body.price.trim()
        : body.price === null
        ? null
        : undefined;
    const listingId =
      typeof body.listingId === "string"
        ? body.listingId.trim()
        : body.listingId === null
        ? null
        : undefined;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (
      !status ||
      ![BadgeRecordStatus.Minted, BadgeRecordStatus.Listed].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (body.tokenId && !tokenId) {
      return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
    }

    if (status === BadgeRecordStatus.Listed) {
      if (!price) {
        return NextResponse.json({ error: "Missing price" }, { status: 400 });
      }
      if (!listingId) {
        return NextResponse.json(
          { error: "Missing listingId" },
          { status: 400 }
        );
      }
    }

    const result = await updateBadgeStatusForUser({
      userId,
      badgeId: id,
      status,
      tokenId,
      price,
      listingId,
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
