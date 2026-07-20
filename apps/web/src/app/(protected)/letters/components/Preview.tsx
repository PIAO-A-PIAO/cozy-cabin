type PreviewProps = {
  letter: {
    sender?: {
      id: string;
      email: string;
      displayName: string;
    };
    recipient?: {
      id: string;
      email: string;
      displayName: string;
    };
    preview: string;
  };
};

export default function Preview({ letter }: PreviewProps) {
  return (
    <div className="rounded border border-zinc-200 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
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
    </div>
  );
}
