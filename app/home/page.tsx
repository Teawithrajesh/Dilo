"use client";

import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { DreamsSpotlight } from "@/components/app/DreamsSpotlight";
import { Tour } from "@/components/app/Tour";
import { homeTour } from "@/components/app/tours";
import { SparklesCard } from "@/components/app/SparklesCard";
import { CommunityPhoto, Cover } from "@/components/app/CommunityArt";
import { EventCard, SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { roleLabel } from "@/lib/permissions";

export default function Home() {
  const { me, myCommunities, myUpcoming, myInvites, roleIn, memberCount, requestToJoin, isPlatformAdmin: d_isAdmin } = useDemo();
  return (
    <AppShell title="Home">
      <p className="text-white/70">Namaste,</p>
      <p className="font-display text-title font-extrabold">{me?.short} 👋</p>

      {!d_isAdmin && <SparklesCard />}

      <DreamsSpotlight />

      {d_isAdmin && (
        <Link href="/admin/" className="mt-6 flex items-center justify-between rounded-3xl border border-gold/40 bg-gold/10 p-5" data-testid="admin-card">
          <span>
            <span className="block font-display font-bold">Admin dashboard</span>
            <span className="text-small text-white/70">Totals, reports and suspensions</span>
          </span>
          <span aria-hidden className="font-display text-title">→</span>
        </Link>
      )}

      {myInvites.length > 0 && (
        <>
          <SectionTitle>Pending invites</SectionTitle>
          {myInvites.map(({ community, from, requested }) => (
            <div key={community.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]" data-testid="invite-card">
              <Cover c={community} className="h-20" />
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
        <p data-tour="communities" className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          You&apos;re not in any community yet.
        </p>
      ) : (
        <ul data-tour="communities" className="grid gap-3 sm:grid-cols-2">
          {myCommunities.map((c) => (
            <li key={c.id}>
              <Link href={`/community/?id=${c.id}`} data-testid="community-link" className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
                <CommunityPhoto c={c} />
                <span className="min-w-0">
                  <span className="block font-display font-bold">{c.name}</span>
                  <span className="text-small text-white/60">{memberCount(c.id)} members · {roleLabel[roleIn(c.id)!]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Everyone can start their own community — e.g. an uncle invited to one family can create one for his wife's side. */}
      <Link
        href="/communities/new/"
        data-testid="create-own"
        className="mt-4 flex items-center gap-4 rounded-3xl border border-dashed border-white/20 p-4 transition hover:border-white/40 hover:bg-white/[0.04]"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 font-display text-title font-bold">+</span>
        <span>
          <span className="block font-display font-bold">Start your own community</span>
          <span className="text-small text-white/70">For your side of the family, your in-laws or your friends.</span>
        </span>
      </Link>

      <SectionTitle>Upcoming celebrations</SectionTitle>
      {myUpcoming.length === 0 ? (
        <p data-tour="upcoming" className="rounded-3xl border border-dashed border-white/15 p-6 text-center text-small text-white/70">
          Celebrations appear here once you join a community.
        </p>
      ) : (
        <div data-tour="upcoming" className="space-y-3">
          {myUpcoming.map((e) => (
            <EventCard key={e.id} e={e} community={myCommunities.find((c) => c.id === e.communityId)?.name} />
          ))}
        </div>
      )}
      <Link
        href="/feedback/"
        data-testid="feedback-card"
        className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]"
      >
        <span>
          <span className="block font-display font-bold">Help us improve DILO</span>
          <span className="text-small text-white/70">Share an idea or tell us what didn&apos;t work.</span>
        </span>
        <span aria-hidden className="text-[1.6rem]">💬</span>
      </Link>
      <Tour tour="home" steps={homeTour} />
    </AppShell>
  );
}
