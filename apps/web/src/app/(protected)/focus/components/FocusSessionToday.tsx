"use client";

import type { FocusSession } from "./PomodoroModal";

function isToday(value: string) {
  return new Date(value).toDateString() === new Date().toDateString();
}

function formatMinutes(minutes: number) {
  if (minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

type FocusSessionTodayProps = {
  sessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
  onSeeHistory: () => void;
};

export default function FocusSessionToday({
  sessions,
  isLoading,
  error,
  onSeeHistory,
}: FocusSessionTodayProps) {
  const todaySessions = sessions.filter((session) => isToday(session.createdAt));
  const completedSessionsCount = todaySessions.filter(
    (session) => session.actualDurationMinutes >= session.plannedDurationMinutes,
  ).length;

  const plannedMinutesToday = todaySessions.reduce(
    (sum, session) => sum + session.plannedDurationMinutes,
    0,
  );
  const actualMinutesToday = todaySessions.reduce(
    (sum, session) => sum + session.actualDurationMinutes,
    0,
  );

  const actualBarWidth =
    plannedMinutesToday > 0
      ? Math.min(100, (actualMinutesToday / plannedMinutesToday) * 100)
      : 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Today
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {completedSessionsCount} / {todaySessions.length} focus session
            {completedSessionsCount === 1 ? "" : "s"} completed
          </h3>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading today&apos;s summary...</p>
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>{formatMinutes(actualMinutesToday)} focused</span>
            <span>{formatMinutes(plannedMinutesToday)} planned</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-black"
              style={{ width: `${actualBarWidth}%` }}
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={onSeeHistory}
        className="mt-4 text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-zinc-100"
      >
        See complete history
      </button>
    </section>
  );
}
