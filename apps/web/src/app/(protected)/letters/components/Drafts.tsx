"use client"

import { createDraft, getLetter, getLetters, sendDraft, updateDraft } from "@/lib/api/letter";
import { useEffect, useState } from "react";
import Preview from "./Preview";

type LetterPreview = {
  id: string;
  sender?: {
    id: string;
    displayName: string;
  };
  recipient?: {
    id: string;
    displayName: string;
  };
  preview: string;
};

export default function Drafts() {
  const [letters, setLetters] = useState<LetterPreview[]>([])
  const [content, setContent] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [draftId, setDraftId] = useState<string>()

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await getLetters("drafts")
        setLetters(res)
        if (res.length > 0) {
          const firstDraft = await getLetter(res[0].id)
          const {id, content, recipientId} = firstDraft
          setDraftId(id)
          setRecipientId(recipientId || "")
          setContent(content)
        }
      } catch (error) {
        console.error("Failed to fetch drafts:", error)
      }
    }

    fetchLetters()
  }, [])

  const handleSave = async () => {
    const data = {
        content,
        recipientId: recipientId || undefined
      }
    if (draftId) {
      await updateDraft(draftId, data)
    } else {
      const draft = await createDraft(data)
      setDraftId(draft.id)
    }

    const drafts = await getLetters("drafts")
    setLetters(drafts)
  }

  const handleSend = async () => {
    const data = {
        content,
        recipientId: recipientId || undefined
      }
    let id = draftId

    if (id) {
      await updateDraft(id, data)
    } else {
      const draft = await createDraft(data)
      id = draft.id
    }

    if (!id) return

    await sendDraft(id)
    setDraftId(undefined)
    setRecipientId("")
    setContent("")

    const drafts = await getLetters("drafts")
    setLetters(drafts)
  }
  return (
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
        className="min-h-48 w-full resize-none rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
      />
      <div className="flex justify-end gap-3">
        <button onClick={handleSave} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
          Save
        </button>
        <button onClick={handleSend} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
          Send
        </button>
      </div>

      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {letters.length === 0 ? (
          <div className="rounded border border-zinc-200 px-4 py-8 text-center dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              No drafts
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Saved drafts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {letters.map((letter) => (
              <Preview key={letter.id} letter={letter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
