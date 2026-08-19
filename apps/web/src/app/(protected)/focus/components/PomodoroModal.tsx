"use client";

import { useEffect, useState } from "react";
import FocusSessionHistory from "./FocusSessionHistory";
import PomodoroSettings from "./PomodoroSettings";
import Image from "next/image";

export type FocusSession = {
  id: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type ViewMode = "settings" | "history";

type CompactTimerState = {
  status: "idle" | "running" | "paused";
  timerMode: "focus" | "break";
  timeRemaining: number;
  currentSession: number;
  totalSessions: number;
};

const INITIAL_COMPACT_STATE: CompactTimerState = {
  status: "idle",
  timerMode: "focus",
  timeRemaining: 25 * 60,
  currentSession: 1,
  totalSessions: 1,
};

function getIndicatorColor(state: CompactTimerState) {
  if (state.status === "idle") return "#e2d3bf";
  if (state.timerMode === "focus") return "#22c55e";
  return "#f59e0b";
}

function formatTime(seconds: number) {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

export default function PomodoroModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("settings");
  const [isHovered, setIsHovered] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idleTimeLabel, setIdleTimeLabel] = useState<string>();
  const [compactState, setCompactState] =
    useState<CompactTimerState>(INITIAL_COMPACT_STATE);

  const handleSessionRecorded = (session: FocusSession) => {
    setSessions((current) => [session, ...current]);
  };

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await fetch("/api/focus-sessions");

        if (!res.ok) {
          throw new Error("Failed to load focus sessions");
        }

        const data = (await res.json()) as FocusSession[];
        setSessions(data);
      } catch {
        setError("Unable to load focus session data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    if (compactState.status !== "idle") return;

    const updateClock = () => {
      setIdleTimeLabel(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, [compactState.status]);

  const compactLabel =
    compactState.status === "idle"
      ? idleTimeLabel
      : formatTime(compactState.timeRemaining);

  const handleClose = () => {
    setViewMode("settings");
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`absolute left-[60%] top-[48%] -translate-x-1/2 [container-type:inline-size] ${
          isHovered ? "aspect-[211/154] w-[7.1%]" : "aspect-[207/154] w-[7%]"
        }`}
        aria-label="Open pomodoro timer"
      >
        <div
          className="absolute left-[16%] top-[36%] z-10 h-[clamp(0.2rem,1cqw,0.4rem)] w-[clamp(0.2rem,1cqw,0.4rem)] rounded-full border border-black/20 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
          style={{ backgroundColor: getIndicatorColor(compactState), transform: "matrix(1,0.05,0,1,0,0)" }}
          aria-hidden="true"
        />
        <Image
          src={`/assets/room/pomodoro${isHovered ? "_hover" : ""}.png`}
          alt="Pomodoro timer"
          fill
          sizes="100vw"
          draggable={false}
          className="object-contain drop-shadow-2xl"
        />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center content-center font-mono translate-x-[-0.3em] translate-y-[0.3em] text-[clamp(0.45rem,12cqw,0.9rem)] font-semibold tracking-[0.16em] tabular-nums text-[#e2d3bf]"
          style={{ transform: "matrix(1,0.05,0,1,0,0)" }}
        >
          {compactLabel}
        </div>
      </button>

      <section
        id="pomodoro-modal-panel"
        aria-hidden={!isOpen}
        className={
          isOpen
            ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            : "hidden"
        }
        >
        <div className="relative flex h-[min(80vh,44rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Close
          </button>

          <div className="mt-8 flex-1 min-h-0">
            <div
              className={
                viewMode === "history"
                  ? "hidden h-full"
                  : "h-full min-h-0"
              }
            >
              <PomodoroSettings
                sessions={sessions}
                isLoading={isLoading}
                error={error}
                onSeeHistory={() => setViewMode("history")}
                onSessionRecorded={handleSessionRecorded}
                onCompactStateChange={setCompactState}
              />
            </div>

            <div
              className={
                viewMode === "settings"
                  ? "hidden h-full"
                  : "h-full min-h-0"
              }
            >
              <div className="h-full rounded-3xl bg-white p-4 dark:bg-zinc-950 sm:p-6">
                <FocusSessionHistory
                  sessions={sessions}
                  isLoading={isLoading}
                  error={error}
                  onBackToSettings={() => setViewMode("settings")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
