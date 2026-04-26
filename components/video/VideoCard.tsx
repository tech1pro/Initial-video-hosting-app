import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/types";
import { isYouTubeVideo } from "@/lib/video-utils";

export default function VideoCard({ video }: { video: Video }) {
  const unoptimized =
    video.thumbnail.includes("ytimg.com") || video.thumbnail.includes("unsplash.com");

  return (
    <Link
      href={`/watch/${encodeURIComponent(video.id)}`}
      className="group block overflow-hidden rounded-xl bg-surface-800/60 ring-1 ring-white/[0.06] transition hover:ring-accent/40 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-video bg-surface-900">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          unoptimized={unoptimized}
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white/95 tabular-nums">
          {video.duration}
        </span>
        {isYouTubeVideo(video) && (
          <span className="absolute left-2 top-2 rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            YouTube
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="line-clamp-2 font-medium leading-snug text-surface-100 group-hover:text-white">
          {video.title}
        </p>
        <p className="mt-1.5 text-xs text-surface-500">
          {video.channel}
          {video.views ? ` · ${video.views} views` : ""}
        </p>
      </div>
    </Link>
  );
}
