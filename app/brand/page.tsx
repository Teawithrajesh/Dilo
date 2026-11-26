import tokens from "@/brand/tokens.json";

export const metadata = { title: "DILO · Brand guide" };

const swatches: { key: keyof typeof tokens.colors; name: string; use: string }[] = [
  { key: "navy", name: "Navy", use: "Wordmark, text, dark backgrounds" },
  { key: "pink", name: "Pink", use: "Symbol, large accents" },
  { key: "pink-deep", name: "Pink deep", use: "Pink text and badges" },
  { key: "violet", name: "Violet", use: "Links, secondary buttons" },
  { key: "orange", name: "Orange", use: "Primary buttons (navy text)" },
  { key: "gold", name: "Gold", use: "Sparkle, celebrations" },
  { key: "trust", name: "Trust green", use: "\"Confirmed by organiser\"" },
  { key: "caution", name: "Caution amber", use: "\"Self-reported\", \"Awaiting\"" },
  { key: "slate", name: "Slate", use: "Secondary text" },
  { key: "mist", name: "Mist", use: "Page background" },
];

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-display font-extrabold">DILO brand guide</h1>
      <p className="mt-2 text-slate">Taken directly from the founder&apos;s concept. Phase 1 · Step 2.</p>

      <h2 className="mt-10 text-title font-bold">Logo</h2>
      <figure className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO — Together, We Make Dreams Come True." width={865} height={268} className="mx-auto h-auto w-full max-w-md" />
      </figure>
      <figure className="mt-4 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="DILO app icon" width={96} height={96} className="h-24 w-24 rounded-3xl" />
        <figcaption className="text-small text-slate">App icon on your phone&apos;s home screen.</figcaption>
      </figure>

      <h2 className="mt-10 text-title font-bold">Colours</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {swatches.map((s) => (
          <li key={s.key} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="h-16" style={{ background: tokens.colors[s.key] }} />
            <div className="p-3">
              <p className="font-bold">{s.name}</p>
              <p className="text-tiny text-slate">{tokens.colors[s.key]}</p>
              <p className="mt-1 text-small">{s.use}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-title font-bold">Buttons and labels</h2>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex min-h-11 items-center rounded-full bg-orange px-6 font-display font-bold text-navy">Create Your Community</span>
        <span className="inline-flex min-h-11 items-center rounded-full bg-violet px-6 font-display font-bold text-white">Discover How DILO Works</span>
        <span className="rounded-full border border-trust px-3 py-1 text-small font-semibold text-trust">Confirmed by organiser</span>
        <span className="rounded-full border border-caution px-3 py-1 text-small font-semibold text-caution">Self-reported</span>
        <span className="rounded-full bg-gold px-3 py-1 text-small font-bold text-navy">Goal reached 🎉</span>
      </div>

      <h2 className="mt-10 text-title font-bold">Type</h2>
      <div className="mt-4 space-y-2 rounded-2xl bg-white p-6 shadow-sm">
        <p className="font-display text-display font-extrabold">Display 32 · Plus Jakarta Sans</p>
        <p className="font-display text-title font-bold">Title 24 · Plus Jakarta Sans</p>
        <p className="font-display text-heading font-bold">Heading 20</p>
        <p className="text-body">Body 16 · Inter. Record a contribution, never &quot;Donate now&quot;.</p>
        <p className="text-small text-slate">Small 14 · secondary text</p>
        <p className="text-tiny text-slate">Tiny 12 · captions</p>
      </div>

      <h2 className="mt-10 text-title font-bold">Rules</h2>
      <ul className="mt-4 list-disc space-y-1 pl-6">
        <li>Use the logo on white or light backgrounds only.</li>
        <li>Show it at least 160 px wide so the tagline stays readable.</li>
        <li>Never stretch, recolour outside the palette, add shadows, or place on busy photos without a solid backing.</li>
        <li>White text never goes on orange or bright pink (too little contrast). Use navy on orange, white on pink-deep.</li>
      </ul>
    </main>
  );
}
