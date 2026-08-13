"use client";

type DigitControlProps = {
  value: string;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
};

function DigitControl({
  value,
  onIncrement,
  onDecrement,
  disabled,
}: DigitControlProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className="text-xs leading-none text-zinc-500 transition-colors hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
        aria-label="Increase value"
      >
        ^
      </button>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white font-mono text-lg font-semibold text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
        {value}
      </div>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className="text-xs leading-none text-zinc-500 transition-colors hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
        aria-label="Decrease value"
      >
        v
      </button>
    </div>
  );
}

type FocusPlanProps = {
  focusMinutes: number;
  breakMinutes: number;
  totalRounds: number;
  roundsCompleted: number;
  roundsRemaining: number;
  showBreak: boolean;
  onAdjustFocusMinutes: (digit: "tens" | "ones", direction: "up" | "down") => void;
  onAdjustBreakMinutes: (digit: "tens" | "ones", direction: "up" | "down") => void;
  onAdjustRounds: (direction: "up" | "down") => void;
};

export default function FocusPlan({
  focusMinutes,
  breakMinutes,
  totalRounds,
  roundsCompleted,
  roundsRemaining,
  showBreak,
  onAdjustFocusMinutes,
  onAdjustBreakMinutes,
  onAdjustRounds,
}: FocusPlanProps) {
  const focusTens = Math.floor(focusMinutes / 10);
  const focusOnes = focusMinutes % 10;
  const breakTens = Math.floor(breakMinutes / 10);
  const breakOnes = breakMinutes % 10;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Focus plan
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-center gap-3">
        <div className="pb-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          focus
        </div>
        <DigitControl
          value={String(focusTens)}
          onIncrement={() => onAdjustFocusMinutes("tens", "up")}
          onDecrement={() => onAdjustFocusMinutes("tens", "down")}
        />
        <DigitControl
          value={String(focusOnes)}
          onIncrement={() => onAdjustFocusMinutes("ones", "up")}
          onDecrement={() => onAdjustFocusMinutes("ones", "down")}
          disabled={focusTens === 0}
        />
        <div className="pb-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          minutes x
        </div>
        <DigitControl
          value={String(totalRounds)}
          onIncrement={() => onAdjustRounds("up")}
          onDecrement={() => onAdjustRounds("down")}
        />
      </div>

      {showBreak ? (
        <div className="mt-5 flex flex-wrap items-end justify-center gap-3">
          <div className="pb-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            with
          </div>
          <DigitControl
            value={String(breakTens)}
            onIncrement={() => onAdjustBreakMinutes("tens", "up")}
            onDecrement={() => onAdjustBreakMinutes("tens", "down")}
          />
          <DigitControl
            value={String(breakOnes)}
            onIncrement={() => onAdjustBreakMinutes("ones", "up")}
            onDecrement={() => onAdjustBreakMinutes("ones", "down")}
          />
          <div className="pb-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            minutes break
          </div>
        </div>
      ) : null}
    </div>
  );
}
