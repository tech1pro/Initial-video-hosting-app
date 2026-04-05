"use client";

import { useState } from "react";
import Image from "next/image";
import type { Video } from "@/lib/types";

function isYouTube(v: Video): boolean {
  return v.provider === "youtube" || Boolean(v.url?.includes("youtube.com"));
}

export default function VideoHomeClient({ videos }: { videos: Video[] }) {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);

  if (videos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        No videos yet. Run a YouTube sync or check your environment variables.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 md:px-6 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight">Video Hosting</h1>
        <nav className="flex items-center gap-4 text-sm text-slate-400">
          <span className="text-slate-500">YouTube channels</span>
        </nav>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        <section className="mb-8">
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-slate-900 ring-1 ring-slate-800">
            {isYouTube(selectedVideo) ? (
              <iframe
                key={selectedVideo.id}
                title={selectedVideo.title}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={selectedVideo.id}
                className="w-full h-full object-contain"
                src={selectedVideo.url}
                controls
                autoPlay
                poster={selectedVideo.thumbnail}
              />
            )}
          </div>
          <div className="mt-3 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white">{selectedVideo.title}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {selectedVideo.channel}
              {selectedVideo.views ? ` · ${selectedVideo.views} views` : ""}
            </p>
            {selectedVideo.description && (
              <p className="text-slate-400 mt-2 text-sm line-clamp-4">
                {selectedVideo.description}
              </p>
            )}
            {selectedVideo.url && (
              <a
                href={selectedVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-sky-400 hover:underline"
              >
                Open on YouTube →
              </a>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-slate-300 mb-4">Videos</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="w-full text-left rounded-lg overflow-hidden bg-slate-900/80 ring-1 ring-slate-800 hover:ring-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all group"
                >
                  <div className="relative aspect-video bg-slate-800">
                    <Image
                      src={video.thumbnail}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized={video.thumbnail.includes("ytimg.com")}
                    />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs font-medium bg-black/80 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-slate-200 line-clamp-2 group-hover:text-white">
                      {video.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {video.channel}
                      {video.views ? ` · ${video.views}` : ""}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
