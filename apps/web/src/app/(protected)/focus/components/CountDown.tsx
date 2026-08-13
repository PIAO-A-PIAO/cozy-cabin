"use client";

import { TimerModeType } from "./PomodoroTimer";

type CountDownProps = {
  seconds: number;
  currentSession: number;
  totalSessions: number;
  timerMode: TimerModeType;
};

function formatTime(seconds: number) {
  const minute = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

export default function CountDown({
  seconds,
  currentSession,
  totalSessions,
  timerMode
}: CountDownProps) {
  return (
    <div>
      {timerMode == "focus" ?
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Focus session {currentSession} / {totalSessions}
      </p> :
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Take a break
      </p>
    }
      <div className="mt-2 font-mono text-6xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
        {formatTime(seconds)}
      </div>
    </div>
  );
}
