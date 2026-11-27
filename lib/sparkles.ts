"use client";

// ✨ Daily Sparkles: come back each day, tap Collect, build a 7-day streak.
// What Sparkles can be used for is NOT decided yet (founder's choice) — the app only says
// "keep collecting". They are not money and can't be bought, sold or exchanged.
// Phase 1: kept per person in this browser (localStorage). Phase 2: in the database.

export const DAY_REWARDS = [10, 20, 30, 40, 50, 60, 100];
export const SPARKLES_CHANGED = "dilo-sparkles-changed";

export type SparkleState = { balance: number; streak: number; last: string | null; history: { day: string; amount: number; step: number }[] };

/** Local calendar day, e.g. "2026-11-27". */
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysBetween = (a: string, b: string) => Math.round((new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86_400_000);

const key = (personId: string) => `dilo-sparkles-${personId}`;
const empty: SparkleState = { balance: 0, streak: 0, last: null, history: [] };

/** Demo: Priya already has a 3-day streak, so today shows Day 4. */
function seed(personId: string): SparkleState {
  if (personId !== "priya") return empty;
  const y = new Date();
  const day = (n: number) => { const d = new Date(y); d.setDate(d.getDate() - n); return dayKey(d); };
  return { balance: 1240, streak: 3, last: day(1), history: [{ day: day(1), amount: 30, step: 3 }, { day: day(2), amount: 20, step: 2 }, { day: day(3), amount: 10, step: 1 }] };
}

export function loadSparkles(personId: string): SparkleState {
  try {
    const raw = localStorage.getItem(key(personId));
    if (raw) return JSON.parse(raw) as SparkleState;
  } catch { /* ignore */ }
  return seed(personId);
}

/** Where the streak stands today. */
export function today(s: SparkleState, now = new Date()) {
  const t = dayKey(now);
  const collectedToday = s.last === t;
  const gap = s.last ? daysBetween(s.last, t) : Infinity;
  // Missed a day (or never started): back to Day 1. After Day 7 the week starts again.
  const done = collectedToday ? s.streak : gap === 1 ? s.streak % 7 : 0;
  const step = collectedToday ? s.streak : done + 1; // 1..7: the day you're on
  const broken = !collectedToday && s.last !== null && gap > 1;
  return { collectedToday, done: collectedToday ? s.streak : done, step, reward: DAY_REWARDS[step - 1], broken };
}

export function collect(personId: string, now = new Date()): { state: SparkleState; amount: number } | null {
  const s = loadSparkles(personId);
  const t = today(s, now);
  if (t.collectedToday) return null;
  const state: SparkleState = {
    balance: s.balance + t.reward,
    streak: t.step,
    last: dayKey(now),
    history: [{ day: dayKey(now), amount: t.reward, step: t.step }, ...s.history].slice(0, 60),
  };
  try { localStorage.setItem(key(personId), JSON.stringify(state)); } catch { /* ignore */ }
  // Tell every Sparkles view on the page (header chip, Home card) to refresh.
  try { window.dispatchEvent(new Event(SPARKLES_CHANGED)); } catch { /* ignore */ }
  return { state, amount: t.reward };
}

/** Milliseconds until local midnight (the next collect). */
export function msToTomorrow(now = new Date()) {
  const m = new Date(now);
  m.setHours(24, 0, 0, 0);
  return m.getTime() - now.getTime();
}
