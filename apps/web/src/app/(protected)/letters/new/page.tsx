"use client"

import DraftLetterForm, { DraftLetterPayload } from "@/app/(protected)/letters/components/DraftLetterForm";
import { createDraft, sendDraft } from "@/lib/api/letter";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const from = fromParam === "sent" || fromParam === "drafts" ? fromParam : "inbox";

  const saveDraft = async (payload: DraftLetterPayload) => {
    const draft = await createDraft(payload);

    if (!draft.id) {
      return { ok: false, message: draft.message || "Could not save draft" };
    }

    router.replace(`/letters/${draft.id}?from=drafts`);
    return { ok: true };
  };

  const sendLetter = async (payload: DraftLetterPayload) => {
    const draft = await createDraft(payload);

    if (!draft.id) {
      return { ok: false, message: draft.message || "Could not create draft" };
    }

    const sentLetter = await sendDraft(draft.id);

    if (!sentLetter.id) {
      return { ok: false, message: sentLetter.message || "Could not send letter" };
    }

    router.push("/letters?tab=sent");
    return { ok: true };
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] justify-center bg-zinc-50 px-4 py-8 dark:bg-zinc-900">
      <DraftLetterForm
        title="New Letter"
        backPath={`/letters?tab=${from}`}
        onSave={saveDraft}
        onSend={sendLetter}
      />
    </main>
  );
}
