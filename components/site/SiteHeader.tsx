import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-surface-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Channel
            <span className="text-accent">Mirror</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-surface-400 transition hover:text-white"
          >
            Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
