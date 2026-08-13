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
};

export default function PomodoroSettings({
  sessions,
  isLoading,
  error,
  onSeeHistory,
  onSessionRecorded,
}: PomodoroSettingsProps) {
  return (
    <div className="grid gap-5 lg:grid-rows-[auto_auto]">
      <div className="flex justify-center">
        <PomodoroTimer onSessionRecorded={onSessionRecorded} />
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
