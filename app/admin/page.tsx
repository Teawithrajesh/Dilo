"use client";

import { useEffect, useState } from "react";
import { clearFeedback, feedbackCsv, kindLabel, readFeedback, type Feedback } from "@/lib/feedback";
import { AppShell } from "@/components/app/AppShell";
import { SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";

export default function Admin() {
  const d = useDemo();
  const [msg, setMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  useEffect(() => setFeedback(readFeedback()), []);

  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([feedbackCsv(feedback)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "dilo-feedback.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!d.isPlatformAdmin) {
    return (
      <AppShell title="Admin">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center" data-testid="admin-only">
          <Icon name="lock" className="mx-auto h-10 w-10 text-orange" />
          <p className="mt-4 font-display text-heading font-bold">Only the DILO admin can open this</p>
        </div>
      </AppShell>
    );
  }

  const s = d.adminStats;
  const tiles = [
    { label: "People", value: s.people },
    { label: "Communities", value: s.communities },
    { label: "Celebrations", value: s.celebrations },
    { label: "Records", value: s.records },
  ];

  return (
    <AppShell title="Admin">
      <p className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-small text-white/80">
        <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
        You see totals and reports only. Private communities, photos, wishes and amounts stay private, even from DILO.
      </p>
      {msg && <p role="status" className="mt-4 rounded-2xl bg-white/[0.08] px-4 py-3 text-small">{msg}</p>}

      <SectionTitle>Totals</SectionTitle>
      <dl className="grid grid-cols-2 gap-3" data-testid="admin-stats">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <dt className="text-tiny font-semibold uppercase tracking-[0.15em] text-white/60">{t.label}</dt>
            <dd className="mt-1 font-display text-display font-extrabold">{t.value}</dd>
          </div>
        ))}
      </dl>

      <SectionTitle>{`Reports · ${s.openReports} open`}</SectionTitle>
      <ul className="space-y-2">
        {d.allReports.map((r) => (
          <li key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-testid="admin-report">
            <p className="font-semibold">{r.summary}</p>
            <p className="mt-1 text-small text-white/70">{r.communityName} · {r.reason} · {r.status === "open" ? "Waiting for the community's moderators" : r.status === "removed" ? "Removed" : "Kept up"}</p>
          </li>
        ))}
      </ul>

      <SectionTitle>{`Feedback · ${feedback.length}`}</SectionTitle>
      {feedback.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-4 text-small text-white/70">No feedback on this phone yet. People can send it from the landing page or their Profile.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {feedback.map((f) => (
              <li key={f.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-testid="admin-feedback">
                <p className="text-tiny font-semibold uppercase tracking-[0.15em] text-white/60">
                  {kindLabel[f.kind]}
                  {f.rating ? ` · ${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}` : ""}
                  {` · ${new Date(f.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{f.message}</p>
                <p className="mt-1 text-small text-white/60">{f.name ? `${f.name}${f.contact ? ` · ${f.contact}` : ""}` : "Anonymous"}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={downloadCsv} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 text-small font-semibold">
              Download (CSV)
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm("Delete all feedback on this phone? Download it first if you need it.")) { clearFeedback(); setFeedback([]); } }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffb4c4]/40 text-small font-semibold text-[#ffd0da]"
            >
              Clear all
            </button>
          </div>
        </>
      )}

      <SectionTitle>Communities</SectionTitle>
      <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
        {d.allCommunities.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-4" data-testid="admin-community">
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{c.name}</span>
              <span className="text-small text-white/60">{c.type} · {c.members} members{c.suspended ? " · Suspended" : ""}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (!c.suspended && !window.confirm(`Suspend ${c.name}? Members will see a notice until you restore it.`)) return;
                const r = d.setSuspended(c.id, !c.suspended);
                setMsg(r.ok ? `${c.name} ${c.suspended ? "restored" : "suspended"}.` : r.error);
              }}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-small font-semibold ${c.suspended ? "border border-white/25" : "border border-[#ffb4c4]/40 text-[#ffd0da]"}`}
            >
              {c.suspended ? "Restore" : "Suspend"}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-tiny text-white/60">Every admin action is logged. In the real app the database enforces these limits.</p>
    </AppShell>
  );
}
