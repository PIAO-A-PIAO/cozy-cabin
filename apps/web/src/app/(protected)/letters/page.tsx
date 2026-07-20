"use client";

import { useState } from "react";

export default function LettersPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "drafts">("inbox");

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">Letters</h1>
          <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
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

        {activeTab === "drafts" ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Recipient ID"
              className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
            />
            <textarea
              placeholder="Write a letter"
              className="min-h-48 w-full resize-none rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
            />
            <div className="flex justify-end gap-3">
              <button className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
                Save
              </button>
              <button className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded border border-zinc-200 px-4 py-12 text-center dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              No letters
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {activeTab === "inbox"
                ? "Received letters will appear here."
                : "Sent letters will appear here."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
