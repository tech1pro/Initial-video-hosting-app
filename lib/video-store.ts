import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SyncedVideoPayload, Video } from "./types";
import { sampleVideos } from "./sample-videos";
import { getMongoDb, hasMongoUri } from "./mongodb";

const DATA_DIR = path.join(process.cwd(), "data");
const SYNCED_FILE = path.join(DATA_DIR, "synced-videos.json");
/** Committed snapshot from public RSS — used when no API sync file yet */
const CHANNEL_DEFAULT_FILE = path.join(DATA_DIR, "channel-default.json");
const SYNC_COLLECTION = "videoSync";
const LATEST_SYNC_ID = "latest";

type MongoSyncedVideoPayload = SyncedVideoPayload & {
  _id: string;
  updatedAt?: Date;
};

function videosFromPayload(parsed: unknown): Video[] | null {
  if (!parsed || typeof parsed !== "object") return null;
  const v = (parsed as SyncedVideoPayload).videos;
  if (Array.isArray(v) && v.length > 0) return v;
  return null;
}

async function readMongoPayload(): Promise<SyncedVideoPayload | null> {
  if (!hasMongoUri()) return null;

  try {
    const db = await getMongoDb();
    const doc = await db
      ?.collection<MongoSyncedVideoPayload>(SYNC_COLLECTION)
      .findOne({ _id: LATEST_SYNC_ID });

    if (!doc || !videosFromPayload(doc)) return null;

    return {
      syncedAt: doc.syncedAt,
      videos: doc.videos,
      channels: doc.channels || [],
    };
  } catch (error) {
    console.error(
      "Mongo video payload read failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

async function writeMongoPayload(payload: SyncedVideoPayload): Promise<boolean> {
  if (!hasMongoUri()) return false;

  try {
    const db = await getMongoDb();
    await db?.collection<MongoSyncedVideoPayload>(SYNC_COLLECTION).updateOne(
      { _id: LATEST_SYNC_ID },
      {
        $set: {
          ...payload,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error(
      "Mongo video payload write failed:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

export async function getDisplayVideos(): Promise<Video[]> {
  const mongoPayload = await readMongoPayload();
  const mongoVideos = videosFromPayload(mongoPayload);
  if (mongoVideos) return mongoVideos;

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
  const mongoPayload = await readMongoPayload();
  if (mongoPayload) return mongoPayload;

  try {
    const raw = await readFile(SYNCED_FILE, "utf8");
    return JSON.parse(raw) as SyncedVideoPayload;
  } catch {
    return null;
  }
}

export async function writeSyncedPayload(payload: SyncedVideoPayload): Promise<void> {
  await writeMongoPayload(payload);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SYNCED_FILE, JSON.stringify(payload, null, 2), "utf8");
}
