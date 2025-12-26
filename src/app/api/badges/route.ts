import { NextResponse } from "next/server";
import { Resvg } from "@resvg/resvg-js";
import { prisma } from "@/lib/prisma";
import { buildBadgeSvg } from "@/utils/badgeSvg";
import { pinata } from "@/utils/pinata";

const FIXED_USER_ID = "user_demo_001";
const PNG_SIZE = 512;
const GROUP_ID = process.env.GROUP_ID;
const IPFS_PIC_PREFIX = process.env.IPFS_PIC_PREFIX ?? "";

const normalizeIpfsPrefix = (value: string) => {
  if (!value) return "";
  return value.endsWith("/") ? value : `${value}/`;
};

const getCidFromIpfsUrl = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("ipfs://")) {
    return trimmed.slice("ipfs://".length);
  }
  const parts = trimmed.split("/ipfs/");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return undefined;
};

export const runtime = "nodejs";

export async function GET() {
  try {
    const records = await prisma.badgeRecord.findMany({
      where: {
        userId: FIXED_USER_ID,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        status: true,
        config: true,
        imageCid: true,
        metadataCid: true,
        tokenUri: true,
        ipfsUrl: true,
        updatedAt: true,
      },
    });

    const prefix = normalizeIpfsPrefix(IPFS_PIC_PREFIX);

    return NextResponse.json({
      badges: records.map((record) => {
        const imageCid = record.imageCid ?? getCidFromIpfsUrl(record.ipfsUrl);
        const imageUrl = imageCid && prefix ? `${prefix}${imageCid}` : null;
        return {
          ...record,
          updatedAt: record.updatedAt.toISOString(),
          imageUrl,
        };
      }),
    });
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

    // generate badge picture
    const svg = buildBadgeSvg({
      themeId: safeConfig.themeId,
      shapeId: safeConfig.shapeId,
      borderId: safeConfig.borderId,
      iconId: safeConfig.iconId,
      text: safeConfig.text,
    });
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: PNG_SIZE,
      },
    });
    const pngBase64 = resvg.render().asPng().toString("base64");

    // upload badge to ipfs
    const uploadResponse = await pinata.upload.public.base64(pngBase64, {
      metadata: {
        name: `${name}.png`,
      },
      groupId: GROUP_ID,
    });
    const imageCid = uploadResponse.cid;
    const ipfsUrl = `ipfs://${imageCid}`;

    // generate metadata
    const attributes: { trait_type: string; value: string | number }[] = [
      { trait_type: "Level", value: safeConfig.level },
    ];
    if (safeConfig.category) {
      attributes.push({ trait_type: "Category", value: safeConfig.category });
    }
    const themeValue = safeConfig.themeLabel || safeConfig.themeId;
    if (themeValue) {
      attributes.push({ trait_type: "Theme", value: themeValue });
    }
    const shapeValue = safeConfig.shapeLabel || safeConfig.shapeId;
    if (shapeValue) {
      attributes.push({ trait_type: "Shape", value: shapeValue });
    }
    const borderValue = safeConfig.borderLabel || safeConfig.borderId;
    if (borderValue) {
      attributes.push({ trait_type: "Border", value: borderValue });
    }
    const iconValue = safeConfig.iconLabel || safeConfig.iconId;
    if (iconValue) {
      attributes.push({ trait_type: "Icon", value: iconValue });
    }
    if (safeConfig.text) {
      attributes.push({ trait_type: "Text", value: safeConfig.text });
    }

    const metadata: {
      name: string;
      description?: string;
      image: string;
      attributes: { trait_type: string; value: string | number }[];
    } = {
      name,
      image: ipfsUrl,
      attributes,
    };
    if (description) {
      metadata.description = description;
    }

    const metadataUploadResponse = await pinata.upload.public.json(metadata, {
      metadata: {
        name: `${name}.json`,
      },
      groupId: GROUP_ID,
    });
    const metadataCid = metadataUploadResponse.cid;
    const tokenUri = `ipfs://${metadataCid}`;

    const record = await prisma.badgeRecord.create({
      data: {
        userId: FIXED_USER_ID,
        name,
        description: description || null,
        config: {
          themeId: safeConfig.themeId,
          shapeId: safeConfig.shapeId,
          borderId: safeConfig.borderId,
          iconId: safeConfig.iconId,
          text: safeConfig.text,
          level: safeConfig.level,
        },
        status: "SAVED",
        imageCid,
        metadataCid,
        tokenUri,
        ipfsUrl,
      },
      select: { id: true },
    });

    return NextResponse.json({
      id: record.id,
      imageCid,
      metadataCid,
      tokenUri,
      ipfsUrl,
    });
  } catch (error) {
    console.error("Failed to save badge", error);
    return NextResponse.json(
      { error: "Failed to save badge" },
      { status: 500 }
    );
  }
}
