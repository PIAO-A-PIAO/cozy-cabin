"use client"

import { AuthContext } from "@/app/AuthProvider";
import { AVAILABLE_STREETS } from "@/config/streets";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export type DraftLetterPayload = {
  content: string;
  senderName?: string;
  recipientName?: string;
  streetName?: string;
  houseNumber?: number;
};

type DraftLetterFormValues = {
  content?: string;
  senderName?: string;
  recipientName?: string;
  streetName?: string;
  houseNumber?: number;
};

type DraftLetterFormResult = {
  ok: boolean;
  message?: string;
};

type DraftLetterFormProps = {
  title: string;
  backPath: string;
  initialValues?: DraftLetterFormValues;
  onSave: (payload: DraftLetterPayload) => Promise<DraftLetterFormResult>;
  onSend: (payload: DraftLetterPayload) => Promise<DraftLetterFormResult>;
  onDelete?: () => Promise<void>;
};

export default function DraftLetterForm({
  title,
  backPath,
  initialValues,
  onSave,
  onSend,
  onDelete,
}: DraftLetterFormProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [senderName, setSenderName] = useState(
    initialValues?.senderName ?? user.displayName ?? "",
  );
  const [recipientName, setRecipientName] = useState(
    initialValues?.recipientName ?? "",
  );
  const [streetName, setStreetName] = useState(initialValues?.streetName ?? "");
  const [houseNumber, setHouseNumber] = useState(
    initialValues?.houseNumber ? String(initialValues.houseNumber) : "",
  );
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialValues?.senderName) {
      setSenderName(user.displayName || "");
    }
  }, [initialValues?.senderName, user.displayName]);

  const markDirty = () => setDirty(true);

  const buildPayload = (): DraftLetterPayload => {
    const trimmedRecipientName = recipientName.trim();
    const trimmedSenderName = senderName.trim();
    const trimmedHouseNumber = houseNumber.trim();
    const parsedHouseNumber = trimmedHouseNumber
      ? Number(trimmedHouseNumber)
      : undefined;

    return {
      content,
      ...(trimmedSenderName ? { senderName: trimmedSenderName } : {}),
      ...(trimmedRecipientName || streetName || trimmedHouseNumber
        ? {
            recipientName: trimmedRecipientName,
            streetName,
            houseNumber: parsedHouseNumber,
          }
        : {}),
    };
  };

  const saveDraft = async () => {
    setError("");
    const result = await onSave(buildPayload());

    if (!result.ok) {
      setError(result.message || "Could not save draft");
      return false;
    }

    setDirty(false);
    return true;
  };

  const handleSave = async () => {
    await saveDraft();
  };

  const handleSend = async () => {
    setError("");
    const result = await onSend(buildPayload());

    if (!result.ok) {
      setError(result.message || "Could not send letter");
    }
  };

  const handleBack = async () => {
    if (dirty) {
      const shouldSave = window.confirm("Save this draft before leaving?");

      if (shouldSave) {
        const saved = await saveDraft();

        if (!saved) {
          return;
        }
      }
    }

    router.push(backPath);
  };

  return (
    <section className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={handleBack} className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
          Back
        </button>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Recipient name"
          value={recipientName}
          onChange={(event) => {
            setRecipientName(event.target.value);
            markDirty();
          }}
          className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
        />
        <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
          <select
            value={streetName}
            onChange={(event) => {
              setStreetName(event.target.value);
              markDirty();
            }}
            className={`w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600 ${
              streetName
                ? "text-zinc-950 dark:text-zinc-50"
                : "text-zinc-400"
            }`}
          >
            <option value="" disabled>
              Street name
            </option>
            {AVAILABLE_STREETS.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="999"
            placeholder="House number"
            value={houseNumber}
            onChange={(event) => {
              setHouseNumber(event.target.value);
              markDirty();
            }}
            className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
        </div>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            markDirty();
          }}
          placeholder="Write a letter"
          className="min-h-72 w-full resize-none rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm leading-6 text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
        />
        <div className="grid gap-4 border-t border-zinc-200 pt-4 sm:grid-cols-[1fr_12rem] dark:border-zinc-800">
          <p className="self-center text-sm text-zinc-500 dark:text-zinc-400">
            From: {user.streetName && user.houseNumber ? `${user.houseNumber} ${user.streetName}` : "Address unavailable"}
          </p>
          <input
            type="text"
            placeholder="Sender name"
            value={senderName}
            onChange={(event) => {
              setSenderName(event.target.value);
              markDirty();
            }}
            className="w-full rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <div className="flex justify-end gap-3">
          {onDelete ? (
            <button onClick={onDelete} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
              Delete
            </button>
          ) : null}
          <button onClick={handleSave} className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
            Save
          </button>
          <button onClick={handleSend} className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
