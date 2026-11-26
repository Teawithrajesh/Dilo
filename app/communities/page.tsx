"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { useDemo } from "@/lib/demo/store";
import { roleLabel } from "@/lib/permissions";

export default function Communities() {
  const { myCommunities, roleIn, memberCount, eventsIn } = useDemo();
  return (
    <AppShell title="Communities">
      <Link href="/communities/new/" className="mb-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-display font-bold text-navy">
        + Create community
      </Link>
      {myCommunities.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          No communities yet. Check Home for invites.
        </p>
      ) : (
        <ul className="space-y-3">
          {myCommunities.map((c) => (
            <li key={c.id}>
              <Link href={`/community/?id=${c.id}`} className="block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:bg-white/[0.07]">
                <div className={`h-24 bg-gradient-to-br ${c.gradient} opacity-80`} aria-hidden />
                <div className="p-5">
                  <p className="font-display text-heading font-bold">{c.name}</p>
                  <p className="text-small text-white/60">
                    {c.type} · {memberCount(c.id)} members · {eventsIn(c.id).length} celebrations · You: {roleLabel[roleIn(c.id)!]}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
