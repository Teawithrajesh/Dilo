import Link from "next/link";
import { notFound } from "next/navigation";
import { celebrations, getCelebration } from "@/lib/celebrations";
import { CelebrationForm } from "@/components/celebrate/CelebrationForm";
import { Eyebrow, ThemeBackdrop } from "@/components/celebrate/Theme";
import { Icon } from "@/components/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return celebrations.map((c) => ({ type: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const c = getCelebration((await params).type);
  return { title: c ? `${c.title} · DILO` : "DILO" };
}

export default async function CelebrationPage({ params }: { params: Promise<{ type: string }> }) {
  const c = getCelebration((await params).type);
  if (!c) notFound();

  return (
    <main className="relative min-h-[calc(100dvh-2rem)] overflow-hidden px-4 pb-24 text-white">
      <ThemeBackdrop c={c} />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex h-16 items-center">
          <Link
            href="/welcome/#celebrations"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 text-small font-semibold backdrop-blur-md transition hover:bg-black/30"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Back
          </Link>
        </div>

        <header className="mt-20 text-center">
          <Eyebrow gold={c.gold}>Celebrate</Eyebrow>
          <h1 className="mt-5 font-serif text-[3.5rem] font-semibold leading-[0.95] tracking-tight sm:text-[4.5rem]">{c.title}</h1>
          <p className="mx-auto mt-5 max-w-sm text-balance font-serif text-[1.35rem] italic leading-snug text-white/80">{c.line}</p>
        </header>

        <CelebrationForm c={c} />
      </div>
    </main>
  );
}
