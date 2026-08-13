"use client";

import PomodoroTimer from "./PomodoroTimer";
import FocusSessionToday from "./FocusSessionToday";
import type { FocusSession } from "./PomodoroModal";

type PomodoroSettingsProps = {
  sessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
  onSeeHistory: () => void;
  onSessionRecorded: (session: FocusSession) => void;
  onCompactStateChange: (state: {
    status: "idle" | "running" | "paused";
    timerMode: "focus" | "break";
    timeRemaining: number;
    currentSession: number;
    totalSessions: number;
  }) => void;
};

export default function PomodoroSettings({
  sessions,
  isLoading,
  error,
  onSeeHistory,
  onSessionRecorded,
  onCompactStateChange,
}: PomodoroSettingsProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex justify-center">
        <PomodoroTimer
          onSessionRecorded={onSessionRecorded}
          onCompactStateChange={onCompactStateChange}
        />
      </div>
      <div className="min-h-0 flex-1">
        <FocusSessionToday
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onSeeHistory={onSeeHistory}
        />
      </div>
    </div>
  );
}
