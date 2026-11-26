import type { Celebration, CelebrationSlug } from "@/lib/celebrations";

// Rich, quiet theme layers: soft aurora light, film grain, and fine gold line-art.
// Everything here is decorative (aria-hidden).

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function ThemeBackdrop({ c }: { c: Celebration }) {
  const [a, b, d] = c.glows;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: c.base }}>
      {/* Aurora light */}
      <div className="absolute -left-1/4 -top-32 h-[38rem] w-[38rem] rounded-full opacity-35 blur-[110px]" style={{ background: a }} />
      <div className="absolute -right-1/4 top-40 h-[34rem] w-[34rem] rounded-full opacity-25 blur-[120px]" style={{ background: b }} />
      <div className="absolute -bottom-40 left-1/4 h-[36rem] w-[36rem] rounded-full opacity-25 blur-[130px]" style={{ background: d }} />
      {/* Vignette keeps the edges deep and the centre lit */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
      {/* Film grain for a printed, tactile feel */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {/* Fine line-art behind the title */}
      <div className="absolute left-1/2 top-6 w-[34rem] max-w-[140%] -translate-x-1/2 opacity-[0.22]" style={{ color: c.gold }}>
        <Motif slug={c.slug} />
      </div>
    </div>
  );
}

function sparkle(x: number, y: number, r: number) {
  const k = r * 0.16;
  return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`;
}

function Motif({ slug }: { slug: CelebrationSlug }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9 };
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full">
      {slug === "birthday" && (
        <g>
          {/* Constellation of sparkles joined by hair-lines */}
          <path {...line} d="M60 120 L130 70 L200 95 L270 60 L340 115 M130 70 L150 170 M270 60 L250 165" strokeDasharray="2 5" />
          {[
            [60, 120, 7], [130, 70, 10], [200, 95, 14], [270, 60, 9], [340, 115, 7], [150, 170, 5], [250, 165, 6], [95, 230, 4], [310, 235, 5], [200, 30, 5],
          ].map(([x, y, r], i) => <path key={i} d={sparkle(x, y, r)} fill="currentColor" />)}
          <circle {...line} cx="200" cy="200" r="150" strokeDasharray="1 7" />
        </g>
      )}
      {slug === "engagement" && (
        <g {...line} strokeWidth={1.1}>
          <circle cx="165" cy="215" r="95" />
          <circle cx="165" cy="215" r="88" />
          <circle cx="245" cy="215" r="95" />
          <circle cx="245" cy="215" r="88" />
          <path d="M228 96l17-22 17 22-17 14z M228 96h34 M245 74v36" />
          {[[80, 90, 6], [330, 80, 8], [205, 40, 5], [360, 300, 5], [50, 290, 6]].map(([x, y, r], i) => <path key={i} d={sparkle(x, y, r)} fill="currentColor" stroke="none" />)}
        </g>
      )}
      {slug === "wedding" && (
        <g {...line}>
          {/* Mandala */}
          {[170, 150, 118, 86, 50].map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const x = 200 + Math.cos(a) * 134, y = 200 + Math.sin(a) * 134;
            return <ellipse key={i} cx={x} cy={y} rx="16" ry="6" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 200 + Math.cos(a) * 50, y1 = 200 + Math.sin(a) * 50;
            const x2 = 200 + Math.cos(a) * 86, y2 = 200 + Math.sin(a) * 86;
            const cx = 200 + Math.cos(a + 0.26) * 74, cy = 200 + Math.sin(a + 0.26) * 74;
            return <path key={i} d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} />;
          })}
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return <circle key={i} cx={200 + Math.cos(a) * 160} cy={200 + Math.sin(a) * 160} r="2.2" fill="currentColor" />;
          })}
        </g>
      )}
      {slug === "anniversary" && (
        <g {...line} strokeWidth={1.1}>
          <path d="M170 300C120 260 70 220 70 165c0-40 30-65 62-65 22 0 38 12 48 30 10-18 26-30 48-30 32 0 62 25 62 65" />
          <path d="M230 320c50-40 100-80 100-135 0-40-30-65-62-65-22 0-38 12-48 30" />
          <path d="M150 300C110 268 82 236 82 168" strokeDasharray="1 6" />
          {[[60, 80, 6], [340, 70, 8], [200, 40, 5], [350, 300, 6], [40, 300, 5]].map(([x, y, r], i) => <path key={i} d={sparkle(x, y, r)} fill="currentColor" stroke="none" />)}
        </g>
      )}
    </svg>
  );
}

/** Small caps label between two hair-lines, e.g. ——— BIRTHDAY ——— */
export function Eyebrow({ children, gold }: { children: React.ReactNode; gold: string }) {
  return (
    <p className="flex items-center justify-center gap-3 text-tiny font-semibold uppercase tracking-[0.35em]" style={{ color: gold }}>
      <span className="h-px w-10 bg-current opacity-60" />
      {children}
      <span className="h-px w-10 bg-current opacity-60" />
    </p>
  );
}

/** Line · diamond · line */
export function Divider({ gold }: { gold: string }) {
  return (
    <div aria-hidden className="my-10 flex items-center justify-center gap-3" style={{ color: gold }}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current opacity-70" />
      <span className="h-2 w-2 rotate-45 border border-current" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current opacity-70" />
    </div>
  );
}

/** Frosted panel used for details on theme pages. */
export function Panel({ children, gold, className = "" }: { children: React.ReactNode; gold: string; className?: string }) {
  return (
    <div
      className={`relative rounded-[1.75rem] border bg-white/[0.045] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8 ${className}`}
      style={{ borderColor: `${gold}33` }}
    >
      {children}
    </div>
  );
}
