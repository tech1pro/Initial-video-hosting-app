import ChannelIntro from "@/components/channel/ChannelIntro";
import VideoCard from "@/components/video/VideoCard";
import { getDisplayVideos } from "@/lib/video-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const videos = await getDisplayVideos();

  if (videos.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <ChannelIntro />
        <div className="mx-auto max-w-xl rounded-2xl border border-white/[0.08] bg-surface-900/40 px-8 py-12 text-center">
          <h2 className="font-display text-xl font-semibold text-white">
            No videos to show yet
          </h2>
          <p className="mt-3 text-surface-400">
            Add data or run a YouTube sync on your host. See{" "}
            <code className="rounded bg-surface-800 px-1.5 py-0.5 font-mono text-xs text-accent">
              .env.example
            </code>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <ChannelIntro />

      <section className="mb-10 sm:mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Videos
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Latest uploads
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-surface-400">
          Click any title for a full watch page you can share.
        </p>
      </section>

      <section>
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-surface-500">
          {videos.length} video{videos.length === 1 ? "" : "s"}
        </h3>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
