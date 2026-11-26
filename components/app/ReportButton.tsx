"use client";

import { useState } from "react";
import type { ReportReason, ReportTarget } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

const reasons: { id: ReportReason; label: string }[] = [
  { id: "spam", label: "Spam" },
  { id: "abuse", label: "Abuse or harassment" },
  { id: "fake", label: "Fake or wrong record" },
  { id: "privacy", label: "Shares private information" },
  { id: "other", label: "Something else" },
];

/** "Report" link that opens a small form. Goes to the community's moderators. */
export function ReportButton({ communityId, target, summary, label = "Report", className = "" }: { communityId: string; target: ReportTarget; summary: string; label?: string; className?: string }) {
  const d = useDemo();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) return <p role="status" className="text-small text-white/80">Thanks. The moderators will review it.</p>;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`inline-flex min-h-11 items-center rounded-full px-3 text-small font-semibold text-white/70 hover:text-white ${className}`}>
        {label}
      </button>
    );
  }

  return (
    <form
      noValidate
      data-testid="report-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!reason) return setError("Please choose a reason.");
        const r = d.report({ communityId, target, summary, reason, note });
        if (!r.ok) return setError(r.error);
        setDone(true);
      }}
      className="mt-2 w-full space-y-3 rounded-2xl border border-white/15 bg-navy/80 p-4 text-left backdrop-blur"
    >
      <fieldset>
        <legend className="text-small font-semibold">Why are you reporting this?</legend>
        <div className="mt-2 space-y-1">
          {reasons.map((r) => (
            <label key={r.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-small">
              <input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="h-5 w-5 accent-[#fe8f02]" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-small font-semibold">
        Anything else? <span className="font-normal text-white/60">(optional)</span>
        <input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-4 text-white focus:border-white/40 focus:outline-none" />
      </label>
      {error && <p role="alert" className="text-small text-[#ffd0da]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-4 text-small font-bold text-navy">Send report</button>
        <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 text-small font-semibold">Cancel</button>
      </div>
    </form>
  );
}
