import Link from "next/link";
import { Icon } from "@/components/Icon";

// Orange with navy text (7.7:1 contrast). Never white on orange.
export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange px-6 font-display font-bold text-navy shadow-[0_8px_30px_-8px_rgba(254,143,2,0.6)] transition hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
      <Icon name="arrow" className="h-5 w-5" />
    </Link>
  );
}

export function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 font-display font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
    </a>
  );
}
