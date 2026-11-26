"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SectionTitle } from "@/components/app/ui";
import { useDemo } from "@/lib/demo/store";

const reasonLabel = { spam: "Spam", abuse: "Abuse or harassment", fake: "Fake or wrong record", privacy: "Shares private information", other: "Something else" } as const;

export default function Moderation() {
  const d = useDemo();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  return (
    <AppShell title="Moderation">
      <p className="text-small text-white/70">Reports from your communities. Act kindly and fairly; the person who reported is told the outcome.</p>
      {msg && <p role={msg.kind === "error" ? "alert" : "status"} className="mt-4 rounded-2xl bg-white/[0.08] px-4 py-3 text-small">{msg.text}</p>}
      {d.moderatedCommunities.length === 0 && <p className="mt-6 text-small text-white/70">You don&apos;t moderate any community.</p>}
      {d.moderatedCommunities.map((c) => {
        const list = d.reportsFor(c.id);
        const open = list.filter((r) => r.status === "open");
        const closed = list.filter((r) => r.status !== "open");
        return (
          <section key={c.id}>
            <SectionTitle>{`${c.name} · ${open.length} open`}</SectionTitle>
            {open.length === 0 && <p className="rounded-3xl border border-dashed border-white/15 p-4 text-small text-white/70">No open reports.</p>}
            <ul className="space-y-3">
              {open.map((r) => (
                <li key={r.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" data-testid="report">
                  <p className="font-semibold">{r.summary}</p>
                  <p className="mt-1 text-small text-white/70">
                    {reasonLabel[r.reason]} · reported by {d.person(r.reporterId).short} · {r.when}
                  </p>
                  {r.note && <p className="mt-2 text-small italic text-white/80">&ldquo;{r.note}&rdquo;</p>}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { const x = d.moderate(r.id, "dismiss"); setMsg(x.ok ? { kind: "ok", text: "Report dismissed." } : { kind: "error", text: x.error }); }} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 text-small font-semibold">
                      Keep it up
                    </button>
                    <button type="button" onClick={() => { const x = d.moderate(r.id, "remove"); setMsg(x.ok ? { kind: "ok", text: "Removed. The reporter was told." } : { kind: "error", text: x.error }); }} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffd0da] text-small font-bold text-navy">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {closed.length > 0 && (
              <ul className="mt-3 space-y-2">
                {closed.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3 text-small text-white/60" data-testid="report-closed">
                    <span className="min-w-0 truncate">{r.summary}</span>
                    <span className="shrink-0 pl-3">{r.status === "removed" ? "Removed" : "Kept up"}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </AppShell>
  );
}
