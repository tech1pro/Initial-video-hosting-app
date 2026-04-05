import { NextResponse } from "next/server";
import { syncYouTubeChannels } from "@/lib/youtube-sync";
import { writeSyncedPayload } from "@/lib/video-store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function parseChannelIds(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function authorize(req: Request): boolean {
  const secret = process.env.CRON_SECRET || process.env.SYNC_SECRET;
  if (!secret) return false;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const header = req.headers.get("x-cron-secret");
  if (header === secret) return true;

  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;

  return false;
}

export async function POST(req: Request) {
  return handleSync(req);
}

export async function GET(req: Request) {
  return handleSync(req);
}

async function handleSync(req: Request) {
  const secret = process.env.CRON_SECRET || process.env.SYNC_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Set CRON_SECRET (or SYNC_SECRET) in environment" },
      { status: 503 }
    );
  }
  if (!authorize(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelIds = parseChannelIds(process.env.YOUTUBE_CHANNEL_IDS);

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "YOUTUBE_API_KEY is not set" },
      { status: 500 }
    );
  }
  if (channelIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "YOUTUBE_CHANNEL_IDS is empty" },
      { status: 500 }
    );
  }

  try {
    const payload = await syncYouTubeChannels(apiKey, channelIds, 50);
    await writeSyncedPayload(payload);
    return NextResponse.json({
      ok: true,
      syncedAt: payload.syncedAt,
      videoCount: payload.videos.length,
      channels: payload.channels,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    console.error("YouTube sync error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
