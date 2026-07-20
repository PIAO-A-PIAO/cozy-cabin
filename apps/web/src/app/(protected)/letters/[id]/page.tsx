"use client"

import { deleteDraft, getLetter, sendDraft, updateDraft } from "@/lib/api/letter";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Letter = {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  status: "DRAFT" | "SENT";
  sentAt?: string;
  updatedAt: string;
};

export default function LetterDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [letter, setLetter] = useState<Letter>();
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const data = await getLetter(params.id);
        setLetter(data);
        setContent(data.content);
        setRecipientId(data.recipientId || "");
      } catch (error) {
        console.error("Failed to fetch letter:", error);
      }
    };

    fetchLetter();
  }, [params.id]);

  const handleSave = async () => {
    await updateDraft(params.id, {
      content,
      recipientId: recipientId || undefined,
    });

    const data = await getLetter(params.id);
    setLetter(data);
  };

  const handleSend = async () => {
    await updateDraft(params.id, {
      content,
      recipientId: recipientId || undefined,
    });
    await sendDraft(params.id);
    router.push("/letters");
  };

  const handleDelete = async () => {
    await deleteDraft(params.id);
    router.push("/letters");
  };

  const handleBack = async () => {
    if (letter?.status === "DRAFT" && (recipientId.trim() || content.trim())) {
      const shouldSave = window.confirm("Save this draft before leaving?");

      if (shouldSave) {
        await handleSave();
      }
    }

    router.push("/letters");
  };

  if (!letter) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
        <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button onClick={handleBack} className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
            Back
          </button>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {letter.status === "DRAFT" ? "Draft" : "Letter"}
          </p>
        </div>

        {letter.status === "DRAFT" ? (
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
              <button onClick={handleDelete} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
                Delete
              </button>
              <button onClick={handleSave} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
                Save
              </button>
              <button onClick={handleSend} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                Send
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1 border-b border-zinc-200 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <p>From: {letter.senderId}</p>
              <p>To: {letter.recipientId || "Unknown"}</p>
              <p>Date: {letter.sentAt ? new Date(letter.sentAt).toLocaleString() : ""}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-950 dark:text-zinc-50">
              {letter.content}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
