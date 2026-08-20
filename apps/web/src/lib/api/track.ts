export type Track = {
  id: string;
  title: string;
  url: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
};

export async function getTracks(): Promise<Track[]> {
  const res = await fetch("/api/tracks");
  if (!res.ok) {
    throw new Error("Failed to load tracks");
  }

  return res.json() as Promise<Track[]>;
}
