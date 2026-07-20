"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center gap-4 px-4">
      <button
        onClick={() => router.push("/focus")}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Start Focusing
      </button>
      <button
        onClick={() => router.push("/letters")}
        className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700"
      >
        Letters
      </button>
    </div>
  );
}
