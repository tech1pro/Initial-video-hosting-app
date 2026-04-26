import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SyncedVideoPayload, Video } from "./types";
import { sampleVideos } from "./sample-videos";

const DATA_DIR = path.join(process.cwd(), "data");
const SYNCED_FILE = path.join(DATA_DIR, "synced-videos.json");
/** Committed snapshot from public RSS — used when no API sync file yet */
const CHANNEL_DEFAULT_FILE = path.join(DATA_DIR, "channel-default.json");

function videosFromPayload(parsed: unknown): Video[] | null {
  if (!parsed || typeof parsed !== "object") return null;
  const v = (parsed as SyncedVideoPayload).videos;
  if (Array.isArray(v) && v.length > 0) return v;
  return null;
}

export async function getDisplayVideos(): Promise<Video[]> {
  for (const file of [SYNCED_FILE, CHANNEL_DEFAULT_FILE]) {
    try {
      const raw = await readFile(file, "utf8");
      const parsed = JSON.parse(raw) as SyncedVideoPayload;
      const list = videosFromPayload(parsed);
      if (list) return list;
    } catch {
      // missing or invalid
    }
  }
  return sampleVideos;
}

export async function getVideoById(id: string): Promise<Video | null> {
  const videos = await getDisplayVideos();
  return videos.find((v) => v.id === id) ?? null;
}

export async function readSyncedPayload(): Promise<SyncedVideoPayload | null> {
  try {
    const raw = await readFile(SYNCED_FILE, "utf8");
    return JSON.parse(raw) as SyncedVideoPayload;
  } catch {
    return null;
  }
}

export async function writeSyncedPayload(payload: SyncedVideoPayload): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SYNCED_FILE, JSON.stringify(payload, null, 2), "utf8");
}
