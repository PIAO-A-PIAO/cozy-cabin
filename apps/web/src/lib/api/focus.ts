export type FocusSession = {
  id: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export async function getFocusSessions() {
  const res = await fetch("/api/focus-sessions");

  if (!res.ok) {
    throw new Error("Failed to load focus sessions");
  }

  return (await res.json()) as FocusSession[];
}

export async function createFocusSession(
  plannedDurationMinutes: number,
  actualDurationMinutes: number,
) {
  const res = await fetch("/api/focus-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plannedDurationMinutes,
      actualDurationMinutes,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create focus session");
  }

  return (await res.json()) as FocusSession;
}
