"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CountDown from "./CountDown";
import FocusPlan from "./FocusPlan";

type StatusType = "idle" | "running" | "paused";
export type TimerModeType = "focus" | "break";

const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const DEFAULT_TOTAL_ROUNDS = 1;

const STORAGE_KEYS = {
  timeRemaining: "local_timer_timeRemaining",
  endTime: "local_timer_endTime",
  status: "local_timer_status",
  mode: "local_timer_mode",
  focusMinutes: "local_timer_focusMinutes",
  breakMinutes: "local_timer_breakMinutes",
  totalRounds: "local_timer_totalRounds",
  roundsCompleted: "local_timer_roundsCompleted",
  roundsRemaining: "local_timer_roundsRemaining",
};

const BUTTON_LABELS: Record<StatusType, string> = {
  idle: "Start",
  running: "Pause",
  paused: "Resume",
};

type FocusSessionRecord = {
  id: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type PomodoroTimerProps = {
  onSessionRecorded?: (session: FocusSessionRecord) => void;
  onCompactStateChange?: (state: {
    status: StatusType;
    timerMode: TimerModeType;
    timeRemaining: number;
    currentSession: number;
    totalSessions: number;
  }) => void;
};

async function createFocusSession(
  plannedDurationMinutes: number,
  actualDurationMinutes: number,
) {
  const res = await fetch("/api/focus-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plannedDurationMinutes,
      actualDurationMinutes,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create focus session");
  }

  return (await res.json()) as FocusSessionRecord;
}

function PomodoroTimer({
  onSessionRecorded,
  onCompactStateChange,
}: PomodoroTimerProps) {
  const [timerMode, setTimerMode] = useState<TimerModeType>("focus");
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_FOCUS_MINUTES * 60);
  const [status, setStatus] = useState<StatusType>("idle");
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT_FOCUS_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [totalRounds, setTotalRounds] = useState(DEFAULT_TOTAL_ROUNDS);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [roundsRemaining, setRoundsRemaining] = useState(DEFAULT_TOTAL_ROUNDS);
  const sessionRecorded = useRef(false);

  useEffect(() => {
    onCompactStateChange?.({
      status,
      timerMode,
      timeRemaining,
      currentSession: Math.min(roundsCompleted + 1, totalRounds),
      totalSessions: totalRounds,
    });
  }, [
    onCompactStateChange,
    status,
    timerMode,
    timeRemaining,
    roundsCompleted,
    totalRounds,
  ]);

  const persistPlan = (
    nextFocusMinutes: number,
    nextBreakMinutes: number,
    nextTotalRounds: number,
  ) => {
    localStorage.setItem(STORAGE_KEYS.focusMinutes, String(nextFocusMinutes));
    localStorage.setItem(STORAGE_KEYS.breakMinutes, String(nextBreakMinutes));
    localStorage.setItem(STORAGE_KEYS.totalRounds, String(nextTotalRounds));
  };

  const persistCounters = (completed: number, remaining: number) => {
    localStorage.setItem(STORAGE_KEYS.roundsCompleted, String(completed));
    localStorage.setItem(STORAGE_KEYS.roundsRemaining, String(remaining));
  };

  const clearSavedTimer = () => {
    localStorage.removeItem(STORAGE_KEYS.timeRemaining);
    localStorage.removeItem(STORAGE_KEYS.endTime);
    localStorage.removeItem(STORAGE_KEYS.status);
  };

  const setRunningCountdown = (mode: TimerModeType, seconds: number) => {
    setTimerMode(mode);
    setTimeRemaining(seconds);
    setStatus("running");
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    localStorage.setItem(STORAGE_KEYS.status, "running");
    localStorage.setItem(
      STORAGE_KEYS.endTime,
      String(Date.now() + seconds * 1000),
    );
  };

  const setPausedCountdown = (mode: TimerModeType, seconds: number) => {
    setTimerMode(mode);
    setTimeRemaining(seconds);
    setStatus("paused");
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    localStorage.setItem(STORAGE_KEYS.status, "paused");
    localStorage.setItem(STORAGE_KEYS.timeRemaining, String(seconds));
    localStorage.removeItem(STORAGE_KEYS.endTime);
  };

  const setIdlePlan = () => {
    setTimerMode("focus");
    setTimeRemaining(focusMinutes * 60);
    setStatus("idle");
    clearSavedTimer();
    persistCounters(0, totalRounds);
    setRoundsCompleted(0);
    setRoundsRemaining(totalRounds);
    sessionRecorded.current = false;
    localStorage.setItem(STORAGE_KEYS.mode, "focus");
  };

  const commitPlanChange = (
    nextFocusMinutes: number,
    nextBreakMinutes: number,
    nextTotalRounds: number,
  ) => {
    setFocusMinutes(nextFocusMinutes);
    setBreakMinutes(nextBreakMinutes);
    setTotalRounds(nextTotalRounds);
    setRoundsCompleted(0);
    setRoundsRemaining(nextTotalRounds);
    sessionRecorded.current = false;
    persistPlan(nextFocusMinutes, nextBreakMinutes, nextTotalRounds);
    persistCounters(0, nextTotalRounds);
  };

  const handleFocusMinutesAdjustment = (
    digit: "tens" | "ones",
    direction: "up" | "down",
  ) => {
    const tens = Math.floor(focusMinutes / 10);
    const ones = focusMinutes % 10;

    let nextValue =
      digit === "tens"
        ? (((tens + (direction === "up" ? 1 : -1) + 10) % 10) * 10 + ones)
        : tens * 10 + (ones === 0 ? 5: 0);

    if (nextValue === 0) {
      nextValue = 5;
    }

    commitPlanChange(nextValue, breakMinutes, totalRounds);
  };

  const handleBreakMinutesAdjustment = (
    digit: "tens" | "ones",
    direction: "up" | "down",
  ) => {
    const tens = Math.floor(breakMinutes / 10);
    const ones = breakMinutes % 10;

    const nextValue =
      digit === "tens"
        ? (((tens + (direction === "up" ? 1 : -1) + 10) % 10) * 10 + ones)
        : tens * 10 + (ones + (direction === "up" ? 1 : -1) + 10) % 10;

    commitPlanChange(focusMinutes, nextValue, totalRounds);
  };

  const handleRoundsAdjustment = (direction: "up" | "down") => {
    let nextValue =
      totalRounds + (direction === "up" ? 1 : -1);

    if (nextValue > 10) {
      nextValue = 1;
    }

    if (nextValue < 1) {
      nextValue = 10;
    }

    commitPlanChange(focusMinutes, breakMinutes, nextValue);
  };

  const recordFocusSession = async (actualDurationMinutes: number) => {
    const session = await createFocusSession(
      focusMinutes,
      actualDurationMinutes,
    );
    onSessionRecorded?.(session);
  };

  const handleClick = () => {
    switch (status) {
      case "idle": {
        setRoundsCompleted(0);
        setRoundsRemaining(totalRounds);
        persistCounters(0, totalRounds);
        sessionRecorded.current = false;
        setRunningCountdown("focus", focusMinutes * 60);
        return;
      }
      case "paused":
        return setRunningCountdown(timerMode, timeRemaining);
      case "running":
        return setPausedCountdown(timerMode, timeRemaining);
    }
  };

  const handleReset = () => {
    if (timerMode === "focus" && status !== "idle" && !sessionRecorded.current) {
      const actualDurationMinutes = Math.max(
        0,
        Math.floor((focusMinutes * 60 - timeRemaining) / 60),
      );
      if (actualDurationMinutes >= 5) {
        sessionRecorded.current = true;
        void recordFocusSession(actualDurationMinutes).catch(() => {
          toast.error("Failed to save focus session.");
        });
      }
    }

    clearSavedTimer();
    setTimerMode("focus");
    setTimeRemaining(focusMinutes * 60);
    setStatus("idle");
    setRoundsCompleted(0);
    setRoundsRemaining(totalRounds);
    sessionRecorded.current = false;
    persistCounters(0, totalRounds);
    localStorage.setItem(STORAGE_KEYS.mode, "focus");
  };

  const handleSkipBreak = () => {
    if (roundsRemaining > 0) {
      sessionRecorded.current = false;

      const nextMode: TimerModeType = "focus";
      const nextSeconds = focusMinutes * 60;

      if (status === "paused") {
        setPausedCountdown(nextMode, nextSeconds);
      } else {
        setRunningCountdown(nextMode, nextSeconds);
      }
      return;
    }

    setIdlePlan();
  };

  useEffect(() => {
    const loadNumber = (key: string, fallback: number) => {
      const raw = localStorage.getItem(key);
      const value = Number(raw);
      return Number.isFinite(value) ? value : fallback;
    };

    const storedFocusMinutes = loadNumber(
      STORAGE_KEYS.focusMinutes,
      DEFAULT_FOCUS_MINUTES,
    );
    const storedBreakMinutes = loadNumber(
      STORAGE_KEYS.breakMinutes,
      DEFAULT_BREAK_MINUTES,
    );
    const storedTotalRounds = loadNumber(
      STORAGE_KEYS.totalRounds,
      DEFAULT_TOTAL_ROUNDS,
    );
    const storedStatus = localStorage.getItem(
      STORAGE_KEYS.status,
    ) as StatusType | null;
    const storedTimerMode = localStorage.getItem(
      STORAGE_KEYS.mode,
    ) as TimerModeType | null;
    const storedRoundsCompleted = loadNumber(
      STORAGE_KEYS.roundsCompleted,
      0,
    );
    const storedRoundsRemaining = loadNumber(
      STORAGE_KEYS.roundsRemaining,
      storedTotalRounds,
    );

    setFocusMinutes(storedFocusMinutes);
    setBreakMinutes(storedBreakMinutes);
    setTotalRounds(storedTotalRounds);

    if (storedStatus === "paused") {
      setTimerMode(storedTimerMode ?? "focus");
      setTimeRemaining(Number(localStorage.getItem(STORAGE_KEYS.timeRemaining)));
      setStatus("paused");
      setRoundsCompleted(storedRoundsCompleted);
      setRoundsRemaining(storedRoundsRemaining);
      return;
    }

    if (storedStatus === "running") {
      setTimerMode(storedTimerMode ?? "focus");
      const endTime = localStorage.getItem(STORAGE_KEYS.endTime);
      if (endTime) {
        const timeDifference = Number(endTime) - Date.now();
        const toNumber = Math.max(0, Math.floor(timeDifference / 1000));
        setTimeRemaining(toNumber);
      } else {
        setTimeRemaining(storedTimerMode === "break"
          ? storedBreakMinutes * 60
          : storedFocusMinutes * 60);
      }
      setStatus("running");
      setRoundsCompleted(storedRoundsCompleted);
      setRoundsRemaining(storedRoundsRemaining);
      return;
    }

    setTimerMode("focus");
    setTimeRemaining(storedFocusMinutes * 60);
    setStatus("idle");
    setRoundsCompleted(0);
    setRoundsRemaining(storedTotalRounds);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (status === "running") {
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
    if (timeRemaining !== 0) {
      return;
    }

    if (timerMode === "focus") {
      const nextCompleted = roundsCompleted + 1;
      const nextRemaining = Math.max(0, roundsRemaining - 1);

      setRoundsCompleted(nextCompleted);
      setRoundsRemaining(nextRemaining);
      persistCounters(nextCompleted, nextRemaining);

      if (!sessionRecorded.current) {
        sessionRecorded.current = true;
        void recordFocusSession(focusMinutes).catch(() => {
          toast.error("Failed to save focus session.");
        });
      }

      if (nextRemaining > 0) {
        if (breakMinutes > 0) {
          setRunningCountdown("break", breakMinutes * 60);
        } else {
          setRunningCountdown("focus", focusMinutes * 60);
        }
      } else {
        sessionRecorded.current = false;
        setTimerMode("focus");
        setTimeRemaining(focusMinutes * 60);
        setStatus("idle");
        clearSavedTimer();
        setRoundsCompleted(0);
        setRoundsRemaining(totalRounds);
        persistCounters(0, totalRounds);
        localStorage.setItem(STORAGE_KEYS.mode, "focus");
      }

      toast.success("Focus session complete. Time for a short break.", {
        duration: 10000,
      });
      return;
    }

    if (roundsRemaining > 0) {
      sessionRecorded.current = false;
      if (focusMinutes > 0) {
        setRunningCountdown("focus", focusMinutes * 60);
      } else {
        setRunningCountdown("focus", 0);
      }
    } else {
      setIdlePlan();
    }

    toast.success("Break finished. Ready to focus again?", {
      duration: 10000,
    });
  }, [
    timeRemaining,
    timerMode,
    roundsCompleted,
    roundsRemaining,
    focusMinutes,
    breakMinutes,
    totalRounds,
  ]);

  const buttonLabel = BUTTON_LABELS[status];
  const secondaryButtonLabel =
    timerMode === "break" ? "Skip Break" : "Reset";
  const handleSecondaryClick = () => {
    if (timerMode === "break") {
      handleSkipBreak();
      return;
    }

    handleReset();
  };

  return (
    <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {status === "idle" ? (
        <FocusPlan
          focusMinutes={focusMinutes}
          breakMinutes={breakMinutes}
          totalRounds={totalRounds}
          roundsCompleted={roundsCompleted}
          roundsRemaining={roundsRemaining}
          showBreak={totalRounds > 1}
          onAdjustFocusMinutes={handleFocusMinutesAdjustment}
          onAdjustBreakMinutes={handleBreakMinutesAdjustment}
          onAdjustRounds={handleRoundsAdjustment}
        />
      ) : (
        <CountDown
          seconds={timeRemaining}
          currentSession={Math.min(roundsCompleted + 1, totalRounds)}
          totalSessions={totalRounds}
          timerMode={timerMode}
        />
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={handleClick}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {buttonLabel}
        </button>
        <button
          disabled={timerMode === "focus" && status === "idle"}
          onClick={handleSecondaryClick}
          className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {secondaryButtonLabel}
        </button>
      </div>
    </section>
  );
}

export default PomodoroTimer;
