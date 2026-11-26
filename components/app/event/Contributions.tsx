"use client";

import { useState } from "react";
import type { Celebration } from "@/lib/celebrations";
import { useDemo } from "@/lib/demo/store";
import { Panel } from "@/components/celebrate/Theme";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const chip = "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-small font-semibold transition active:scale-[0.98]";
const box = "w-full rounded-2xl border border-white/15 bg-black/20 px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";

/** Honest labels: every record is self-reported until the organiser confirms it. */
function TrustLabel({ status }: { status: "self_reported" | "confirmed" }) {
  return status === "confirmed" ? (
    <span className="rounded-full bg-[#7fe0b5]/15 px-2 py-0.5 text-tiny font-semibold text-[#9ff0c9]" data-testid="trust-label">Confirmed by organiser</span>
  ) : (
    <span className="rounded-full bg-[#f6c26b]/15 px-2 py-0.5 text-tiny font-semibold text-[#f8d58f]" data-testid="trust-label">Self-reported</span>
  );
}

export function Contributions({ eventId, c }: { eventId: string; c: Celebration }) {
  const d = useDemo();
  const list = d.contributionsFor(eventId);
  const org = d.isOrganiser(eventId);
  const wishes = d.wishesFor(eventId).filter((w) => !w.fulfilled);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [wishId, setWishId] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/[^0-9]/g, "")) || 0;
    const r = d.recordContribution(eventId, { amount: n, wishId, message, anonymous });
    if (!r.ok) return setMsg({ kind: "error", text: r.error });
    setMsg({ kind: "ok", text: "Recorded. It shows as Self-reported until the organiser confirms it." });
    setAmount(""); setWishId(""); setMessage(""); setAnonymous(false); setOpen(false);
  }

  return (
    <Panel gold={c.gold}>
      <h2 className="text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>Contributions</h2>
      <p className="mt-1 text-small text-white/70">
        People give the way they always do (cash, UPI, bank) and record it here. DILO never handles money.
      </p>

      {msg && (
        <p role={msg.kind === "error" ? "alert" : "status"} className={`mt-4 rounded-2xl px-4 py-3 text-small ${msg.kind === "error" ? "bg-[#ffb4c4]/15 text-[#ffd0da]" : "bg-white/[0.08]"}`}>
          {msg.text}
        </p>
      )}

      {open ? (
        <form onSubmit={submit} noValidate className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4" data-testid="contribution-form">
          <label className="block text-small font-semibold">
            Amount you gave (₹)
            <input
              inputMode="numeric"
              value={amount}
              onChange={(e) => { const n = Number(e.target.value.replace(/[^0-9]/g, "").slice(0, 8)) || 0; setAmount(n ? n.toLocaleString("en-IN") : ""); }}
              placeholder="5,000"
              className={`${box} mt-1 min-h-12 font-serif text-[1.4rem]`}
            />
          </label>
          {wishes.length > 0 && (
            <label className="block text-small font-semibold">
              For a wish <span className="font-normal text-white/60">(optional)</span>
              <select value={wishId} onChange={(e) => setWishId(e.target.value)} className={`${box} mt-1 min-h-12 [color-scheme:dark]`}>
                <option value="">Any — for the celebration</option>
                {wishes.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
              </select>
            </label>
          )}
          <label className="block text-small font-semibold">
            Message <span className="font-normal text-white/60">(optional)</span>
            <input value={message} maxLength={120} onChange={(e) => setMessage(e.target.value)} placeholder="Blessings!" className={`${box} mt-1 min-h-12`} />
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-small">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-5 w-5 accent-[#fe8f02]" />
            <span>
              Show as <b>Anonymous</b> to others
              <span className="block text-tiny text-white/60">Only the organiser will see your name, to say thank you.</span>
            </span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className={`${chip} flex-1 bg-white font-bold text-navy`}>Record contribution</button>
            <button type="button" onClick={() => setOpen(false)} className={`${chip} border border-white/20`}>Cancel</button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => { setOpen(true); setMsg(null); }} className={`${chip} mt-4 w-full bg-white font-bold text-navy`}>
          Record a contribution
        </button>
      )}

      <ul className="mt-5 divide-y divide-white/10">
        {list.map((x) => (
          <li key={x.id} className="py-4" data-testid="contribution">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold" data-testid="contributor">
                  {x.shownName}
                  {x.anonymous && x.shownName !== "Anonymous" && <span className="text-tiny font-normal text-white/60"> (anonymous to others)</span>}
                  {x.isMine && <span className="text-tiny font-normal text-white/60"> · you</span>}
                </p>
                <p className="mt-0.5 text-tiny text-white/60">{x.when}</p>
                {x.message && <p className="mt-1 font-serif text-[1.1rem] italic text-white/85">&ldquo;{x.message}&rdquo;</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-serif text-[1.35rem] font-semibold">{inr(x.amount)}</p>
                <TrustLabel status={x.status} />
              </div>
            </div>
            {(org && x.status === "self_reported") || (x.isMine && x.status === "self_reported") ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {org && x.status === "self_reported" && (
                  <button type="button" onClick={() => { const r = d.confirmContribution(x.id); if (!r.ok) setMsg({ kind: "error", text: r.error }); }} className={`${chip} border border-[#7fe0b5]/50 text-[#9ff0c9]`}>
                    Confirm
                  </button>
                )}
                {x.isMine && x.status === "self_reported" && (
                  <button type="button" onClick={() => { const r = d.removeContribution(x.id); if (!r.ok) setMsg({ kind: "error", text: r.error }); }} className={`${chip} border border-white/20 text-white/80`}>
                    Remove my record
                  </button>
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
