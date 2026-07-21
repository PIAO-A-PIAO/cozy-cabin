"use client"

import { AuthContext } from "@/app/AuthProvider";
import DraftLetterForm, { DraftLetterPayload } from "@/app/(protected)/letters/components/DraftLetterForm";
import { deleteDraft, getLetter, sendDraft, updateDraft } from "@/lib/api/letter";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type LetterUser = {
  id: string;
  displayName: string;
  streetName?: string;
  houseNumber?: number;
};

type Letter = {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  sender?: LetterUser;
  recipientId?: string;
  recipientName?: string;
  recipient?: LetterUser;
  status: "DRAFT" | "SENT";
  sentAt?: string;
  updatedAt: string;
};

export default function LetterDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const from = fromParam === "sent" || fromParam === "drafts" ? fromParam : "inbox";
  const backPath = `/letters?tab=${from}`;
  const [letter, setLetter] = useState<Letter>();

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const data = await getLetter(params.id);
        setLetter(data);
      } catch (error) {
        console.error("Failed to fetch letter:", error);
      }
    };

    fetchLetter();
  }, [params.id]);

  const handleSave = async (payload: DraftLetterPayload) => {
    const updatedLetter = await updateDraft(params.id, payload);

    if (!updatedLetter.id) {
      return { ok: false, message: updatedLetter.message || "Could not save draft" };
    }

    const data = await getLetter(params.id);
    setLetter(data);
    return { ok: true };
  };

  const handleSend = async (payload: DraftLetterPayload) => {
    const updatedLetter = await updateDraft(params.id, payload);

    if (!updatedLetter.id) {
      return { ok: false, message: updatedLetter.message || "Could not save draft" };
    }

    const sentLetter = await sendDraft(params.id);

    if (!sentLetter.id) {
      return { ok: false, message: sentLetter.message || "Could not send letter" };
    }

    router.push("/letters?tab=sent");
    return { ok: true };
  };

  const handleDelete = async () => {
    await deleteDraft(params.id);
    router.push("/letters?tab=drafts");
  };

  const handleBack = async () => {
    router.push(backPath);
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

  const formatAddress = (letterUser?: LetterUser) => {
    if (!letterUser?.streetName || !letterUser.houseNumber) {
      return "Unknown address";
    }

    return `${letterUser.houseNumber} ${letterUser.streetName}`;
  };

  const isOwnSentLetter =
    from === "sent" || (user.id && user.id === letter.senderId);
  const otherParty = isOwnSentLetter ? letter.recipient : letter.sender;
  const ownParty = isOwnSentLetter ? letter.sender : letter.recipient;
  const otherName = isOwnSentLetter
    ? letter.recipientName || otherParty?.displayName || "Unknown"
    : letter.senderName || otherParty?.displayName || "Unknown";
  const ownName = isOwnSentLetter
    ? letter.senderName || ownParty?.displayName || "Unknown"
    : letter.recipientName || ownParty?.displayName || "Unknown";

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      {letter.status === "DRAFT" ? (
        <DraftLetterForm
          title="Draft"
          backPath={backPath}
          initialValues={{
            content: letter.content,
            senderName: letter.senderName,
            recipientName: letter.recipientName,
            streetName: letter.recipient?.streetName,
            houseNumber: letter.recipient?.houseNumber,
          }}
          onSave={handleSave}
          onSend={handleSend}
          onDelete={handleDelete}
        />
      ) : (
        <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 flex items-center justify-between gap-3">
            <button onClick={handleBack} className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
              Back
            </button>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Letter
            </p>
          </div>
          <div>
            <div className="mb-6 space-y-1 border-b border-zinc-200 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <p>Other: {otherName} · {formatAddress(otherParty)}</p>
              <p>You: {ownName} · {formatAddress(ownParty)}</p>
              <p>Date: {letter.sentAt ? new Date(letter.sentAt).toLocaleString() : ""}</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-950 dark:text-zinc-50">
              {letter.content}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
