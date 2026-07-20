"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Drafts from "./components/Drafts";
import InboxList from "./components/InboxList";
import SentList from "./components/SentList";

export default function LettersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "drafts">("inbox");

  const handleNewLetter = () => {
    router.push("/letters/new");
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">Letters</h1>
          <button onClick={handleNewLetter} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            New Letter
          </button>
        </div>

        <div className="mb-6 grid grid-cols-3 rounded border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {(["inbox", "sent", "drafts"] as const).map((tab) => (
            <button
              key={tab}
              disabled={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "inbox" && <InboxList />}

        {activeTab === "sent" && <SentList />}

        {activeTab === "drafts" && <Drafts />}
      </section>
    </main>
  );
}
