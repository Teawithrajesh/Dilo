"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Glows } from "@/components/landing/Glows";
import { Icon } from "@/components/Icon";
import { insertRow, remoteEnabled } from "@/lib/remote";
import { PRIVACY_VERSION } from "@/lib/site";

const box = "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"form" | "sending" | "done" | "already">("form");
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const mail = email.trim();
    if (!EMAIL.test(mail) || mail.length > 254) return setError("Please enter a valid email address.");
    if (!consent) return setError("Please tick the box to agree, so we can email you.");
    setError(null);
    busy.current = true;
    setState("sending");
    const row = { email: mail, name: name.trim() || null, city: city.trim() || null, consent: true, consent_text_version: PRIVACY_VERSION };
    if (remoteEnabled()) {
      const r = await insertRow("early_access", row);
      busy.current = false;
      if (r.ok) return setState("done");
      if (r.duplicate) return setState("already");
      setState("form");
      return setError("We couldn't save that just now. Please check your internet and try again.");
    }
    // Demo without a database: keep it on this phone.
    try {
      const list = JSON.parse(localStorage.getItem("dilo-early-access") || "[]");
      const all = Array.isArray(list) ? list : [];
      if (all.some((x: { email?: string }) => x?.email?.toLowerCase() === mail.toLowerCase())) { busy.current = false; return setState("already"); }
      localStorage.setItem("dilo-early-access", JSON.stringify([{ ...row, at: new Date().toISOString() }, ...all]));
    } catch { /* ignore */ }
    busy.current = false;
    setState("done");
  }

  return (
    <main className="relative min-h-[calc(100dvh-2rem)] overflow-hidden bg-navy px-4 pb-16 text-white">
      <Glows />
      <div className="relative mx-auto max-w-md pt-10">
        <Link href="/welcome/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-small font-semibold">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="mx-auto mt-6 h-auto w-20" />

        {state === "done" || state === "already" ? (
          <div role="status" className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center" data-testid="early-access-done">
            <p className="text-[2.2rem]" aria-hidden>{state === "done" ? "🎉" : "🙂"}</p>
            <p className="mt-2 font-display text-heading font-bold">{state === "done" ? "You're on the list!" : "You're already on the list"}</p>
            <p className="mt-2 text-small text-white/70">We&apos;ll email you as soon as DILO opens for families. Until then, try the demo and tell us what you think.</p>
            <div className="mt-6 grid gap-2">
              <Link href="/signin/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange font-display font-bold text-navy">Try the demo</Link>
              <Link href="/feedback/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 font-semibold">Send feedback</Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-center font-display text-title font-extrabold">Get early access</h1>
            <p className="mt-2 text-balance text-center text-white/70">DILO isn&apos;t open yet. Leave your email and you&apos;ll be among the first families invited to create a real account.</p>
            <form onSubmit={submit} noValidate className="mt-8 space-y-5" data-testid="early-access-form">
              <label className="block text-small font-semibold">
                Email
                <input type="email" inputMode="email" autoComplete="email" value={email} maxLength={254} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${box} mt-2 min-h-12`} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-small font-semibold">
                  Name <span className="font-normal text-white/60">(optional)</span>
                  <input autoComplete="name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} className={`${box} mt-2 min-h-12`} />
                </label>
                <label className="block text-small font-semibold">
                  City <span className="font-normal text-white/60">(optional)</span>
                  <input autoComplete="address-level2" value={city} maxLength={60} onChange={(e) => setCity(e.target.value)} className={`${box} mt-2 min-h-12`} />
                </label>
              </div>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-small">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#fe8f02]" />
                <span>
                  I&apos;m 18 or older and I agree that DILO can keep my email (and name/city if given) to tell me when DILO opens. I can ask for it to be deleted any time.{" "}
                  <Link href="/privacy/" className="font-semibold underline underline-offset-4">Privacy notice</Link>
                </span>
              </label>
              {error && <p role="alert" className="text-small text-[#ffd0da]">{error}</p>}
              <button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy transition active:scale-[0.98] disabled:opacity-60">
                {state === "sending" ? "Saving…" : "Join the early-access list"}
              </button>
              <p className="text-center text-tiny text-white/60">No spam. One email when DILO opens.</p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
