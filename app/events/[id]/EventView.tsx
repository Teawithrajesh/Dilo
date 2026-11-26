"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CelebrationIcon, Decor } from "@/components/celebrate/Decor";
import { FramedUpload } from "@/components/celebrate/CelebrationForm";
import { inr, niceDate } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { getCelebration } from "@/lib/celebrations";
import { communities, events } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

/** Event page in its celebration theme. Wishlist and contributions arrive in Step 6. */
export function EventView({ id }: { id: string }) {
  const { ready, me, roleIn } = useDemo();
  const router = useRouter();
  const e = events.find((x) => x.id === id)!;
  const c = getCelebration(e.kind)!;
  const community = communities.find((x) => x.id === e.communityId)!;

  useEffect(() => {
    if (ready && !me) router.replace("/signin/");
  }, [ready, me, router]);
  if (!ready || !me) return <div className="min-h-[calc(100dvh-2rem)] bg-navy" aria-busy="true" />;

  if (roleIn(e.communityId) === null) {
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

  const pct = Math.min(100, Math.round((e.recorded / e.goal) * 100));
  const days = Math.ceil((new Date(e.date + "T00:00:00").getTime() - Date.now()) / 86_400_000);

  return (
    <main className={`relative min-h-[calc(100dvh-2rem)] overflow-hidden bg-gradient-to-b ${c.bg} px-4 pb-20 text-white`}>
      <Decor slug={c.slug} />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex h-16 items-center">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? router.back() : router.push("/home/"))}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy/40 px-4 text-small font-semibold backdrop-blur transition hover:bg-navy/60"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Back
          </button>
        </div>

        <header className="mt-16 text-center">
          <span className={`mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${c.accent} text-navy shadow-lg`}>
            <CelebrationIcon slug={c.slug} />
          </span>
          <p className="mt-6 text-tiny font-semibold uppercase tracking-[0.2em] text-white/70">{c.title} · Sample</p>
          <h1 className="mt-2 text-balance text-[2rem] font-extrabold leading-tight">{e.title}</h1>
          <p className="mt-2 text-white/80">
            {niceDate(e.date)} · {community.name}
            {days > 0 && <span className="block text-small text-white/70">{days} days to go</span>}
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-white/10 bg-navy/50 p-5 backdrop-blur" aria-label="Progress">
          <div className="flex items-end justify-between">
            <p className="font-display text-display font-extrabold">{pct}%</p>
            <p className="text-small text-white/80">{inr(e.recorded)} recorded of {inr(e.goal)}</p>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Recorded towards goal" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full bg-gradient-to-r ${c.accent}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-tiny text-white/70">Self-reported by members. DILO never handles money.</p>
        </section>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          <FramedUpload label={c.photoLabel} hint={c.photoHint} shape="photo" accent={c.accent} testId="photo" />
          <FramedUpload label="Invitation card" hint="Upload your invitation card" shape="card" accent={c.accent} testId="invite" />
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
          <h2 className="font-display text-body font-bold">Dream wish</h2>
          <p className="mt-2 text-white/85" data-testid="dream">{e.dream}</p>
          <h2 className="mt-6 font-display text-body font-bold">Estimated budget</h2>
          <p className="mt-1 font-display text-title font-extrabold">{inr(e.goal)}</p>
        </section>

        <p className="mt-8 rounded-2xl border border-dashed border-white/20 p-4 text-center text-small text-white/75">
          Wishlist ({e.wishes} wishes) and recording contributions open in the next steps.
        </p>
      </div>
    </main>
  );
}
