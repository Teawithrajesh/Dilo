"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Glows } from "@/components/landing/Glows";
import { Avatar } from "@/components/app/Avatar";
import { Icon } from "@/components/Icon";
import { people } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

export default function SignIn() {
  const { signIn } = useDemo();
  const router = useRouter();

  function pick(id: (typeof people)[number]["id"]) {
    signIn(id);
    const next = new URLSearchParams(window.location.search).get("next");
    // Only follow internal paths (never another website)
    if (next && next.startsWith("/") && !next.startsWith("//")) return router.push(next);
    let seen = false;
    try { seen = sessionStorage.getItem("dilo-onboarded") === "1"; } catch { /* ignore */ }
    router.push(seen ? "/home/" : "/onboarding/");
  }

  return (
    <main className="relative min-h-[calc(100dvh-2rem)] overflow-hidden bg-navy px-4 py-10 text-white">
      <Glows variant="soft" />
      <div className="relative mx-auto max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="mx-auto h-auto w-20" />
        <h1 className="mt-6 text-center text-title font-extrabold">Try DILO as…</h1>
        <p className="mt-2 text-balance text-center text-white/70">
          Pick a demo person to see the app through their eyes. No account or password needed.
        </p>
        <ul className="mt-8 space-y-3">
          {people.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => pick(p.id)}
                className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:border-white/25 hover:bg-white/[0.08] active:scale-[0.99]"
              >
                <Avatar person={p} size="h-12 w-12 text-body" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display font-bold">{p.name}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold">{p.label}</span>
                  </span>
                  <span className="mt-1 block text-small text-white/70">{p.blurb}</span>
                </span>
                <Icon name="arrow" className="h-5 w-5 shrink-0 text-white/60" />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-tiny text-white/60">Sample people. Refreshing the page resets the demo.</p>
        <Link href="/early-access/" className="mt-6 flex min-h-14 items-center justify-between gap-3 rounded-3xl border border-gold/40 bg-gold/10 px-5 py-3" data-testid="early-access-cta">
          <span>
            <span className="block font-display font-bold">Want your own real account?</span>
            <span className="text-small text-white/70">Join the early-access list</span>
          </span>
          <Icon name="arrow" className="h-5 w-5 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
