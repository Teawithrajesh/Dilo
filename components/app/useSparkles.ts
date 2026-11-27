"use client";

import { useCallback, useEffect, useState } from "react";
import { collect as doCollect, loadSparkles, msToTomorrow, SPARKLES_CHANGED, today, type SparkleState } from "@/lib/sparkles";

/** Sparkles for the signed-in person, with a live countdown to tomorrow. */
export function useSparkles(personId: string | undefined) {
  const [state, setState] = useState<SparkleState | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!personId) return;
    const load = () => setState(loadSparkles(personId));
    load();
    window.addEventListener(SPARKLES_CHANGED, load);
    return () => window.removeEventListener(SPARKLES_CHANGED, load);
  }, [personId]);
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const info = state ? today(state, now) : null;

  const collect = useCallback(() => {
    if (!personId) return null;
    const r = doCollect(personId, new Date());
    if (r) setState(r.state);
    return r?.amount ?? null;
  }, [personId]);

  return { state, info, collect, msLeft: msToTomorrow(now) };
}

export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}
