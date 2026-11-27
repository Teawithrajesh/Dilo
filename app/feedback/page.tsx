"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Glows } from "@/components/landing/Glows";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { kindLabel, saveFeedback, type FeedbackKind } from "@/lib/feedback";
import { insertRow, remoteEnabled } from "@/lib/remote";

const kinds: FeedbackKind[] = ["idea", "problem", "liked", "other"];
const faces = ["😞", "😕", "😐", "🙂", "😍"];
const box = "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";

export default function FeedbackPage() {
  const { ready, me } = useDemo();
  const [rating, setRating] = useState(0);
  const [kind, setKind] = useState<FeedbackKind>("idea");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (ready && me) setName(me.name); }, [ready, me]);
  const sending = useRef(false); // stops a double-tap from saving twice

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending.current) return; // a second tap of the same send
    const fb = { rating, kind, message, name: anonymous ? undefined : name, contact: anonymous ? undefined : contact };
    if (!message.trim()) return setError("Please write your feedback.");
    sending.current = true;
    if (remoteEnabled()) {
      // Goes straight to the founder (insert-only table).
      const r = await insertRow("feedback", { rating, kind, message: message.trim().slice(0, 1000), name: fb.name?.trim() || null, contact: fb.contact?.trim() || null, source: "demo" });
      if (!r.ok) {
        sending.current = false;
        return setError("We couldn't send that just now. Please check your internet and try again.");
      }
    } else {
      const r = saveFeedback(fb);
      if (!r.ok) { sending.current = false; return setError(r.error); } // nothing saved: fix and send again right away
    }
    window.setTimeout(() => { sending.current = false; }, 1000);
    setError(null);
    setSent(true);
  }

  return (
    <main className="relative min-h-[calc(100dvh-2rem)] overflow-hidden bg-navy px-4 pb-16 text-white">
      <Glows variant="soft" />
      <div className="relative mx-auto max-w-lg">
        <div className="flex h-16 items-center">
          <Link href={me ? "/profile/" : "/welcome/"} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-small font-semibold">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back
          </Link>
        </div>

        <h1 className="mt-6 font-display text-title font-extrabold">Help us make DILO better</h1>
        <p className="mt-2 text-white/70">Tell us what you liked, what was confusing, or what you wish DILO could do. Every message is read by the founder.</p>

        {sent ? (
          <div role="status" className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center" data-testid="feedback-thanks">
            <p className="text-[2.2rem]" aria-hidden>🙏</p>
            <p className="mt-2 font-display text-heading font-bold">Thank you!</p>
            <p className="mt-1 text-small text-white/70">Your feedback was saved. It really helps.</p>
            <button
              type="button"
              onClick={() => { setSent(false); setMessage(""); setRating(0); setKind("idea"); }}
              className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-small font-semibold"
            >
              Send more feedback
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 space-y-6" data-testid="feedback-form">
            <fieldset>
              <legend className="text-small font-semibold">How do you feel about DILO? <span className="font-normal text-white/60">(optional)</span></legend>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {faces.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    aria-label={`${i + 1} out of 5`}
                    aria-pressed={rating === i + 1}
                    onClick={() => setRating(rating === i + 1 ? 0 : i + 1)}
                    className={`min-h-14 rounded-2xl border text-[1.6rem] transition ${rating === i + 1 ? "border-white bg-white/15" : "border-white/15 opacity-70 hover:opacity-100"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-small font-semibold">What is it about?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {kinds.map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={`min-h-12 rounded-2xl border px-3 text-small font-semibold transition ${kind === k ? "border-white bg-white text-navy" : "border-white/20"}`}
                  >
                    {kindLabel[k]}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block text-small font-semibold">
              Your feedback or suggestion
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                rows={6}
                placeholder="e.g. I'd love to add a birthday for my grandmother in Hindi…"
                className={`${box} mt-2 resize-none py-3`}
              />
              <span className="mt-1 block text-right text-tiny font-normal text-white/60">{message.length}/1000</span>
            </label>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-small">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-5 w-5 accent-[#fe8f02]" />
              Send without my name
            </label>

            {!anonymous && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-small font-semibold">
                  Name <span className="font-normal text-white/60">(optional)</span>
                  <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} className={`${box} mt-2 min-h-12`} />
                </label>
                <label className="block text-small font-semibold">
                  Phone or email <span className="font-normal text-white/60">(optional, if you'd like a reply)</span>
                  <input value={contact} maxLength={80} onChange={(e) => setContact(e.target.value)} className={`${box} mt-2 min-h-12`} />
                </label>
              </div>
            )}

            {error && <p role="alert" className="text-small text-[#ffd0da]">{error}</p>}

            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy transition active:scale-[0.98]">
              Send feedback
            </button>
            <p className="text-center text-tiny text-white/60">{remoteEnabled() ? "Your feedback goes straight to the DILO founder." : "Demo: feedback is saved on this phone only. The DILO admin can read it here."}</p>
          </form>
        )}
      </div>
    </main>
  );
}
