"use client";

import type { FocusSession } from "./PomodoroModal";

type FocusSessionHistoryProps = {
  sessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
  onBackToSettings: () => void;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMinutes(minutes: number) {
  return `${minutes} min`;
}

export default function FocusSessionHistory({
  sessions,
  isLoading,
  error,
  onBackToSettings,
}: FocusSessionHistoryProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBackToSettings}
          className="justify-self-start text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Back to settings
        </button>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300">
          Full history
        </h2>
        <div />
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading history...</p>
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No focus sessions yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((session) => {
                const status =
                  session.actualDurationMinutes >= session.plannedDurationMinutes
                    ? "Completed"
                    : "Interrupted";

                return (
                  <li
                    key={session.id}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                          Completed at {formatDateTime(session.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-950">
                        {status}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Planned {formatMinutes(session.plannedDurationMinutes)}</span>
                      <span>Focused {formatMinutes(session.actualDurationMinutes)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
