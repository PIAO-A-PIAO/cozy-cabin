"use client";

import { useEffect, useRef } from "react";
import type { Track } from "@/lib/api/track";

type PlayerProps = {
  currentMusic: Track | null;
};

export default function Player({ currentMusic }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentMusic) {
      return;
    }
    audio.src = currentMusic.url;
    audio.load();
    void audio.play().catch(() => {
      // Browsers may block autoplay; the native controls remain available.
    });
  }, [currentMusic]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
        Player
      </p>
      <p className="truncate text-base font-medium text-zinc-800 dark:text-zinc-200">
        {currentMusic?.title ?? "No music selected"}
      </p>
      <audio ref={audioRef} controls className="w-full" />
    </div>
  );
}
