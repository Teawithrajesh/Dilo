"use client";

import { useEffect, useId, useState } from "react";
import type { Celebration } from "@/lib/celebrations";
import { Icon } from "@/components/Icon";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB, as in the blueprint
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WISH = 300;
const MAX_BUDGET = 1_00_00_000; // ₹1 crore

/** Picks an image and shows it inside a themed frame. The file never leaves the phone. */
function FramedUpload({
  label,
  hint,
  shape,
  accent,
  testId,
}: {
  label: string;
  hint: string;
  shape: "photo" | "card";
  accent: string;
  testId: string;
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

  const frame = shape === "photo" ? "aspect-square rounded-full" : "aspect-[3/4] rounded-2xl";

  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 font-display text-small font-semibold uppercase tracking-[0.15em] text-white/80">{label}</p>
      {/* Gradient frame */}
      <div className={`relative w-full ${shape === "photo" ? "max-w-[15rem]" : "max-w-[16rem]"} bg-gradient-to-br ${accent} p-[5px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] ${frame}`}>
        <div className={`relative h-full w-full overflow-hidden bg-navy/90 ${frame}`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} data-testid={`${testId}-preview`} className="h-full w-full object-cover" />
          ) : (
            <label htmlFor={id} className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center text-white/70">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                <Icon name={shape === "photo" ? "users" : "receipt"} />
              </span>
              <span className="text-small">{hint}</span>
            </label>
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/25 px-5 text-small font-semibold text-white transition hover:bg-white/10 focus-within:outline focus-within:outline-2 focus-within:outline-white"
      >
        {url ? "Change" : shape === "photo" ? "Upload photo" : "Upload invitation card"}
        <input id={id} data-testid={`${testId}-input`} type="file" accept={IMAGE_TYPES.join(",")} onChange={onPick} className="sr-only" />
      </label>
      {error && <p role="alert" className="mt-2 text-small text-[#ffb4c4]">{error}</p>}
    </div>
  );
}

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

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-3xl space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <FramedUpload label={c.photoLabel} hint={c.photoHint} shape="photo" accent={c.accent} testId="photo" />
        <FramedUpload label="Invitation card" hint="Upload your invitation card" shape="card" accent={c.accent} testId="invite" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
        <label htmlFor="wish" className="font-display text-body font-bold">Dream wish</label>
        <textarea
          id="wish"
          value={wish}
          onChange={(e) => setWish(e.target.value.slice(0, MAX_WISH))}
          rows={4}
          placeholder={c.wishPlaceholder}
          className="mt-3 w-full resize-none rounded-2xl border border-white/15 bg-navy/60 p-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
        <p className="mt-1 text-right text-tiny text-white/60">{wish.length}/{MAX_WISH}</p>

        <label htmlFor="budget" className="mt-4 block font-display text-body font-bold">Estimated budget</label>
        <div className="mt-3 flex items-center rounded-2xl border border-white/15 bg-navy/60 focus-within:border-white/40">
          <span className="pl-4 font-display text-heading font-bold text-white/70">₹</span>
          <input
            id="budget"
            inputMode="numeric"
            autoComplete="off"
            value={budget}
            onChange={onBudget}
            placeholder="50,000"
            className="min-h-14 w-full bg-transparent px-3 font-display text-heading font-bold text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
        <p className="mt-2 text-tiny text-white/60">Whole rupees. This is a plan, not a payment.</p>
      </div>

      {error && <p role="alert" className="text-center text-small text-[#ffb4c4]">{error}</p>}

      {done ? (
        <div role="status" className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 text-center">
          <p className="font-display text-heading font-bold">Your {c.title.toLowerCase()} dream is ready 🎉</p>
          <p className="mt-2 text-small text-white/70">
            Budget ₹{budget}. In the full app you&apos;ll invite family next. This demo doesn&apos;t save anything.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-8 font-display font-bold text-navy shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition hover:bg-white/90 active:scale-[0.98]"
          >
            Create {c.title.toLowerCase()} dream
            <Icon name="arrow" className="h-5 w-5" />
          </button>
          <p className="mt-3 text-tiny text-white/60">Photos stay on your phone. Nothing is uploaded in this demo.</p>
        </div>
      )}
    </form>
  );
}
