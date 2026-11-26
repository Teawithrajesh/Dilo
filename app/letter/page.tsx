"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { useDemo } from "@/lib/demo/store";
import { welcomeLetter, type Lang } from "@/lib/welcomeLetter";

// The founder's welcome letter, shown like a letter on paper. Same text the welcome email will use.
export default function LetterPage() {
  const { me } = useDemo();
  const [lang, setLang] = useState<Lang>("en");
  const first = me ? me.name.split(" ")[0] : "";
  const l = welcomeLetter(first, lang);
  const ink = "#2b2118";

  return (
    <AppShell title="Welcome letter">
      <div role="tablist" aria-label="Language" className="mb-5 grid grid-cols-2 gap-2">
        {(["en", "hi"] as const).map((x) => (
          <button
            key={x}
            role="tab"
            aria-selected={lang === x}
            onClick={() => setLang(x)}
            className={`min-h-11 rounded-full border text-small font-semibold transition ${lang === x ? "border-white bg-white text-navy" : "border-white/20"}`}
          >
            {x === "en" ? "English" : "हिंदी"}
          </button>
        ))}
      </div>

      <article
        lang={lang}
        data-testid="letter"
        className="relative overflow-hidden rounded-[1.25rem] px-6 py-8 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] sm:px-10 sm:py-12"
        style={{ background: "#f8f1e6", color: ink }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[0.9rem] border" style={{ borderColor: "#c9a36a55" }} />
        <header className="relative flex items-center justify-between gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="DILO" width={192} height={192} className="h-12 w-12 rounded-xl" />
          <p className="text-right text-tiny font-semibold uppercase tracking-[0.25em]" style={{ color: "#6f5428" }}>Together, We Make<br />Dreams Come True</p>
        </header>

        <p className="relative mt-8 text-tiny font-semibold uppercase tracking-[0.2em]" style={{ color: "#6f5428" }}>{lang === "hi" ? "विषय" : "Subject"}</p>
        <h1 className="relative mt-1 font-serif text-[1.7rem] font-semibold leading-tight" data-testid="letter-subject">{l.subject}</h1>

        <div className={`relative mt-6 space-y-4 ${lang === "hi" ? "text-[1.05rem] leading-[1.9]" : "font-serif text-[1.2rem] leading-relaxed"}`}>
          <p className="font-semibold">{l.greeting}</p>
          {l.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <ul className="list-disc space-y-2 pl-6">
            {l.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {l.closing.map((p, i) => <p key={i}>{p}</p>)}
          <div className="pt-2">
            <p>{l.signoff[0]}</p>
            <p className="mt-1 font-serif text-[1.8rem] italic leading-none" style={{ color: "#7a1f3d" }}>{l.signoff[1]}</p>
            <p className="mt-1 text-small" style={{ color: "#5c4630" }}>{l.signoff[2]}</p>
          </div>
        </div>
      </article>
      <p className="mt-4 text-center text-tiny text-white/60">From Phase 2 this letter also arrives by email when someone signs up.</p>
    </AppShell>
  );
}
