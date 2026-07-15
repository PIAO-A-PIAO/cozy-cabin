import { useEffect, useState } from "react";
import { toast } from "sonner";

type StatusType = "idle" | "running" | "paused";
type TimerModeType = "focus" | "break";

const MODE_SECONDS: Record<TimerModeType, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

const MODE_LABELS: Record<TimerModeType, string> = {
  focus: "Focus",
  break: "Break",
};

const STORAGE_KEYS = {
  timeRemaining: "local_timer_timeRemaining",
  endTime: "local_timer_endTime",
  status: "local_timer_status",
  mode: "local_timer_mode",
};

const BUTTON_LABELS: Record<StatusType, string> = {
  idle: "Start",
  running: "Pause",
  paused: "Resume",
};

function PomodoroTimer() {
  const [timerMode, setTimerMode] = useState<TimerModeType>("focus");
  const [timeRemaining, setTimeRemaining] = useState(MODE_SECONDS.focus);
  const [status, setStatus] = useState<StatusType>("idle");

  const clearSavedTimer = () => {
    localStorage.removeItem(STORAGE_KEYS.timeRemaining);
    localStorage.removeItem(STORAGE_KEYS.endTime);
    localStorage.removeItem(STORAGE_KEYS.status);
  };

  const handleModeChange = (mode: TimerModeType) => {
    localStorage.setItem(STORAGE_KEYS.mode, mode)
    setTimerMode(mode);
    setTimeRemaining(MODE_SECONDS[mode]);
    setStatus("idle");
    clearSavedTimer();
  };

  const handleClick = () => {
    localStorage.removeItem(STORAGE_KEYS.timeRemaining);
    switch (status) {
      case "idle":
      case "paused":
        return handleStart();
      case "running":
        return handlePause();
    }
  };

  const handleStart = () => {
    localStorage.setItem(STORAGE_KEYS.endTime, String(Date.now() + timeRemaining * 1000));
    localStorage.setItem(STORAGE_KEYS.status, "running");
    setStatus("running");
  };

  const handlePause = () => {
    localStorage.setItem(STORAGE_KEYS.status, "paused");
    localStorage.setItem(STORAGE_KEYS.timeRemaining, String(timeRemaining));
    setStatus("paused");
  };

  const handleReset = () => {
    clearSavedTimer();
    setTimeRemaining(MODE_SECONDS[timerMode]);
    setStatus("idle");
  };

  const formatTime = (seconds: number) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

  useEffect(() => {
    const restoreTimer = () => {
      const storedTimerMode = localStorage.getItem(STORAGE_KEYS.mode) as TimerModeType | null;
      if (storedTimerMode) {
        setTimerMode(storedTimerMode);
        setTimeRemaining(MODE_SECONDS[storedTimerMode]);
      }
      const timerStatus = localStorage.getItem(STORAGE_KEYS.status) as StatusType | null;

      if (timerStatus == "paused") {
        setTimeRemaining(Number(localStorage.getItem(STORAGE_KEYS.timeRemaining)));
        setStatus(timerStatus);
        return;
      }

      const endTime = localStorage.getItem(STORAGE_KEYS.endTime);
      if (endTime && timerStatus == "running") {
        const timeDifference = Number(endTime) - Date.now();
        const toNumber = Math.max(0, Math.floor(timeDifference / 1000));
        setTimeRemaining(toNumber);
        setStatus(timerStatus);
      }
    }
    restoreTimer()
  }, []);



  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (status == "running") {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  useEffect(() => {
    if (timeRemaining !== 0) return;
    const handleTimerComplete = () => {
        if (timerMode == "focus") {
          toast.success("🍅 Focus session complete! Time for a short break.")
          handleModeChange("break")
        } else {
          toast.success("☕ Break finished! Ready to focus again?")
          handleModeChange("focus")
        }
      }
    handleTimerComplete()
  }, [timeRemaining]);

  const buttonLabel = BUTTON_LABELS[status];

  return (
    <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 grid grid-cols-2 rounded border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {(["focus", "break"] as TimerModeType[]).map((mode) => (
          <button
            key={mode}
            disabled={mode == timerMode}
            onClick={() => handleModeChange(mode)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              timerMode == mode
                ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {MODE_LABELS[timerMode]}
      </p>
      <div className="font-mono text-6xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
        {formatTime(timeRemaining)}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={handleClick}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {buttonLabel}
        </button>
        <button
          disabled={status == "idle"}
          onClick={handleReset}
          className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default PomodoroTimer;
