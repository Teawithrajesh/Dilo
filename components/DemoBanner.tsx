// Shown on every screen of the Phase 1 prototype (acceptance check: "Honesty"). Kept quiet so it doesn't fight the design.
export function DemoBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex h-8 items-center justify-center bg-navy text-tiny font-semibold tracking-wide text-white/80"
    >
      DEMO DATA · Prototype only, nothing is saved
    </div>
  );
}
