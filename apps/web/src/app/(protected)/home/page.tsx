"use client";

import { useRouter } from "next/navigation";
import PomodoroModal from "../focus/components/PomodoroModal";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center gap-4 px-4">
        <PomodoroModal />
        <button
          onClick={() => router.push("/letters")}
          className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
        >
          Letters
        </button>
      </div>
    </>
  );
}
