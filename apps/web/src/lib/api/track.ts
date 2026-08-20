export async function getTracks() {
  const res = await fetch("/api/tracks");
  if (!res.ok) {
    throw new Error("Failed to load tracks");
  }

  return res.json();
}
