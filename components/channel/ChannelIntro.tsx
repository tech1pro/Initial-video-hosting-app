import Image from "next/image";
import { CHANNEL_INFO } from "@/lib/channel-info";

export default function ChannelIntro() {
  return (
    <section className="mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-surface-900/80 to-surface-950/40 p-6 sm:mb-14 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-32 sm:w-32">
          <Image
            src={CHANNEL_INFO.avatarUrl}
            alt=""
            width={128}
            height={128}
            className="rounded-full object-cover ring-2 ring-accent/35 ring-offset-4 ring-offset-surface-950"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Channel
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            {CHANNEL_INFO.displayName}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-surface-300 sm:mx-0 sm:text-lg">
            {CHANNEL_INFO.intro}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
            {CHANNEL_INFO.topics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/[0.06] bg-surface-900/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-surface-500"
              >
                #{t}
              </span>
            ))}
          </div>
          <a
            href={CHANNEL_INFO.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:justify-start"
          >
            Open channel on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
