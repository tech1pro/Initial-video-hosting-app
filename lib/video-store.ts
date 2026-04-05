import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SyncedVideoPayload, Video } from "./types";
import { sampleVideos } from "./sample-videos";

const DATA_DIR = path.join(process.cwd(), "data");
const SYNCED_FILE = path.join(DATA_DIR, "synced-videos.json");

export async function getDisplayVideos(): Promise<Video[]> {
  try {
    const raw = await readFile(SYNCED_FILE, "utf8");
    const parsed = JSON.parse(raw) as SyncedVideoPayload;
    if (Array.isArray(parsed.videos) && parsed.videos.length > 0) {
      return parsed.videos;
    }
  } catch {
    // missing or invalid file
  }
  return sampleVideos;
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
