"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PomodoroModal from "../focus/components/PomodoroModal";

export default function HomePage() {
  const router = useRouter();
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center gap-4 px-4">
        <button
          onClick={() => setIsFocusModalOpen(true)}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start Focusing
        </button>
        <button
          onClick={() => router.push("/letters")}
          className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          Letters
        </button>
      </div>
      {isFocusModalOpen ? (
        <PomodoroModal onClose={() => setIsFocusModalOpen(false)} />
      ) : null}
    </>
  );
}
