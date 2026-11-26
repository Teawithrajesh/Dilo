import Link from "next/link";
import { Glows } from "@/components/landing/Glows";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Create your community · DILO" };

export default function Join() {
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] items-center justify-center overflow-hidden bg-navy px-4 text-white">
      <Glows variant="soft" />
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="mx-auto h-auto w-20" />
        <h1 className="mt-6 text-title font-bold">Sign-up opens soon</h1>
        <p className="mt-3 text-white/70">
          In the next version you&apos;ll create your community here. This preview runs on demo data only.
        </p>
        <Link
          href="/welcome/"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-display font-semibold transition hover:bg-white/10"
        >
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
          Back to DILO
        </Link>
      </div>
    </main>
  );
}
