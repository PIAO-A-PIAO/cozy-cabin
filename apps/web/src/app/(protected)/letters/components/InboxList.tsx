"use client"

import { getLetters } from "@/lib/api/letter";
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

export default function InboxList() {
  const [letters, setLetters] = useState<LetterPreview[]>([])

  useEffect(() => {
  const fetchLetters = async () => {
    try {
      const res = await getLetters("inbox") 
      setLetters(res)
    } catch (error) {
      console.error("Failed to fetch letters:", error)
    }
  }
  
  fetchLetters()
}, []) // Empty dependency array means this runs exactly once when the component mounts
  if (letters.length === 0) {
    return (
      <div className="rounded border border-zinc-200 px-4 py-12 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          No letters
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Received letters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {letters.map((letter) => (
        <Preview key={letter.id} letter={letter} />
      ))}
    </div>
  );
}
