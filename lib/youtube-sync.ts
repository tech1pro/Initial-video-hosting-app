import type { SyncedVideoPayload, Video } from "./types";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function formatIsoDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "0:00";
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  if (h > 0) {
    return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${min}:${String(s).padStart(2, "0")}`;
}

function formatViews(n: string | undefined): string {
  if (!n) return "—";
  const num = parseInt(n, 10);
  if (Number.isNaN(num)) return n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

async function yt(
  endpoint: string,
  apiKey: string,
  params: Record<string, string>
): Promise<unknown> {
  const u = new URL(`${API_BASE}/${endpoint}`);
  u.searchParams.set("key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    u.searchParams.set(k, v);
  }
  const res = await fetch(u.toString());
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`YouTube API ${endpoint}: ${res.status} ${text.slice(0, 500)}`);
  }
  return JSON.parse(text) as Record<string, unknown>;
}

/**
 * Fetches latest uploads from each channel ID (UC...) and returns payload for storage.
 */
export async function syncYouTubeChannels(
  apiKey: string,
  channelIds: string[],
  maxPerChannel = 50
): Promise<SyncedVideoPayload> {
  const channelsMeta: { id: string; title: string }[] = [];
  const allItems: { videoId: string; channelTitle: string }[] = [];

  for (const channelId of channelIds) {
    const chJson = (await yt("channels", apiKey, {
      part: "contentDetails,snippet",
      id: channelId.trim(),
    })) as {
      items?: Array<{
        snippet?: { title?: string };
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }>;
    };

    const item = chJson.items?.[0];
    if (!item) continue;

    const title = item.snippet?.title || channelId;
    const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) continue;

    channelsMeta.push({ id: channelId.trim(), title });

    let pageToken: string | undefined;
    let count = 0;

    do {
      const params: Record<string, string> = {
        part: "snippet,contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: String(Math.min(50, maxPerChannel - count)),
      };
      if (pageToken) params.pageToken = pageToken;

      const plJson = (await yt("playlistItems", apiKey, params)) as {
        items?: Array<{
          snippet?: { channelTitle?: string };
          contentDetails?: { videoId?: string };
        }>;
        nextPageToken?: string;
      };

      for (const pl of plJson.items || []) {
        const vid = pl.contentDetails?.videoId;
        if (!vid) continue;
        allItems.push({
          videoId: vid,
          channelTitle: pl.snippet?.channelTitle || title,
        });
        count++;
        if (count >= maxPerChannel) break;
      }

      pageToken = plJson.nextPageToken;
      if (count >= maxPerChannel) break;
    } while (pageToken);
  }

  const uniqueIds = [...new Set(allItems.map((x) => x.videoId))];
  const videoMap = new Map<string, Video>();

  for (let i = 0; i < uniqueIds.length; i += 50) {
    const batch = uniqueIds.slice(i, i + 50);
    const vJson = (await yt("videos", apiKey, {
      part: "snippet,contentDetails,statistics",
      id: batch.join(","),
    })) as {
      items?: Array<{
        id?: string;
        snippet?: {
          title?: string;
          description?: string;
          channelTitle?: string;
          publishedAt?: string;
          thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
        };
        contentDetails?: { duration?: string };
        statistics?: { viewCount?: string };
      }>;
    };

    for (const v of vJson.items || []) {
      const id = v.id;
      if (!id) continue;
      const sn = v.snippet;
      const thumb =
        sn?.thumbnails?.high?.url || sn?.thumbnails?.medium?.url || "";
      const channelTitle =
        sn?.channelTitle ||
        allItems.find((x) => x.videoId === id)?.channelTitle ||
        "";

      videoMap.set(id, {
        id,
        title: sn?.title || id,
        description: sn?.description?.slice(0, 500),
        thumbnail: thumb,
        duration: formatIsoDuration(v.contentDetails?.duration || "PT0S"),
        channel: channelTitle,
        views: formatViews(v.statistics?.viewCount),
        url: `https://www.youtube.com/watch?v=${id}`,
        provider: "youtube",
        publishedAt: sn?.publishedAt,
      });
    }
  }

  const videos = uniqueIds
    .map((id) => videoMap.get(id))
    .filter((v): v is Video => Boolean(v));

  videos.sort((a, b) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || "")
  );

  return {
    syncedAt: new Date().toISOString(),
    videos,
    channels: channelsMeta,
  };
}
