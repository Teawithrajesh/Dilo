// Remembers which guided tours each demo person has finished, so a tour only starts once on its own.
// Stored on this device only (localStorage key "dilo-tours": { personId: ["home", "event"] }).
export type TourId = "home" | "event";
const KEY = "dilo-tours";

function read(): Record<string, string[]> {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: Record<string, string[]> = {};
    for (const [k, list] of Object.entries(v)) if (Array.isArray(list)) out[k] = list.filter((x) => typeof x === "string");
    return out;
  } catch {
    return {};
  }
}

export function tourSeen(personId: string, tour: TourId) {
  return read()[personId]?.includes(tour) ?? false;
}
export function markTourSeen(personId: string, tour: TourId) {
  const all = read();
  all[personId] = Array.from(new Set([...(all[personId] ?? []), tour]));
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
}
/** "Take the tour again" from Profile: forget this person's tours. */
export function resetTours(personId: string) {
  const all = read();
  delete all[personId];
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
}
