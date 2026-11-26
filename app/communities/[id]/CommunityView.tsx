"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { EventCard, SectionTitle } from "@/components/app/ui";
import { Avatar } from "@/components/app/Avatar";
import { Icon } from "@/components/Icon";
import { communities, memberships, people } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";
import { can, roleLabel } from "@/lib/permissions";

export function CommunityView({ id }: { id: string }) {
  const { roleIn, memberCount, eventsIn, pendingRequests } = useDemo();
  const c = communities.find((x) => x.id === id)!;
  const role = roleIn(id);

  if (!can.seeCommunity(role)) {
    return (
      <AppShell title="Private">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center" data-testid="private-wall">
          <Icon name="lock" className="mx-auto h-10 w-10 text-orange" />
          <p className="mt-4 font-display text-heading font-bold">This community is private</p>
          <p className="mt-2 text-small text-white/70">Only approved members can see it.</p>
          <Link href="/home/" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-small font-semibold">Back to Home</Link>
        </div>
      </AppShell>
    );
  }

  const named = memberships.filter((m) => m.communityId === id);
  const requests = pendingRequests(id);

  return (
    <AppShell title={c.name}>
      <div className={`-mx-4 -mt-6 h-32 bg-gradient-to-br ${c.gradient} opacity-80`} aria-hidden />
      <div className="-mt-8 rounded-3xl border border-white/10 bg-navy p-5 shadow-xl">
        <p className="font-display text-title font-extrabold">{c.name}</p>
        <p className="mt-1 text-small text-white/70">{c.description}</p>
        <p className="mt-3 flex items-center gap-2 text-small text-white/60">
          <Icon name="lock" className="h-4 w-4" /> Private · {memberCount(id)} members · You: {roleLabel[role!]}
        </p>
      </div>

      {can.approveMembers(role) && (
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-orange/40 bg-orange/10 p-4" data-testid="admin-panel">
          <div>
            <p className="font-display font-bold">Join requests</p>
            <p className="text-small text-white/70">{requests === 0 ? "No one is waiting." : `${requests} waiting for approval`}</p>
          </div>
          <span className="rounded-full bg-orange px-3 py-1 font-display text-small font-bold text-navy" data-testid="request-count">{requests}</span>
        </div>
      )}

      <SectionTitle>Celebrations</SectionTitle>
      <div className="space-y-3">
        {eventsIn(id).map((e) => <EventCard key={e.id} e={e} />)}
      </div>

      <SectionTitle>Members</SectionTitle>
      <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
        {named.map((m) => {
          const p = people.find((x) => x.id === m.personId)!;
          return (
            <li key={p.id} className="flex items-center gap-3 p-4">
              <Avatar person={p} />
              <span className="flex-1 font-semibold">{p.name}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold">{roleLabel[m.role]}</span>
            </li>
          );
        })}
        <li className="p-4 text-small text-white/60">+ {memberCount(id) - named.length} more sample members</li>
      </ul>
      <p className="mt-6 text-center text-tiny text-white/60">Inviting and managing members comes in the next step.</p>
    </AppShell>
  );
}
