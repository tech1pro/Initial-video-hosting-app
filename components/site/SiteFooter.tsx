export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-surface-950/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-center text-xs text-surface-500">
          Source:{" "}
          <a
            href="https://www.youtube.com/@hiphopimagination"
            target="_blank"
            rel="noopener noreferrer"
            className="text-surface-400 underline-offset-2 hover:text-accent hover:underline"
          >
            Hip Hop Imagination
          </a>
          {" · "}
          Not affiliated with YouTube.
        </p>
      </div>
    </footer>
  );
}
