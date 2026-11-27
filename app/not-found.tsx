import Link from "next/link";
import { Glows } from "@/components/landing/Glows";

// Branded "page not found" (e.g. a mistyped or old link).
export default function NotFound() {
  return (
    <main className="relative grid min-h-[calc(100dvh-2rem)] place-items-center overflow-hidden bg-navy px-4 text-center text-white">
      <Glows variant="soft" />
      <div className="relative max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="mx-auto h-auto w-24" />
        <h1 className="mt-8 font-display text-title font-extrabold">This page isn&apos;t here</h1>
        <p className="mt-2 text-white/70">The link may be old or mistyped. Let&apos;s take you somewhere happier.</p>
        <div className="mt-8 grid gap-3">
          <Link href="/home/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange font-display font-bold text-navy">Go to my DILO</Link>
          <Link href="/welcome/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 font-display font-semibold">About DILO</Link>
        </div>
      </div>
    </main>
  );
}
