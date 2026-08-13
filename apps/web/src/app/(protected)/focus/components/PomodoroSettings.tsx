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
    <div className="grid gap-5 lg:grid-rows-[auto_auto]">
      <div className="flex justify-center">
        <PomodoroTimer
          onSessionRecorded={onSessionRecorded}
          onCompactStateChange={onCompactStateChange}
        />
      </div>
      <FocusSessionToday
        sessions={sessions}
        isLoading={isLoading}
        error={error}
        onSeeHistory={onSeeHistory}
      />
    </div>
  );
}
