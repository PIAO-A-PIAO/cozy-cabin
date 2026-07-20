import Link from "next/link";

type PreviewProps = {
  letter: {
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
};

export default function Preview({ letter }: PreviewProps) {
  return (
    <Link href={`/letters/${letter.id}`} className="block rounded border border-zinc-200 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
      <div className="mb-2 grid gap-2 text-xs text-zinc-500 dark:text-zinc-400 sm:grid-cols-2">
        <p className="truncate">
          From: {letter.sender?.displayName || letter.sender?.id || "Unknown"}
        </p>
        <p className="truncate sm:text-right">
          To: {letter.recipient?.displayName || letter.recipient?.id || "Unknown"}
        </p>
      </div>
      <p className="truncate text-sm text-zinc-950 dark:text-zinc-50">
        {letter.preview}
      </p>
    </Link>
  );
}
