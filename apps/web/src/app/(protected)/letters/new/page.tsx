"use client"

import { createDraft, sendDraft } from "@/lib/api/letter";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewLetterPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");

  const handleSave = async () => {
    const draft = await createDraft({
      content,
      recipientId: recipientId || undefined,
    });

    router.replace(`/letters/${draft.id}`);
  };

  const handleSend = async () => {
    const draft = await createDraft({
      content,
      recipientId: recipientId || undefined,
    });

    await sendDraft(draft.id);
    router.push("/letters");
  };

  const handleBack = async () => {
    if (recipientId.trim() || content.trim()) {
      const shouldSave = window.confirm("Save this draft before leaving?");

      if (shouldSave) {
        await handleSave();
        return;
      }
    }

    router.push("/letters");
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={handleBack} className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
            Back
          </button>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            New Letter
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(event) => setRecipientId(event.target.value)}
            className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a letter"
            className="min-h-72 w-full resize-none rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
          <div className="flex justify-end gap-3">
            <button onClick={handleSave} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
              Save
            </button>
            <button onClick={handleSend} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
