import type { CelebrationSlug } from "@/lib/celebrations";

// Tile icons (48×48), one per celebration.
export function CelebrationIcon({ slug, className = "h-12 w-12" }: { slug: CelebrationSlug; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {slug === "birthday" && (
        <g {...common}>
          <path d="M8 40h32V26a4 4 0 0 0-4-4H12a4 4 0 0 0-4 4z" />
          <path d="M8 31c4 3 8 3 12 0s8-3 12 0 6 2 8 0" />
          <path d="M18 22v-6M30 22v-6M24 22v-8" />
          <path d="M18 12c-1.5-2 0-4 0-4s1.5 2 0 4zM30 12c-1.5-2 0-4 0-4s1.5 2 0 4zM24 10c-1.5-2 0-4 0-4s1.5 2 0 4z" fill="currentColor" />
        </g>
      )}
      {slug === "engagement" && (
        <g {...common}>
          <circle cx="24" cy="30" r="12" />
          <path d="M18 14l6-8 6 8-6 5z" />
          <path d="M18 14h12" />
        </g>
      )}
      {slug === "wedding" && (
        <g {...common}>
          <path d="M8 42V20c0-6 7-12 16-12s16 6 16 12v22" />
          <path d="M14 42V22c0-4 4-8 10-8s10 4 10 8v20" />
          <path d="M4 42h40" />
          <circle cx="24" cy="5" r="2" fill="currentColor" />
          <path d="M20 30a2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 1 4 0c0 3-4 5-4 5s-4-2-4-5z" fill="currentColor" />
        </g>
      )}
      {slug === "anniversary" && (
        <g {...common}>
          <path d="M18 18c-2-5-12-5-12 3 0 6 12 13 12 13s12-7 12-13c0-8-10-8-12-3z" />
          <path d="M32 22c1.5-3.5 10-3.5 10 2.5 0 5-10 10.5-10 10.5s-3-1.6-6-4" />
        </g>
      )}
    </svg>
  );
}
