"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Glows } from "@/components/landing/Glows";
import { Icon, type IconName } from "@/components/Icon";

const cards: { icon: IconName; title: string; text: string }[] = [
  { icon: "dream", title: "Dream", text: "Create a birthday, engagement, wedding or anniversary, and add the dream wish." },
  { icon: "share", title: "Share", text: "Invite family and friends privately. You approve everyone who joins." },
  { icon: "support", title: "Support", text: "People record what they gave. Everyone sees the dream come closer." },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const router = useRouter();
  const last = i === cards.length - 1;

  function finish() {
    try { sessionStorage.setItem("dilo-onboarded", "1"); } catch { /* ignore */ }
    router.push("/home/");
  }

  const c = cards[i];
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] flex-col overflow-hidden bg-navy px-4 py-6 text-white">
      <Glows />
      <div className="relative mx-auto flex w-full max-w-md justify-end">
        <button type="button" onClick={finish} className="inline-flex min-h-11 items-center px-3 text-small font-semibold text-white/70 hover:text-white">
          Skip
        </button>
      </div>
      <section className="relative mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center" aria-live="polite">
        <span className="grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-pink to-orange text-white shadow-[0_20px_60px_-15px_rgba(253,33,110,0.6)]">
          <Icon name={c.icon} className="h-11 w-11" />
        </span>
        <h1 className="mt-8 text-[2.25rem] font-extrabold">{c.title}</h1>
        <p className="mt-3 max-w-xs text-balance text-white/75">{c.text}</p>
        <div className="mt-8 flex gap-2" aria-label={`Card ${i + 1} of ${cards.length}`}>
          {cards.map((_, n) => (
            <span key={n} className={`h-2 rounded-full transition-all ${n === i ? "w-8 bg-white" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </section>
      <div className="relative mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => (last ? finish() : setI(i + 1))}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-display font-bold text-navy transition active:scale-[0.98]"
        >
          {last ? "Get started" : "Next"}
          <Icon name="arrow" className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
