"use client";

import { useEffect, useState } from "react";
import FocusSessionHistory from "./FocusSessionHistory";
import PomodoroSettings from "./PomodoroSettings";

export type FocusSession = {
  id: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type ViewMode = "settings" | "history";

type PomodoroModalProps = {
  onClose: () => void;
};

export default function PomodoroModal({ onClose }: PomodoroModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("settings");
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <section className="relative w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Close
        </button>

        {viewMode === "settings" ? (
        <PomodoroSettings
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onSeeHistory={() => setViewMode("history")}
          onSessionRecorded={handleSessionRecorded}
        />
      ) : (
        <FocusSessionHistory
            sessions={sessions}
            isLoading={isLoading}
            error={error}
            onBackToSettings={() => setViewMode("settings")}
          />
        )}
      </section>
    </div>
  );
}
