"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Avatar } from "@/components/app/Avatar";
import { SectionTitle } from "@/components/app/ui";
import { useDemo } from "@/lib/demo/store";

export default function PrivacySettings() {
  const d = useDemo();
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  function download() {
    const blob = new Blob([JSON.stringify(d.exportMyData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dilo-my-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ kind: "ok", text: "Your data file was downloaded." });
  }

  function remove() {
    if (!window.confirm("Delete your DILO account? You'll leave all your communities. This can't be undone.")) return;
    const r = d.deleteAccount();
    if (!r.ok) return setMsg({ kind: "error", text: r.error });
    router.push("/welcome/?deleted=1"); // sign-out happens on arrival there
  }

  return (
    <AppShell title="Privacy">
      {msg && <p role={msg.kind === "error" ? "alert" : "status"} className={`mb-4 rounded-2xl px-4 py-3 text-small ${msg.kind === "error" ? "bg-[#ffb4c4]/15 text-[#ffd0da]" : "bg-white/[0.08]"}`}>{msg.text}</p>}

      <SectionTitle>Contributions</SectionTitle>
      <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <span>
          <span className="block font-semibold">Anonymous by default</span>
          <span className="text-small text-white/70">New records start as Anonymous. Only the organiser sees your name.</span>
        </span>
        <input type="checkbox" role="switch" checked={d.anonymousByDefault} onChange={(e) => d.setAnonymousByDefault(e.target.checked)} className="h-6 w-6 shrink-0 accent-[#fe8f02]" />
      </label>

      <SectionTitle>Blocked people</SectionTitle>
      {d.blocked.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-4 text-small text-white/70">You haven&apos;t blocked anyone. Block someone from a community&apos;s member list.</p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
          {d.blocked.map((id) => {
            const p = d.person(id);
            return (
              <li key={id} className="flex items-center gap-3 p-4" data-testid="blocked">
                <Avatar person={p} />
                <span className="flex-1 font-semibold">{p.name}</span>
                <button type="button" onClick={() => d.unblock(id)} className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-small font-semibold">Unblock</button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-2 text-tiny text-white/60">Blocked people's messages are hidden from you. They aren't told.</p>

      <SectionTitle>Your data</SectionTitle>
      <div className="space-y-2">
        <button type="button" onClick={download} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 font-semibold">
          Download my data
        </button>
        <button type="button" onClick={remove} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#ffb4c4]/40 font-semibold text-[#ffd0da]">
          Delete my account
        </button>
      </div>
      <p className="mt-3 text-tiny text-white/60">
        Under India&apos;s Digital Personal Data Protection Act you can see, download and delete your data. In this demo, nothing leaves your phone.
      </p>
    </AppShell>
  );
}
