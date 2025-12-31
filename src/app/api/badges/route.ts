import { NextResponse } from "next/server";
import { createBadgeForUser, listBadgesForUser } from "@/server/badges";

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
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : undefined;
    const config = body?.config;

    if (!name || !config || typeof config !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const safeConfig = {
      themeId: typeof config.themeId === "string" ? config.themeId : "",
      themeLabel:
        typeof config.themeLabel === "string" ? config.themeLabel : "",
      shapeId: typeof config.shapeId === "string" ? config.shapeId : "",
      shapeLabel:
        typeof config.shapeLabel === "string" ? config.shapeLabel : "",
      borderId: typeof config.borderId === "string" ? config.borderId : "",
      borderLabel:
        typeof config.borderLabel === "string" ? config.borderLabel : "",
      iconId: typeof config.iconId === "string" ? config.iconId : "",
      iconLabel: typeof config.iconLabel === "string" ? config.iconLabel : "",
      text: typeof config.text === "string" ? config.text : "",
      level: typeof config.level === "number" ? config.level : 0,
      category: typeof config.category === "string" ? config.category : "",
    };

    if (!safeConfig.themeId || !safeConfig.shapeId || !safeConfig.borderId) {
      return NextResponse.json(
        { error: "Missing config fields" },
        { status: 400 }
      );
    }

    const result = await createBadgeForUser({
      userId: FIXED_USER_ID,
      name,
      description,
      config: safeConfig,
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
