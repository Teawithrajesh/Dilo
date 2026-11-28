"use client";

// Optional link to the founder's Supabase (Option B). Only INSERT is allowed there (see
// supabase/migrations/0001_*.sql). The public key is safe in the browser by design; the
// database rules decide what it can do. Without these settings, the app stays fully local.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Defence in depth: never use a secret/service key from the browser, even if one is misconfigured.
const SECRET_KEY = KEY.startsWith("sb_secret_");
export const remoteEnabled = () => !!URL_ && !!KEY && !SECRET_KEY;

export async function insertRow(table: "feedback" | "early_access", row: Record<string, unknown>): Promise<{ ok: true } | { ok: false; error: string; duplicate?: boolean }> {
  if (!remoteEnabled()) return { ok: false, error: "not configured" };
  try {
    const res = await fetch(`${URL_}/rest/v1/${table}`, {
      method: "POST",
      // New publishable keys (sb_publishable_…) go in the apikey header only; old anon keys are JWTs and also go in Authorization.
      headers: { apikey: KEY, ...(KEY.startsWith("sb_") ? {} : { Authorization: `Bearer ${KEY}` }), "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
    });
    if (res.ok) return { ok: true };
    if (res.status === 409) return { ok: false, error: "duplicate", duplicate: true };
    return { ok: false, error: `server said ${res.status}` };
  } catch {
    return { ok: false, error: "offline" };
  }
}
