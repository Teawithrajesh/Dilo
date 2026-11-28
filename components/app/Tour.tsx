"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { markTourSeen, tourSeen, type TourId } from "@/lib/tour";

export type TourStep = {
  /** CSS selector of the thing to highlight. No target = a centred card. Missing targets are skipped. */
  target?: string;
  title: string;
  body: string;
};

type Box = { top: number; left: number; width: number; height: number };
const PAD = 8;
const GAP = 14;

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function findTarget(sel?: string): HTMLElement | null {
  if (!sel) return null;
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? el : null;
}
function isFixed(el: HTMLElement) {
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    if (getComputedStyle(n).position === "fixed") return true;
  }
  return false;
}

/**
 * A guided tour for first-time visitors: dims the screen, highlights one part of the page at a time
 * and explains it in a small card. Starts on its own once per demo person; Skip, Esc or Finish ends it.
 */
export function Tour({ tour, steps }: { tour: TourId; steps: TourStep[] }) {
  const { ready, me } = useDemo();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [cardH, setCardH] = useState(240);
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const dir = useRef(1);
  const elRef = useRef<HTMLElement | null>(null);

  // Start once per person, after the page has settled.
  useEffect(() => {
    if (!ready || !me || tourSeen(me.id, tour)) return;
    const t = setTimeout(() => { setI(0); setOpen(true); }, 700);
    return () => clearTimeout(t);
  }, [ready, me, tour]);

  const close = useCallback(() => {
    if (me) markTourSeen(me.id, tour);
    setOpen(false);
  }, [me, tour]);

  const measure = useCallback(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    const el = elRef.current;
    if (!el) return setBox(null);
    const r = el.getBoundingClientRect();
    setBox({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, []);

  // Move to step i: find its target (skip it if it isn't on this page), bring it into view, measure.
  useLayoutEffect(() => {
    if (!open) return;
    const step = steps[i];
    if (!step) return close();
    const el = findTarget(step.target);
    if (step.target && !el) {
      const n = i + dir.current;
      if (n < 0 || n >= steps.length) return close();
      setI(n);
      return;
    }
    elRef.current = el;
    if (el && !isFixed(el)) el.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
    measure();
    const t1 = setTimeout(measure, 350), t2 = setTimeout(measure, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, i, steps, close, measure]);

  // Keep the highlight on its target while the page scrolls or resizes.
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    window.addEventListener("scroll", on, true);
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on, true); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [open, measure]);

  // Know the card's real height so it can always be placed fully on screen.
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h && Math.abs(h - cardH) > 1) setCardH(h);
  });

  // Focus the main button on every step.
  useEffect(() => {
    if (open) nextRef.current?.focus({ preventScroll: true });
  }, [open, i]);

  const go = useCallback((d: 1 | -1) => {
    dir.current = d;
    const n = i + d;
    if (n >= steps.length) return close();
    if (n >= 0) setI(n);
  }, [i, steps.length, close]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Tab" && cardRef.current) {
      // keep keyboard focus inside the tour card
      const f = Array.from(cardRef.current.querySelectorAll<HTMLElement>("button"));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  if (!open || !me || !steps[i]) return null;
  const step = steps[i];
  const last = i === steps.length - 1;
  const anim = reducedMotion() ? "" : "transition-all duration-300 ease-out";

  // Card position: under the highlight if it sits in the top half, above it otherwise; centred when there is none.
  // Always kept fully on screen, below the DEMO DATA banner.
  const cardW = Math.min(360, (vp.w || 360) - 32);
  const TOP = 40, EDGE = 16;
  let cardStyle: React.CSSProperties;
  if (box && vp.h) {
    const left = Math.min(Math.max(EDGE, box.left + box.width / 2 - cardW / 2), vp.w - cardW - EDGE);
    const below = box.top + box.height / 2 < vp.h / 2;
    const want = below ? box.top + box.height + GAP : box.top - GAP - cardH;
    const top = Math.max(TOP, Math.min(want, vp.h - cardH - EDGE));
    cardStyle = { left, top, width: cardW };
  } else {
    cardStyle = { left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: cardW };
  }

  return (
    <div className="fixed inset-0 z-[45]" data-testid="tour" onKeyDown={onKey}>
      {/* Dimmed screen with a hole around the highlighted part. Clicks on the page are blocked during the tour. */}
      {box ? (
        <div
          aria-hidden
          data-testid="tour-spotlight"
          className={`pointer-events-none fixed rounded-3xl ring-2 ring-orange/90 ${anim}`}
          style={{ ...box, boxShadow: "0 0 0 200vmax rgba(4, 7, 28, 0.74)" }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 bg-[rgba(4,7,28,0.78)]" />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        data-testid="tour-card"
        className={`fixed overflow-hidden rounded-3xl border border-white/15 bg-[#121a4a] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)] ${anim}`}
        style={cardStyle}
      >
        <div aria-hidden className="h-1 bg-gradient-to-r from-pink to-orange" />
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-tiny font-semibold uppercase tracking-[0.2em] text-orange" data-testid="tour-count">
              {i + 1} of {steps.length}
            </p>
            <button type="button" onClick={close} className="-mr-2 inline-flex min-h-11 items-center rounded-full px-3 text-small font-semibold text-white/75 hover:text-white">
              Skip tour
            </button>
          </div>
          {!step.target && i === 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/brand/dilo-logo.png" alt="" width={666} height={705} className="mx-auto mb-2 mt-1 h-16 w-auto" />
          )}
          <h2 id="tour-title" className="font-display text-heading font-bold leading-snug">{step.title.replace("{name}", me.short)}</h2>
          <p id="tour-body" className="mt-2 text-small leading-relaxed text-white/80">{step.body}</p>

          <div className="mt-4 flex items-center gap-1.5" aria-hidden>
            {steps.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full ${k === i ? "w-5 bg-orange" : "w-1.5 bg-white/25"}`} />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {i > 0 && (
              <button type="button" onClick={() => go(-1)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 font-display text-small font-semibold transition hover:bg-white/10">
                Back
              </button>
            )}
            <button
              ref={nextRef}
              type="button"
              onClick={() => go(1)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-orange px-5 font-display text-small font-bold text-navy transition active:scale-[0.98]"
            >
              {last ? "Finish" : i === 0 && !step.target ? "Show me around" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
