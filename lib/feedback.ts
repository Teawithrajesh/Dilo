"use client";

// Feedback from people trying DILO. Phase 1 has no server, so it is kept in THIS browser
// (localStorage) and survives a refresh. The admin can read and download it.
// Phase 2: saved to the database instead.

export type FeedbackKind = "idea" | "problem" | "liked" | "other";
export type Feedback = { id: string; at: string; rating: number; kind: FeedbackKind; message: string; name?: string; contact?: string };

const KEY = "dilo-feedback";
export const kindLabel: Record<FeedbackKind, string> = { idea: "Idea / suggestion", problem: "Something didn't work", liked: "Something I liked", other: "Other" };

export function readFeedback(): Feedback[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Feedback[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveFeedback(f: Omit<Feedback, "id" | "at">): { ok: true } | { ok: false; error: string } {
  const message = f.message.trim();
  if (!message) return { ok: false, error: "Please write your feedback." };
  if (message.length > 1000) return { ok: false, error: "Please keep it under 1,000 characters." };
  const item: Feedback = {
    ...f,
    message,
    name: f.name?.trim() || undefined,
    contact: f.contact?.trim() || undefined,
    id: `f-${Date.now()}`,
    at: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([item, ...readFeedback()]));
    return { ok: true };
  } catch {
    return { ok: false, error: "This browser couldn't save it. Please try again, or tell us in person." };
  }
}

export function clearFeedback() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

/** CSV that opens in Google Sheets / Excel. */
export function feedbackCsv(list: Feedback[]) {
  const cell = (v: string | number | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [["Date", "Rating", "Type", "Feedback", "Name", "Contact"], ...list.map((f) => [f.at, f.rating || "", kindLabel[f.kind], f.message, f.name ?? "", f.contact ?? ""])];
  return "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n");
}
