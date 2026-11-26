"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { EventCard, SectionTitle } from "@/components/app/ui";
import { Avatar } from "@/components/app/Avatar";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { can, roleLabel } from "@/lib/permissions";

export function PrivateWall({ title = "This community is private" }: { title?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center" data-testid="private-wall">
      <Icon name="lock" className="mx-auto h-10 w-10 text-orange" />
      <p className="mt-4 font-display text-heading font-bold">{title}</p>
      <p className="mt-2 text-small text-white/70">Only approved members can see it.</p>
      <Link href="/home/" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-small font-semibold">Back to Home</Link>
    </div>
  );
}

export function CommunityView({ id }: { id: string }) {
  const { community, roleIn, memberCount, eventsIn, requestsFor, members } = useDemo();
  const c = community(id);
  const role = roleIn(id);

  if (!c || !can.seeCommunity(role)) {
    return (
      <AppShell title="Private">
        <PrivateWall />
      </AppShell>
    );
  }

  const waiting = requestsFor(id).length;
  const events = eventsIn(id);
  const named = members(id);

  return (
    <AppShell title={c.name}>
      <div className={`-mx-4 -mt-6 h-32 bg-gradient-to-br ${c.gradient} opacity-80`} aria-hidden />
      <div className="-mt-8 rounded-3xl border border-white/10 bg-navy p-5 shadow-xl">
        <p className="font-display text-title font-extrabold">{c.name}</p>
        {c.description && <p className="mt-1 text-small text-white/70">{c.description}</p>}
        <p className="mt-3 flex items-center gap-2 text-small text-white/60">
          <Icon name="lock" className="h-4 w-4" /> Private · {c.type} · {memberCount(id)} members · You: {roleLabel[role!]}
        </p>
        {can.invite(role) && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href={`/community/invite/?id=${id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange font-display text-small font-bold text-navy">
              <Icon name="share" className="h-4 w-4" /> Invite
            </Link>
            <Link href={`/community/members/?id=${id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 font-display text-small font-semibold">
              <Icon name="users" className="h-4 w-4" /> Manage
            </Link>
          </div>
        )}
      </div>

      {can.approveMembers(role) && (
        <Link
          href={`/community/members/?id=${id}`}
          className="mt-4 flex items-center justify-between rounded-3xl border border-orange/40 bg-orange/10 p-4 transition hover:bg-orange/15"
          data-testid="admin-panel"
        >
          <span>
            <span className="block font-display font-bold">Join requests</span>
            <span className="text-small text-white/70">{waiting === 0 ? "No one is waiting." : `${waiting} waiting for approval`}</span>
          </span>
          <span className="rounded-full bg-orange px-3 py-1 font-display text-small font-bold text-navy" data-testid="request-count">{waiting}</span>
        </Link>
      )}

      <SectionTitle>Celebrations</SectionTitle>
      {events.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          No celebrations yet. Creating events comes in the next step.
        </p>
      ) : (
        <div className="space-y-3">{events.map((e) => <EventCard key={e.id} e={e} />)}</div>
      )}

      <SectionTitle aside={<Link href={`/community/members/?id=${id}`} className="inline-flex min-h-11 items-center text-small font-semibold text-orange">See all</Link>}>
        Members
      </SectionTitle>
      <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
        {named.slice(0, 4).map((m) => (
          <li key={m.personId} className="flex items-center gap-3 p-4">
            <Avatar person={m.person} />
            <span className="flex-1 font-semibold">{m.person.name}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold">{roleLabel[m.role]}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
