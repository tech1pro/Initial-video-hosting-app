import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VideoCard from "@/components/video/VideoCard";
import VideoPlayer from "@/components/video/VideoPlayer";
import { getDisplayVideos, getVideoById } from "@/lib/video-store";
import { isYouTubeVideo } from "@/lib/video-utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(decodeURIComponent(id));
  if (!video) return { title: "Not found" };
  return {
    title: video.title,
    description: video.description?.slice(0, 160),
    openGraph: video.thumbnail ? { images: [video.thumbnail] } : undefined,
  };
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const video = await getVideoById(decodedId);
  if (!video) notFound();

  const all = await getDisplayVideos();
  const others = all.filter((v) => v.id !== video.id).slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-surface-400 transition hover:text-white"
      >
        <span aria-hidden>←</span> Back to library
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
        <div>
          <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/[0.08]">
            <div className="relative aspect-video w-full">
              <VideoPlayer video={video} />
            </div>
          </div>
          <div className="mt-6">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {video.title}
            </h1>
            <p className="mt-2 text-sm text-surface-400">
              {video.channel}
              {video.views ? ` · ${video.views} views` : ""}
              {video.publishedAt
                ? ` · ${new Date(video.publishedAt).toLocaleDateString()}`
                : ""}
            </p>
            {video.description && (
              <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-surface-300">
                {video.description}
              </p>
            )}
            {video.url && isYouTubeVideo(video) && (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600/90 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Open on YouTube
              </a>
            )}
          </div>
        </div>

        <aside className="lg:pt-0">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-surface-500">
            More videos
          </h2>
          {others.length === 0 ? (
            <p className="text-sm text-surface-500">No other videos yet.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {others.map((v) => (
                <li key={v.id}>
                  <VideoCard video={v} />
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}
