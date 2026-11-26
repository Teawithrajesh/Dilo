"use client";

import { useEffect, useId, useState } from "react";
import type { Celebration } from "@/lib/celebrations";
import { Icon } from "@/components/Icon";
import { Divider, Panel } from "./Theme";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB, as in the blueprint
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WISH = 300;
const MAX_BUDGET = 1_00_00_000; // ₹1 crore

type Shape = Celebration["photoShape"] | "card";

const shapeClass: Record<Shape, string> = {
  circle: "aspect-square rounded-full",
  oval: "aspect-[4/5] rounded-[50%]",
  arch: "aspect-[4/5] rounded-t-full rounded-b-[1.25rem]",
  card: "aspect-[3/4] rounded-[0.9rem]",
};

/** Picks an image and shows it inside an elegant gold-lined frame. The file never leaves the phone. */
export function FramedUpload({
  label,
  hint,
  shape,
  gold,
  testId,
  tilt = 0,
}: {
  label: string;
  hint: string;
  shape: Shape;
  gold: string;
  testId: string;
  tilt?: number;
}) {
  const id = useId();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return setError("Please choose a JPG, PNG or WebP image.");
    if (file.size > MAX_IMAGE_BYTES) return setError("That image is over 5 MB. Please choose a smaller one.");
    setError(null);
    setUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  const isCard = shape === "card";
  const s = shapeClass[shape];

  return (
    <figure className="flex flex-col items-center">
      <div className="w-full max-w-[15.5rem] transition-transform duration-500" style={{ transform: `rotate(${tilt}deg)` }}>
        {/* Outer hairline, then the frame itself */}
        <div className={`relative border p-[7px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ${s}`} style={{ borderColor: `${gold}80` }}>
          <div className={`relative h-full w-full overflow-hidden border ${s}`} style={{ borderColor: gold, background: isCard ? "#f7efe3" : "rgba(255,255,255,0.04)" }}>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={label} data-testid={`${testId}-preview`} className="h-full w-full object-cover" />
            ) : isCard ? (
              <label htmlFor={id} className="absolute inset-3 flex cursor-pointer flex-col items-center justify-center rounded-[0.5rem] border text-center" style={{ borderColor: "#b8925a66", color: "#4a3320" }}>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]" style={{ color: "#765828" }}>You are invited</span>
                <span className="mt-3 font-serif text-[1.6rem] italic leading-tight">Your invitation</span>
                <span className="mt-3 h-px w-12" style={{ background: "#b8925a" }} />
                <span className="mt-3 px-4 text-small" style={{ color: "#5c4630" }}>{hint}</span>
              </label>
            ) : (
              <label htmlFor={id} className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full border" style={{ borderColor: `${gold}99`, color: gold }}>
                  <Icon name="users" className="h-5 w-5" />
                </span>
                <span className="font-serif text-heading italic text-white/90">{label}</span>
                <span className="text-small text-white/70">{hint}</span>
              </label>
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-tiny font-semibold uppercase tracking-[0.3em]" style={{ color: gold }}>{isCard ? "Invitation card" : label}</figcaption>
      <label
        htmlFor={id}
        className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-small font-semibold text-white transition hover:bg-white/10 focus-within:outline focus-within:outline-2 focus-within:outline-white"
        style={{ borderColor: `${gold}66` }}
      >
        {url ? "Change" : isCard ? "Upload invitation card" : "Upload photo"}
        <input id={id} data-testid={`${testId}-input`} type="file" accept={IMAGE_TYPES.join(",")} onChange={onPick} className="sr-only" />
      </label>
      {error && <p role="alert" className="mt-2 text-small text-[#ffb4c4]">{error}</p>}
    </figure>
  );
}

/** Photo + invitation, composed like two keepsakes laid on a table. */
export function Keepsakes({ c }: { c: Celebration }) {
  return (
    <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
      <FramedUpload label={c.photoLabel} hint={c.photoHint} shape={c.photoShape} gold={c.gold} testId="photo" tilt={-2} />
      <FramedUpload label="Invitation card" hint="Tap to upload your card" shape="card" gold={c.gold} testId="invite" tilt={2} />
    </div>
  );
}

const fieldLabel = "block text-tiny font-semibold uppercase tracking-[0.3em]";
const fieldBox = "w-full rounded-2xl border bg-black/20 text-white placeholder:text-white/40 focus:outline-none";

export function CelebrationForm({ c }: { c: Celebration }) {
  const [wish, setWish] = useState("");
  const [budget, setBudget] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const budgetNumber = Number(budget.replace(/[^0-9]/g, ""));

  function onBudget(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setBudget(digits ? Number(digits).toLocaleString("en-IN") : "");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wish.trim()) return setError("Please write the dream wish.");
    if (!budgetNumber) return setError("Please enter an estimated budget in rupees.");
    if (budgetNumber > MAX_BUDGET) return setError("Please enter a budget up to ₹1,00,00,000.");
    setError(null);
    setDone(true);
  }

  const border = { borderColor: `${c.gold}40` };

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-14 max-w-3xl">
      <Keepsakes c={c} />

      <Divider gold={c.gold} />

      <Panel gold={c.gold}>
        <label htmlFor="wish" className={fieldLabel} style={{ color: c.gold }}>Dream wish</label>
        <textarea
          id="wish"
          value={wish}
          onChange={(e) => setWish(e.target.value.slice(0, MAX_WISH))}
          rows={4}
          placeholder={c.wishPlaceholder}
          className={`${fieldBox} mt-3 resize-none p-4 font-serif text-[1.2rem] italic leading-snug focus:border-white/40`}
          style={border}
        />
        <p className="mt-1 text-right text-tiny text-white/60">{wish.length}/{MAX_WISH}</p>

        <label htmlFor="budget" className={`${fieldLabel} mt-6`} style={{ color: c.gold }}>Estimated budget</label>
        <div className={`${fieldBox} mt-3 flex items-center focus-within:border-white/40`} style={border}>
          <span className="pl-4 font-serif text-[1.6rem] text-white/70">₹</span>
          <input
            id="budget"
            inputMode="numeric"
            autoComplete="off"
            value={budget}
            onChange={onBudget}
            placeholder="50,000"
            className="min-h-14 w-full bg-transparent px-3 font-serif text-[1.6rem] font-semibold text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
        <p className="mt-2 text-tiny text-white/60">Whole rupees. This is a plan, not a payment.</p>
      </Panel>

      {error && <p role="alert" className="mt-6 text-center text-small text-[#ffb4c4]">{error}</p>}

      <div className="mt-10 text-center">
        {done ? (
          <div role="status">
            <Panel gold={c.gold}>
              <p className="font-serif text-[1.8rem] italic leading-tight">Your {c.title.toLowerCase()} dream is ready</p>
              <p className="mt-2 text-small text-white/70">
                Budget ₹{budget}. In the full app you&apos;ll invite family next. This demo doesn&apos;t save anything.
              </p>
            </Panel>
          </div>
        ) : (
          <>
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-9 font-display font-bold text-navy shadow-[0_20px_50px_-15px_rgba(255,255,255,0.45)] transition hover:bg-white/90 active:scale-[0.98]"
            >
              Create {c.title.toLowerCase()} dream
              <Icon name="arrow" className="h-5 w-5" />
            </button>
            <p className="mt-4 text-tiny text-white/60">Photos stay on your phone. Nothing is uploaded in this demo.</p>
          </>
        )}
      </div>
    </form>
  );
}
