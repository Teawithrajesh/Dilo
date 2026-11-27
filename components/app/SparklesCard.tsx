"use client";

import Link from "next/link";
import { SparkleIcon } from "./Sparkle";
import { formatCountdown, useSparkles } from "./useSparkles";
import { useDemo } from "@/lib/demo/store";

/** Home: a daily nudge to collect today's Sparkles. */
export function SparklesCard() {
  const { me } = useDemo();
  const { state, info, msLeft } = useSparkles(me?.id);
  if (!state || !info) return null;
  return (
    <Link
      href="/sparkles/"
      data-testid="sparkles-card"
      className={`relative mt-6 flex items-center gap-4 overflow-hidden rounded-3xl border p-4 transition ${info.collectedToday ? "border-white/10 bg-white/[0.04]" : "sparkle-today border-gold/60 bg-gradient-to-r from-gold/15 to-orange/10"}`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/60">
        <SparkleIcon className="h-8 w-8" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-bold">
          {info.collectedToday ? "Sparkles collected today" : `Collect today's +${info.reward} Sparkles`}
        </span>
        <span className="text-small text-white/70">
          {info.collectedToday ? `Next in ${formatCountdown(msLeft)}` : `Day ${info.step} of 7 · ${state.balance.toLocaleString("en-IN")} collected`}
        </span>
        <span className="mt-2 flex gap-1" aria-hidden>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < info.done ? "bg-gold" : i === info.done && !info.collectedToday ? "bg-gold/40" : "bg-white/15"}`} />
          ))}
        </span>
      </span>
    </Link>
  );
}

/** Header chip: your Sparkles balance. */
export function SparklesChip() {
  const { me } = useDemo();
  const { state } = useSparkles(me?.id);
  if (!state || me?.platformAdmin) return null;
  return (
    <Link href="/sparkles/" data-testid="sparkles-chip" className="inline-flex min-h-11 items-center gap-1 rounded-full px-2 font-display text-small font-bold text-gold">
      <SparkleIcon className="h-4 w-4" />
      {state.balance.toLocaleString("en-IN")}
      <span className="sr-only"> Sparkles</span>
    </Link>
  );
}
