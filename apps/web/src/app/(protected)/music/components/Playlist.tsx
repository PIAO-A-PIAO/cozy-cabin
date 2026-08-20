"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { getTracks } from "@/lib/api/track";
import type { Track } from "@/lib/api/track";

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type PlaylistProps = {
  currentMusic: Track | null;
  setCurrentMusic: Dispatch<SetStateAction<Track | null>>;
};

export default function Playlist({ currentMusic, setCurrentMusic }: PlaylistProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setTracks(await getTracks());
      } catch {
        setError("Unable to load tracks.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
        Playlist
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
        {isLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading tracks...</p>
        ) : error ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{error}</p>
        ) : tracks.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No tracks yet.</p>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setCurrentMusic(track)}
                aria-pressed={currentMusic?.id === track.id}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-zinc-800 transition-colors dark:text-zinc-200 ${
                  currentMusic?.id === track.id
                    ? "border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium">{track.title}</p>
                  </div>
                  <span className="shrink-0 text-sm opacity-70">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
