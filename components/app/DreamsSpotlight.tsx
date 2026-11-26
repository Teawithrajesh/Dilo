"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCelebration } from "@/lib/celebrations";
import { useDemo } from "@/lib/demo/store";
import { CelebrationIcon } from "@/components/celebrate/CelebrationIcon";

const EVERY_MS = 4000;

/**
 * Home dashboard spotlight: dreams that came true in my communities, one at a time,
 * with a soft flash each time it changes. Pause button for anyone who wants it still
 * (and it never moves when the phone asks for reduced motion).
 */
export function DreamsSpotlight() {
  const { dreamsCameTrue: list } = useDemo();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  const auto = playing && !reduced && list.length > 1;
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => setI((x) => x + 1), EVERY_MS);
    return () => window.clearInterval(t);
  }, [auto, list.length]);

  // A new dream just came true? Show it first.
  const newest = list[0]?.id;
  useEffect(() => setI(0), [newest]);

  if (list.length === 0) return null;
  const d = list[i % list.length];
  const c = getCelebration(d.eventKind)!;

  return (
    <section aria-labelledby="dreams-title" className="mt-6" data-testid="dreams-spotlight">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="dreams-title" className="font-display text-small font-semibold uppercase tracking-[0.15em] text-white/70">✨ Dreams that came true</h2>
        {list.length > 1 && !reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the dreams slideshow" : "Play the dreams slideshow"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-small font-semibold text-white/70 hover:text-white"
          >
            {playing ? "❚❚" : "▶"}
          </button>
        )}
      </div>

      <Link
        key={d.id}
        href={`/event/?id=${d.eventId}`}
        aria-live={auto ? "off" : "polite"}
        data-testid="dream-card"
        className="dream-flash relative block overflow-hidden rounded-3xl p-[1.5px]"
        style={{ background: `linear-gradient(120deg, ${c.glows[0]}, ${c.gold}, ${c.glows[1]})` }}
      >
        <div className="relative rounded-[calc(1.5rem-1.5px)] p-5" style={{ background: c.base }}>
          <span aria-hidden className="dream-shine pointer-events-none absolute inset-0" />
          <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl" style={{ background: c.glows[0] }} />
          <div className="relative flex items-start gap-4">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${c.accent} text-navy`}>
              <CelebrationIcon slug={c.slug} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-tiny font-semibold uppercase tracking-[0.25em]" style={{ color: c.gold }}>
                {d.kind === "goal" ? "Goal reached 🎉" : "Wish came true 🎉"}
              </p>
              <p className="mt-1 font-serif text-[1.5rem] font-semibold leading-tight text-white" data-testid="dream-title">{d.title}</p>
              <p className="mt-1 text-small text-white/70">
                {d.eventTitle} · {d.communityName}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {list.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden>
          {list.map((x, n) => (
            <span key={x.id} className={`h-1.5 rounded-full transition-all ${n === i % list.length ? "w-5 bg-white" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{list.length} dreams came true in your communities.</p>
    </section>
  );
}
