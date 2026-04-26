import Link from "next/link";

export default function WatchNotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-white">
        Video not found
      </h1>
      <p className="mt-2 text-surface-400">
        That ID is not in your library. It may have been removed or the link is
        wrong.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface-950 transition hover:bg-amber-400"
      >
        Go to library
      </Link>
    </main>
  );
}
