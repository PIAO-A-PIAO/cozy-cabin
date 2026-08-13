"use client";

import PomodoroTimer from "./PomodoroTimer";
import FocusSessionToday from "./FocusSessionToday";
import type { FocusSession } from "./PomodoroModal";

type PomodoroSettingsProps = {
  sessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
  onSeeHistory: () => void;
};

export default function PomodoroSettings({
  sessions,
  isLoading,
  error,
  onSeeHistory,
}: PomodoroSettingsProps) {
  return (
    <div className="grid gap-5 lg:grid-rows-[auto_auto]">
      <div className="flex justify-center">
        <PomodoroTimer />
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
