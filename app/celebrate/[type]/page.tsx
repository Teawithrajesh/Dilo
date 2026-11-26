import Link from "next/link";
import { notFound } from "next/navigation";
import { celebrations, getCelebration } from "@/lib/celebrations";
import { CelebrationIcon, Decor } from "@/components/celebrate/Decor";
import { CelebrationForm } from "@/components/celebrate/CelebrationForm";
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
    <main className={`relative min-h-[calc(100dvh-2rem)] overflow-hidden bg-gradient-to-b ${c.bg} px-4 pb-20 text-white`}>
      <Decor slug={c.slug} />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex h-16 items-center">
          <Link
            href="/welcome/#celebrations"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy/40 px-4 text-small font-semibold backdrop-blur transition hover:bg-navy/60"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Back
          </Link>
        </div>

        <header className="mt-16 text-center">
          <span className={`mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${c.accent} text-navy shadow-lg`}>
            <CelebrationIcon slug={c.slug} />
          </span>
          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-none tracking-tight">{c.title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-balance text-white/80">{c.line}</p>
        </header>

        <CelebrationForm c={c} />
      </div>
    </main>
  );
}
