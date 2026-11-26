import type { CelebrationSlug } from "@/lib/celebrations";

// Themed background decoration for each celebration page. Decorative only.

function Balloon({ x, y, s, c }: { x: number; y: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0c-16 0-28 14-28 32 0 20 16 36 28 40 12-4 28-20 28-40C28 14 16 0 0 0z" fill={c} />
      <path d="M-6 8c-6 3-10 10-10 18" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-4 72h8l-4 6z" fill={c} />
      <path d="M0 78c-6 14 6 24 0 38s6 24 0 40" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
    </g>
  );
}

function Sparkle({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  const k = r * 0.18;
  return <path d={`M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`} fill={c} />;
}

function Ring({ x, y, s, c }: { x: number; y: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none">
      <circle cx="0" cy="22" r="20" stroke={c} strokeWidth="5" />
      <path d="M-8 2l8-10 8 10-8 6z" fill="#fff" fillOpacity=".85" />
    </g>
  );
}

function Marigold({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={x + Math.cos(a) * r * 0.55} cy={y + Math.sin(a) * r * 0.55} r={r * 0.45} fill={c} />;
      })}
      <circle cx={x} cy={y} r={r * 0.4} fill="#b45309" />
    </g>
  );
}

function Heart({ x, y, s, c, o = 1 }: { x: number; y: number; s: number; c: string; o?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 8C-4-2-18-2-18 10c0 10 18 20 18 20s18-10 18-20C18-2 4-2 0 8z"
      fill={c}
      opacity={o}
    />
  );
}

function Mandala({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  return (
    <g stroke={c} fill="none" strokeWidth="1" opacity=".18">
      <circle cx={x} cy={y} r={r} />
      <circle cx={x} cy={y} r={r * 0.72} />
      <circle cx={x} cy={y} r={r * 0.4} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <ellipse key={i} cx={x + Math.cos(a) * r * 0.86} cy={y + Math.sin(a) * r * 0.86} rx={r * 0.12} ry={r * 0.06} transform={`rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * r * 0.86} ${y + Math.sin(a) * r * 0.86})`} />;
      })}
    </g>
  );
}

// A faint repeating pattern so the theme is felt all the way down the page.
const patterns: Record<CelebrationSlug, string> = {
  birthday:
    "<circle cx='20' cy='22' r='9' fill='%23FD216E'/><path d='M20 31q-3 8 0 16' stroke='%23fff' fill='none'/><circle cx='90' cy='80' r='8' fill='%23FFB000'/><path d='M90 88q3 8 0 15' stroke='%23fff' fill='none'/><rect x='60' y='30' width='7' height='3' fill='%238b7cff' transform='rotate(30 60 30)'/><rect x='25' y='95' width='7' height='3' fill='%23FE8F02' transform='rotate(-20 25 95)'/>",
  engagement:
    "<circle cx='30' cy='34' r='10' stroke='%23f6c26b' stroke-width='2.5' fill='none'/><path d='M26 21l4-5 4 5-4 3z' fill='%23fff'/><path d='M95 90c-2-5-10-5-10 1 0 5 10 10 10 10s10-5 10-10c0-6-8-6-10-1z' fill='%23f7b2c4'/>",
  wedding:
    "<g fill='%23FFB000'><circle cx='30' cy='30' r='5'/><circle cx='38' cy='30' r='5'/><circle cx='34' cy='24' r='5'/><circle cx='34' cy='36' r='5'/></g><circle cx='34' cy='30' r='3' fill='%23b45309'/><path d='M80 95c6-14 18-14 18 0-6 10-18 10-18 0z' fill='none' stroke='%23FE8F02' stroke-width='2'/>",
  anniversary:
    "<path d='M30 32c-2-6-13-6-13 2 0 6 13 13 13 13s13-7 13-13c0-8-11-8-13-2z' fill='%23ff8fb1'/><path d='M95 92c-1-4-8-4-8 1 0 4 8 8 8 8s8-4 8-8c0-5-7-5-8-1z' fill='%238b7cff'/><path d='M70 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z' fill='%23FFB000'/>",
};

