/**
 * Fetches latest videos from a channel's public RSS (no API key).
 * Writes data/channel-default.json for local preview / default catalog.
 *
 * Usage: node scripts/fetch-channel-rss.mjs
 */
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data", "channel-default.json");

const CHANNEL_ID = "UCQVTsbmhSKH_wkA_dsgH-QQ";
const CHANNEL_TITLE = "Hip Hop Imagination";

function formatViews(n) {
  const num = parseInt(String(n), 10);
  if (Number.isNaN(num)) return "—";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

function decodeXml(s) {
  if (!s) return "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const res = await fetch(url);
if (!res.ok) {
  console.error("RSS fetch failed:", res.status);
  process.exit(1);
}
const xml = await res.text();

const videos = [];
const entryBlocks = xml.split("<entry>").slice(1);

for (const block of entryBlocks) {
  const id = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
  if (!id) continue;

  const titleMatch = block.match(/<title>([^<]*)<\/title>/);
  const title = decodeXml(titleMatch?.[1]?.trim() || id);

  const published = block.match(/<published>([^<]+)<\/published>/)?.[1];
  const thumb =
    block.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] || "";
  const viewsRaw = block.match(/<media:statistics[^>]*views="(\d+)"/)?.[1];

  let description = "";
  const descMatch = block.match(
    /<media:description>([\s\S]*?)<\/media:description>/
  );
  if (descMatch) {
    description = decodeXml(descMatch[1].trim().slice(0, 500));
  }

  videos.push({
    id,
    title,
    description: description || undefined,
    thumbnail: thumb,
    duration: "—",
    channel: CHANNEL_TITLE,
    views: formatViews(viewsRaw),
    url: `https://www.youtube.com/watch?v=${id}`,
    provider: "youtube",
    publishedAt: published,
  });
}

videos.sort((a, b) =>
  (b.publishedAt || "").localeCompare(a.publishedAt || "")
);

const payload = {
  syncedAt: new Date().toISOString(),
  source: "youtube-rss-feed",
  videos,
  channels: [{ id: CHANNEL_ID, title: CHANNEL_TITLE }],
};

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(payload, null, 2), "utf8");
console.log("Wrote", OUT, `(${videos.length} videos)`);
