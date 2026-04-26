import type { Video } from "./types";

export function isYouTubeVideo(v: Video): boolean {
  return v.provider === "youtube" || Boolean(v.url?.includes("youtube.com"));
}