/** Seeded scatter that stays out of the centre column where the title sits. */
function confetti(colors: string[]) {
  const out: { x: number; y: number; rot: number; c: string; w: number }[] = [];
  for (let i = 0; out.length < 26 && i < 400; i++) {
    const r = (n: number) => ((Math.sin((i + 1) * (n + 3) * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const x = r(1) * 400, y = r(2) * 360;
    if (y > 110 && x > 70 && x < 330) continue; // keep the title area clear
    if (x < 115 && y < 60) continue; // keep the Back button clear
    out.push({ x, y, rot: r(3) * 180, c: colors[i % colors.length], w: 4 + r(4) * 6 });
  }
  return out;
}

export function Decor({ slug }: { slug: CelebrationSlug }) {
  const tile = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>${patterns[slug]}</svg>")`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: tile, backgroundSize: "120px 120px" }} />
      {/* Top band: sits around the header, never on the text (viewBox maps to the first ~360px on phones). */}
      <div className="relative mx-auto max-w-3xl">
        <svg className="block h-auto w-full" viewBox="0 0 400 360" preserveAspectRatio="xMidYMin meet">
          {slug === "birthday" && (
            <>
              {confetti(["#FD216E", "#FE8F02", "#FFB000", "#8b7cff", "#5ee0c8"]).map((p, i) => (
                <rect key={i} x={p.x} y={p.y} width={p.w} height={p.w * 0.45} rx="1" fill={p.c} opacity=".75" transform={`rotate(${p.rot} ${p.x} ${p.y})`} />
              ))}
              <g opacity=".9">
                <Balloon x={38} y={120} s={0.75} c="#FD216E" />
                <Balloon x={362} y={100} s={0.8} c="#8b7cff" />
                <Balloon x={322} y={22} s={0.55} c="#FFB000" />
                <Balloon x={200} y={14} s={0.5} c="#FE8F02" />
              </g>
            </>
          )}
          {slug === "engagement" && (
            <>
              <Ring x={318} y={34} s={1.1} c="#f6c26b" />
              <Ring x={342} y={50} s={1.1} c="#f7b2c4" />
              <Ring x={40} y={150} s={0.9} c="#f6c26b" />
              {[[200, 40, 8], [140, 80, 5], [262, 86, 6], [370, 170, 7], [30, 240, 6], [372, 260, 5], [60, 100, 5]].map(([x, y, r], i) => (
                <Sparkle key={i} x={x} y={y} r={r} c={i % 2 ? "#f7b2c4" : "#f6c26b"} />
              ))}
              <Heart x={200} y={74} s={0.55} c="#f7b2c4" o={0.6} />
            </>
          )}
          {slug === "wedding" && (
            <>
              {/* Toran: marigold garland across the top */}
              <path d="M-10 6 Q100 50 200 16 T410 6" stroke="#2f7a3b" strokeWidth="2" fill="none" opacity=".8" />
              {Array.from({ length: 15 }, (_, i) => {
                const t = i / 14;
                const x = -10 + t * 420;
                const y = 8 + Math.sin(t * Math.PI) * 18 + Math.sin(t * Math.PI * 2) * -6;
                return <Marigold key={i} x={x} y={y} r={9} c={i % 2 ? "#FE8F02" : "#FFB000"} />;
              })}
              {[24, 62, 338, 376].map((x, i) => (
                <g key={x}>
                  <line x1={x} y1={16} x2={x} y2={90 + (i % 2) * 40} stroke="#2f7a3b" strokeWidth="1.5" opacity=".7" />
                  <Marigold x={x} y={96 + (i % 2) * 40} r={8} c="#FFB000" />
                  <Marigold x={x} y={78 + (i % 2) * 40} r={6} c="#FE8F02" />
                </g>
              ))}
              <Mandala x={200} y={170} r={150} c="#FFB000" />
            </>
          )}
          {slug === "anniversary" && (
            <>
              {[[42, 110, 1.1, "#ff8fb1"], [358, 40, 1, "#FD216E"], [360, 170, 0.8, "#8b7cff"], [34, 220, 0.7, "#FD216E"], [150, 36, 0.55, "#ff8fb1"], [270, 30, 0.6, "#8b7cff"]].map(([x, y, sc, c], i) => (
                <Heart key={i} x={x as number} y={y as number} s={sc as number} c={c as string} o={0.6} />
              ))}
              {[[320, 110, 7], [80, 170, 6], [210, 16, 6]].map(([x, y, r], i) => (
                <Sparkle key={i} x={x} y={y} r={r} c="#FFB000" />
              ))}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

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
