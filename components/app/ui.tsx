import Link from "next/link";
import type { DemoEvent } from "@/lib/demo/data";
import { getCelebration } from "@/lib/celebrations";
import { CelebrationIcon } from "@/components/celebrate/Decor";

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const niceDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center justify-between first:mt-0">
      <h2 className="font-display text-small font-semibold uppercase tracking-[0.15em] text-white/70">{children}</h2>
      {aside}
    </div>
  );
}

export function SampleTag() {
  return <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold text-white/70">Sample</span>;
}

export function EventCard({ e, community }: { e: DemoEvent; community?: string }) {
  const c = getCelebration(e.kind)!;
  const pct = Math.min(100, Math.round((e.recorded / e.goal) * 100));
  return (
    <Link href={`/events/${e.id}/`} className="block rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.99]" data-testid="event-card">
      <div className="flex items-start gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.accent} text-navy`}>
          <CelebrationIcon slug={c.slug} className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-tiny font-semibold uppercase tracking-wider text-white/60">{c.title}</p>
            <SampleTag />
          </div>
          <h3 className="mt-1 font-display text-body font-bold">{e.title}</h3>
          <p className="text-small text-white/60">
            {niceDate(e.date)}
            {community ? ` · ${community}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Recorded towards goal" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full bg-gradient-to-r ${c.accent}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-small text-white/70">
        <span className="font-bold text-white">{pct}%</span> · {inr(e.recorded)} recorded of {inr(e.goal)} · {e.wishes} wishes
      </p>
    </Link>
  );
}
