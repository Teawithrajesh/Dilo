// Home (until the landing page arrives in Step 3): a calm splash in the style of the concept.
export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center overflow-hidden bg-navy px-4 text-center text-white">
      {/* Soft colour glows from the logo's palette */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-pink/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-orange/15 blur-3xl" />
      </div>

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={709} className="mx-auto h-auto w-48 sm:w-56" />
        <p className="mt-8 text-balance font-display text-[1.0625rem] font-semibold tracking-tight text-white/90 sm:text-heading">
          Together, We Make Dreams Come True.
        </p>
        <p className="mt-3 text-small text-white/60">Dream · Share · Support · Celebrate</p>
      </div>
    </main>
  );
}
