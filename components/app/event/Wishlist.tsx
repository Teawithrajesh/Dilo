"use client";

import { useState } from "react";
import type { Celebration } from "@/lib/celebrations";
import type { Priority, Wish } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { Icon } from "@/components/Icon";
import { Panel } from "@/components/celebrate/Theme";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const priorities: Priority[] = ["high", "medium", "low"];
const prLabel: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
const digits = (v: string) => Number(v.replace(/[^0-9]/g, "").slice(0, 8)) || 0;
const box = "w-full rounded-2xl border border-white/15 bg-black/20 px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";
const chip = "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-small font-semibold transition active:scale-[0.98]";

function WishForm({ initial, onSave, onCancel, submitLabel }: { initial?: Wish; onSave: (w: { title: string; cost: number; priority: Priority; link?: string }) => { ok: boolean; error?: string }; onCancel?: () => void; submitLabel: string }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [cost, setCost] = useState(initial ? initial.cost.toLocaleString("en-IN") : "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [link, setLink] = useState(initial?.link ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = onSave({ title, cost: digits(cost), priority, link });
        if (!r.ok) setError(r.error ?? "Something went wrong.");
        else if (!initial) { setTitle(""); setCost(""); setLink(""); setPriority("medium"); setError(null); }
      }}
      className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      data-testid="wish-form"
    >
      <label className="block text-small font-semibold">
        Wish
        <input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding photography" className={`${box} mt-1 min-h-12`} />
      </label>
      <label className="block text-small font-semibold">
        Estimated cost (₹)
        <input inputMode="numeric" value={cost} onChange={(e) => { const n = digits(e.target.value); setCost(n ? n.toLocaleString("en-IN") : ""); }} placeholder="25,000" className={`${box} mt-1 min-h-12`} />
      </label>
      <fieldset>
        <legend className="text-small font-semibold">Priority</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {priorities.map((p) => (
            <button key={p} type="button" aria-pressed={p === priority} onClick={() => setPriority(p)} className={`${chip} border ${p === priority ? "border-white bg-white text-navy" : "border-white/20"}`}>
              {prLabel[p]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block text-small font-semibold">
        Link <span className="font-normal text-white/60">(optional, where to buy)</span>
        <input value={link} maxLength={200} onChange={(e) => setLink(e.target.value)} placeholder="https://" className={`${box} mt-1 min-h-12`} />
      </label>
      {error && <p role="alert" className="text-small text-[#ffd0da]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className={`${chip} flex-1 bg-white font-bold text-navy`}>{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className={`${chip} border border-white/20`}>Cancel</button>}
      </div>
    </form>
  );
}

export function Wishlist({ eventId, c }: { eventId: string; c: Celebration }) {
  const d = useDemo();
  const list = d.wishesFor(eventId);
  const org = d.isOrganiser(eventId);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const total = list.reduce((t, w) => t + w.cost, 0);
  const covered = list.filter((w) => w.fulfilled).length;

  return (
    <Panel gold={c.gold}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>Wishlist</h2>
          <p className="mt-1 text-small text-white/70">{covered} of {list.length} covered · {inr(total)} in total</p>
        </div>
      </div>

      {list.length === 0 && <p className="mt-4 text-small text-white/70">No wishes yet.</p>}
      <ol className="mt-4 space-y-3">
        {list.map((w, i) => (
          <li key={w.id} className="rounded-2xl border border-white/10 bg-black/15 p-4" data-testid="wish">
            {editing === w.id ? (
              <WishForm initial={w} submitLabel="Save" onCancel={() => setEditing(null)} onSave={(v) => { const r = d.updateWish(w.id, v); if (r.ok) setEditing(null); return r.ok ? { ok: true } : { ok: false, error: r.error }; }} />
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${w.fulfilled ? "border-transparent bg-trust text-white" : "border-white/30"}`} aria-hidden>
                    {w.fulfilled && <Icon name="check" className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-display font-bold ${w.fulfilled ? "text-white/70 line-through decoration-white/40" : ""}`} data-testid="wish-title">{w.title}</p>
                    <p className="mt-0.5 text-small text-white/70">
                      {inr(w.cost)} · <span data-testid="wish-priority">{prLabel[w.priority]}</span> priority
                      {w.fulfilled && <span className="ml-1 font-semibold text-[#7fe0b5]"> · Covered</span>}
                    </p>
                    {w.link && (
                      <a href={w.link} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-flex min-h-11 items-center text-small font-semibold underline underline-offset-4">
                        Where to buy
                      </a>
                    )}
                  </div>
                </div>
                {org && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => d.toggleFulfilled(w.id)} className={`${chip} border border-white/20`}>
                      {w.fulfilled ? "Mark not covered" : "Mark covered"}
                    </button>
                    <button type="button" onClick={() => setEditing(w.id)} className={`${chip} border border-white/20`}>Edit</button>
                    <button type="button" aria-label={`Move ${w.title} up`} disabled={i === 0} onClick={() => d.moveWish(w.id, -1)} className={`${chip} border border-white/20 px-3 disabled:opacity-30`}>↑</button>
                    <button type="button" aria-label={`Move ${w.title} down`} disabled={i === list.length - 1} onClick={() => d.moveWish(w.id, 1)} className={`${chip} border border-white/20 px-3 disabled:opacity-30`}>↓</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ol>

      {org && (
        <div className="mt-4">
          {adding ? (
            <WishForm submitLabel="Add wish" onCancel={() => setAdding(false)} onSave={(v) => d.addWish(eventId, v)} />
          ) : (
            <button type="button" onClick={() => setAdding(true)} className={`${chip} w-full border border-dashed border-white/30`}>+ Add a wish</button>
          )}
        </div>
      )}
    </Panel>
  );
}
