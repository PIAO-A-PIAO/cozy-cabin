"use client"

import PomodoroTimer from "./components/PomodoroTimer";

export default function FocusPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-900">
      <PomodoroTimer />
    </main>
  );
}
