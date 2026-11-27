"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SparkleIcon } from "@/components/app/Sparkle";
import { formatCountdown, useSparkles } from "@/components/app/useSparkles";
import { useDemo } from "@/lib/demo/store";
import { DAY_REWARDS } from "@/lib/sparkles";
import { playChime } from "@/lib/sound";

function useCountUp(target: number) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || from.current === target) { setShown(target); from.current = target; return; }
    const start = performance.now(), a = from.current, dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      setShown(Math.round(a + (target - a) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

export default function SparklesPage() {
  const { me } = useDemo();
  const { state, info, collect, msLeft } = useSparkles(me?.id);
  const [tab, setTab] = useState<"mine" | "history">("mine");
  const [burst, setBurst] = useState<number | null>(null);
  const balance = useCountUp(state?.balance ?? 0);

  function onCollect() {
    const amount = collect();
    if (amount === null) return;
    playChime();
    try { navigator.vibrate?.([12, 40, 12]); } catch { /* ignore */ }
    setBurst(amount);
    window.setTimeout(() => setBurst(null), 1600);
  }

  return (
    <AppShell title="Sparkles">
      <div role="tablist" aria-label="Sparkles" className="grid grid-cols-2 gap-2">
        {(["mine", "history"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-11 rounded-full border text-small font-semibold transition ${tab === t ? "border-white bg-white text-navy" : "border-white/20"}`}>
            {t === "mine" ? "My Sparkles" : "History"}
          </button>
        ))}
      </div>

      {tab === "mine" && state && info && (
        <>
          <p className="mt-6 text-center text-white/75">Collect Sparkles every day you open DILO. Keep your streak going for a bigger bonus on Day 7.</p>

          {/* Hero: the glowing star and your balance */}
          <div className="relative mx-auto mt-6 grid h-44 w-44 place-items-center">
            <span aria-hidden className="sparkle-halo absolute inset-0 rounded-full" />
            <SparkleIcon className="sparkle-hero relative h-28 w-28 drop-shadow-[0_0_30px_rgba(255,176,0,0.55)]" />
            {burst !== null && (
              <span aria-hidden className="pointer-events-none absolute inset-0">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className="sparkle-burst absolute left-1/2 top-1/2" style={{ ["--a" as string]: `${i * 36}deg` }}>
                    <SparkleIcon className="h-4 w-4" />
                  </span>
                ))}
                <span className="sparkle-plus absolute left-1/2 top-0 -translate-x-1/2 font-display text-title font-extrabold text-gold">+{burst}</span>
              </span>
            )}
          </div>
          <p className="mt-2 text-center font-display text-[2.6rem] font-extrabold leading-none" data-testid="sparkle-balance">{balance.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-center text-small text-white/60">Sparkles collected</p>

          {info.broken && (
            <p className="mt-5 rounded-2xl bg-white/[0.06] px-4 py-3 text-center text-small" data-testid="streak-reset">
              You missed a day, so your streak starts again from Day 1. Come back every day to reach the Day 7 bonus!
            </p>
          )}

          {/* 7-day ladder */}
          <ol className="mt-6 grid grid-cols-4 gap-2" data-testid="streak">
            {DAY_REWARDS.map((r, i) => {
              const day = i + 1;
              const isDone = day <= info.done;
              const isToday = !info.collectedToday && day === info.step;
              const bonus = day === 7;
              return (
                <li
                  key={day}
                  data-testid={`day-${day}`}
                  data-state={isDone ? "done" : isToday ? "today" : "later"}
                  className={`relative flex min-h-20 flex-col items-center justify-center rounded-2xl border text-center transition ${bonus ? "col-span-2" : ""} ${
                    isDone
                      ? "border-transparent bg-gradient-to-br from-[#ffd56a] to-orange text-navy"
                      : isToday
                        ? "sparkle-today border-gold bg-gold/10"
                        : "border-white/15 bg-white/[0.03]"
                  }`}
                >
                  {isDone ? (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-navy/15 font-bold" aria-hidden>✓</span>
                  ) : (
                    <span className="font-display text-heading font-extrabold">+{r}</span>
                  )}
                  <span className={`mt-0.5 text-tiny font-semibold ${isDone ? "text-navy/80" : "text-white/70"}`}>
                    {bonus ? "Day 7 · Bonus" : `Day ${day}`}
                  </span>
                  <span className="sr-only">{isDone ? "collected" : isToday ? "today" : ""}</span>
                </li>
              );
            })}
          </ol>

          {info.collectedToday ? (
            <div className="mt-6 rounded-full border border-white/15 bg-white/[0.04] px-5 py-4 text-center" data-testid="next-collect" role="status">
              <span className="text-small text-white/70">Collected today ✓ · Next Sparkles in </span>
              <span className="font-display font-bold tabular-nums">{formatCountdown(msLeft)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onCollect}
              className="sparkle-cta mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd56a] via-gold to-orange font-display text-body font-extrabold text-navy shadow-[0_15px_40px_-12px_rgba(255,176,0,0.7)] transition active:scale-[0.98]"
            >
              <SparkleIcon className="h-5 w-5" /> Collect +{info.reward} Sparkles
            </button>
          )}

          {/* No promises yet about what Sparkles are for (founder's decision). */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-gold/30 p-6" data-testid="sparkles-coming">
            <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
            <p className="text-tiny font-semibold uppercase tracking-[0.25em] text-gold">Coming soon</p>
            <p className="mt-2 font-serif text-[1.6rem] italic leading-tight">Something special is on its way.</p>
            <p className="mt-2 text-small text-white/70">Keep collecting. Your Sparkles are saved for you.</p>
          </div>
          <p className="mt-4 text-center text-tiny text-white/60">Sparkles aren&apos;t money and can&apos;t be bought, sold or exchanged.</p>
        </>
      )}

      {tab === "history" && state && (
        <ul className="mt-6 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]" data-testid="sparkle-history">
          {state.history.length === 0 && <li className="p-5 text-center text-small text-white/70">Nothing yet. Collect your first Sparkles today!</li>}
          {state.history.map((h) => (
            <li key={h.day} className="flex items-center justify-between p-4">
              <span>
                <span className="block font-semibold">{new Date(h.day + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                <span className="text-tiny text-white/60">Day {h.step} of 7</span>
              </span>
              <span className="flex items-center gap-1 font-display font-bold text-gold">+{h.amount} <SparkleIcon className="h-4 w-4" /></span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
