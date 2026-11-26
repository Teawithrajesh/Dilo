// Step 2 placeholder home. The real landing page arrives in Step 3.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center px-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-primary-light.svg" alt="DILO — Together, We Make Dreams Come True." className="w-72" />
      <p className="mt-8 rounded-xl bg-white px-4 py-3 text-small text-slate shadow-sm">
        Phase 1 · Step 2: brand. The landing page and app screens come in the next steps.
      </p>
      <a
        href="/brand/"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-orange px-6 font-display font-bold text-navy"
      >
        See the brand guide →
      </a>
    </main>
  );
}
