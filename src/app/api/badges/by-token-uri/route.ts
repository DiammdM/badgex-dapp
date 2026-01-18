import { NextResponse } from "next/server";
import { updateBadgeStatusByTokenUri } from "@src/server/badges";
import { BadgeRecordStatus } from "@src/types/badge";
import { parseJson } from "@src/utils/request";

export const runtime = "nodejs";

type UpdateByTokenUriPayload = {
  status?: BadgeRecordStatus;
  tokenId?: string;
  userId?: `0x${string}`;
  tokenUri?: string;
};

export async function PATCH(request: Request) {
  try {
    const body = await parseJson<UpdateByTokenUriPayload>(request);
    const status = body.status;
    const tokenUri =
      typeof body.tokenUri === "string" ? body.tokenUri.trim() : undefined;
    const tokenId =
      typeof body.tokenId === "string" ? body.tokenId.trim() : undefined;

    if (!tokenUri) {
      return NextResponse.json({ error: "Missing tokenUri" }, { status: 400 });
    }

    if (!status || status !== BadgeRecordStatus.Minted) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (body.tokenId && !tokenId) {
      return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
    }

    const result = await updateBadgeStatusByTokenUri({
      tokenUri,
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
