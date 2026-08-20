"use client";

export default function Playlist() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
        Playlist
      </p>
      <div className="min-h-0 flex-1 rounded-3xl border border-dashed border-zinc-300 bg-white/60 dark:border-zinc-700 dark:bg-zinc-950/60" />
    </div>
  );
}
