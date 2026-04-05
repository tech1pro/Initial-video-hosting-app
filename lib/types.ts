export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  channel?: string;
  views?: string;
  url?: string;
  /** YouTube embed vs direct file URL */
  provider?: "youtube" | "file";
  /** ISO date from YouTube (for ordering; optional on samples) */
  publishedAt?: string;
}

export interface SyncedVideoPayload {
  syncedAt: string;
  videos: Video[];
  channels: { id: string; title: string }[];
}
