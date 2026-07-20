export default function Drafts() {
  return (
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
  );
}
