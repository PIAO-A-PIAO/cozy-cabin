"use client";

export default function Player() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
        Player
      </p>
      <div className="h-24 rounded-3xl border border-dashed border-zinc-300 bg-white/60 dark:border-zinc-700 dark:bg-zinc-950/60" />
    </div>
  );
}
