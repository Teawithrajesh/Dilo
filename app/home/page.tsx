"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { EventCard, SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { roleLabel } from "@/lib/permissions";

export default function Home() {
  const { me, myCommunities, myUpcoming, myInvites, roleIn, memberCount, requestToJoin } = useDemo();
  return (
    <AppShell title="Home">
      <p className="text-white/70">Namaste,</p>
      <p className="font-display text-title font-extrabold">{me?.short} 👋</p>

      {myInvites.length > 0 && (
        <>
          <SectionTitle>Pending invites</SectionTitle>
          {myInvites.map(({ community, from, requested }) => (
            <div key={community.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]" data-testid="invite-card">
              <div className={`h-20 bg-gradient-to-br ${community.gradient} opacity-80`} />
              <div className="p-5">
                <p className="text-small text-white/70">{from.name} invited you to</p>
                <p className="font-display text-heading font-bold">{community.name}</p>
                <p className="mt-1 flex items-center gap-1 text-tiny text-white/60">
                  <Icon name="lock" className="h-4 w-4" /> Private. You&apos;ll see more after an admin approves you.
                </p>
                {requested ? (
                  <p role="status" className="mt-4 rounded-2xl bg-white/[0.06] px-4 py-3 text-small">Request sent. Waiting for approval.</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestToJoin(community.id)}
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy"
                  >
                    Request to join
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      <SectionTitle>My communities</SectionTitle>
      {myCommunities.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          You&apos;re not in any community yet.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {myCommunities.map((c) => (
            <li key={c.id}>
              <Link href={`/communities/${c.id}/`} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
                <span className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${c.gradient}`} aria-hidden />
                <span className="min-w-0">
                  <span className="block font-display font-bold">{c.name}</span>
                  <span className="text-small text-white/60">{memberCount(c.id)} members · {roleLabel[roleIn(c.id)!]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <SectionTitle>Upcoming celebrations</SectionTitle>
      {myUpcoming.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          Celebrations appear here once you join a community.
        </p>
      ) : (
        <div className="space-y-3">
          {myUpcoming.map((e) => (
            <EventCard key={e.id} e={e} community={myCommunities.find((c) => c.id === e.communityId)?.name} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
