"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Keepsakes } from "@/components/celebrate/CelebrationForm";
import { Divider, Eyebrow, Panel, ThemeBackdrop } from "@/components/celebrate/Theme";
import { inr, niceDate } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { getCelebration } from "@/lib/celebrations";
import { useDemo } from "@/lib/demo/store";
import { Wishlist } from "@/components/app/event/Wishlist";
import { Contributions } from "@/components/app/event/Contributions";
import { ReportButton } from "@/components/app/ReportButton";
import { Tour } from "@/components/app/Tour";
import { eventTour } from "@/components/app/tours";

/** Event page in its celebration theme. Wishlist and contributions arrive in Step 6. */
export function EventView({ id }: { id: string }) {
  const { ready, me, roleIn, event, community: findCommunity, setEventImages } = useDemo();
  const router = useRouter();
  const e = event(id);

  useEffect(() => {
    if (ready && !me) router.replace("/signin/");
  }, [ready, me, router]);
  if (!ready || !me) return <div className="min-h-[calc(100dvh-2rem)] bg-navy" aria-busy="true" />;

  if (!e || roleIn(e.communityId) === null) {
    return (
      <main className="grid min-h-[calc(100dvh-2rem)] place-items-center bg-navy px-4 text-white">
        <div className="max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center" data-testid="private-wall">
          <Icon name="lock" className="mx-auto h-10 w-10 text-orange" />
          <p className="mt-4 font-display text-heading font-bold">This celebration is private</p>
          <p className="mt-2 text-small text-white/70">Only members of the community can see it.</p>
          <Link href="/home/" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-small font-semibold">Back to Home</Link>
        </div>
      </main>
    );
  }

  const c = getCelebration(e.kind)!;
  const community = findCommunity(e.communityId)!;
  const pct = Math.min(100, Math.round((e.recorded / e.goal) * 100));
  const days = Math.ceil((new Date(e.date + "T00:00:00").getTime() - Date.now()) / 86_400_000);

  return (
    <main className="relative min-h-[calc(100dvh-2rem)] overflow-hidden px-4 pb-24 text-white">
      <ThemeBackdrop c={c} />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex h-16 items-center">
          <Link
            href={`/community/?id=${e.communityId}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 text-small font-semibold backdrop-blur-md transition hover:bg-black/30"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            {community.name}
          </Link>
        </div>

        <header className="mt-20 text-center">
          <Eyebrow gold={c.gold}>{e.createdBy ? c.title : `${c.title} · Sample`}</Eyebrow>
          <h1 className="mt-5 text-balance font-serif text-[2.9rem] font-semibold leading-[1] tracking-tight sm:text-[4rem]">{e.title}</h1>
          <p className="mt-5 font-serif text-[1.3rem] italic text-white/80">
            {niceDate(e.date)} · {community.name}
          </p>
          {days > 0 && (
            <p className="mt-2 text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>{days} days to go</p>
          )}
        </header>

        {e.recorded >= e.goal && (
          <div role="status" className="relative mt-10 overflow-hidden rounded-[1.75rem] border p-6 text-center" style={{ borderColor: `${c.gold}66`, background: `linear-gradient(135deg, ${c.glows[0]}33, ${c.glows[1]}33)` }} data-testid="celebration-banner">
            <p className="text-[2.2rem]" aria-hidden>🎉</p>
            <p className="mt-1 font-serif text-[2rem] font-semibold italic leading-tight">The dream came true!</p>
            <p className="mt-2 text-small text-white/80">The goal is reached. Thank you to everyone who made it happen.</p>
          </div>
        )}

        <div className="mt-12" data-tour="progress">
        <Panel gold={c.gold}>
          <div className="flex items-center gap-6">
            <ProgressRing pct={pct} gold={c.gold} accent={c.glows} />
            <div className="min-w-0">
              <p className="text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>Recorded so far</p>
              <p className="mt-1 font-serif text-[2rem] font-semibold leading-none">{inr(e.recorded)}</p>
              <p className="mt-1 text-small text-white/70">of {inr(e.goal)} goal</p>
            </div>
          </div>
          <p className="mt-5 border-t pt-4 text-tiny text-white/60" style={{ borderColor: `${c.gold}26` }}>Self-reported by members. DILO never handles money.</p>
        </Panel>
        </div>

        <Divider gold={c.gold} />
        <Keepsakes
          c={c}
          photo={e.photo}
          invitation={e.invitation}
          onPhoto={(url) => setEventImages(e.id, { photo: url })}
          onInvitation={(url) => setEventImages(e.id, { invitation: url })}
        />
        <Divider gold={c.gold} />

        <div data-tour="dream">
        <Panel gold={c.gold}>
          <h2 className="text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>Dream wish</h2>
          <p className="mt-3 font-serif text-[1.6rem] italic leading-snug text-white/95" data-testid="dream">&ldquo;{e.dream}&rdquo;</p>
          <h2 className="mt-8 text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: c.gold }}>Estimated budget</h2>
          <p className="mt-2 font-serif text-[2.4rem] font-semibold leading-none">{inr(e.goal)}</p>
        </Panel>
        </div>

        <Divider gold={c.gold} />
        <div data-tour="wishlist"><Wishlist eventId={e.id} c={c} /></div>
        <div className="mt-8" data-tour="contributions">
          <Contributions eventId={e.id} c={c} />
        </div>
        <div className="mt-8 flex justify-center">
          <ReportButton communityId={e.communityId} target={{ type: "event", eventId: e.id }} summary={`Celebration: ${e.title}`} label="Report this celebration" />
        </div>
        <Tour tour="event" steps={eventTour} />
      </div>
    </main>
  );
}

function ProgressRing({ pct, gold, accent }: { pct: number; gold: string; accent: [string, string, string] }) {
  const r = 44, C = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0" role="progressbar" aria-label="Recorded towards goal" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={accent[0]} />
            <stop offset="1" stopColor={accent[1]} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke={`${gold}26`} strokeWidth="5" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="url(#ring)" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-serif text-[1.9rem] font-semibold">{pct}%</span>
    </div>
  );
}
