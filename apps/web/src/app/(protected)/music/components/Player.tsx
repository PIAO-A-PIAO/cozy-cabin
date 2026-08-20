"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Track } from "@/lib/api/track";

type PlayerProps = {
  currentMusic: Track | null;
  tracks: Track[];
  setCurrentMusic: Dispatch<SetStateAction<Track | null>>;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function Player({
  currentMusic,
  tracks,
  setCurrentMusic,
}: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(currentMusic?.duration ?? 0);
  const [volume, setVolume] = useState(1);

  const currentIndex = currentMusic
    ? tracks.findIndex((track) => track.id === currentMusic.id)
    : -1;

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentMusic) {
      return;
    }

    audio.src = currentMusic.url;
    audio.load();
    setProgress(0);
    setDuration(currentMusic.duration);
    void audio.play().catch(() => setIsPlaying(false));
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (currentIndex < 0 || currentIndex >= tracks.length - 1) {
        setIsPlaying(false);
        return;
      }

      setCurrentMusic(tracks[currentIndex + 1]);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, setCurrentMusic, tracks]);

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (!audio || !currentMusic) {
      return;
    }

    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = value;
      setProgress(value);
    }
  };

  const updateVolume = (value: number) => {
    setVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentMusic(tracks[currentIndex - 1]);
    }
  };

  const playNext = () => {
    if (currentIndex >= 0 && currentIndex < tracks.length - 1) {
      setCurrentMusic(tracks[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="truncate text-center text-base font-medium text-zinc-800 dark:text-zinc-200">
        {currentMusic?.title ?? "No music selected"}
      </p>
      <audio ref={audioRef} />
      <div className="flex items-center gap-2">
        <span className="w-10 text-xs tabular-nums text-zinc-500">
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(progress, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          disabled={!currentMusic || !duration}
          aria-label="Music progress"
          className="min-w-0 flex-1 accent-zinc-800"
        />
        <span className="w-10 text-right text-xs tabular-nums text-zinc-500">
          {formatTime(duration)}
        </span>
      </div>
      <div className="relative flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={playPrevious}
          disabled={currentIndex <= 0}
          aria-label="Play previous music"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-lg disabled:opacity-40"
        >
          <span aria-hidden="true">&#x23EE;</span>
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!currentMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          <span aria-hidden="true">
            {isPlaying ? "\u23F8" : "\u25B6"}
          </span>
        </button>
        <button
          type="button"
          onClick={playNext}
          disabled={currentIndex < 0 || currentIndex >= tracks.length - 1}
          aria-label="Play next music"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-lg disabled:opacity-40"
        >
          <span aria-hidden="true">&#x23ED;</span>
        </button>
        <label className="absolute right-0 flex items-center gap-2 text-xs text-zinc-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current"
            strokeWidth="1.8"
          >
            <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
            <path strokeLinecap="round" d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => updateVolume(Number(event.target.value))}
            aria-label="Music volume"
            className="w-20 accent-zinc-800"
          />
        </label>
      </div>
    </div>
  );
}
