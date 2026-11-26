// Soft colour glows from the logo palette. Purely decorative.
export function Glows({ variant = "hero" }: { variant?: "hero" | "soft" }) {
  const strong = variant === "hero";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet blur-3xl ${strong ? "opacity-30" : "opacity-15"}`} />
      <div className={`absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-pink blur-3xl ${strong ? "opacity-20" : "opacity-10"}`} />
      <div className={`absolute -bottom-32 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-orange blur-3xl ${strong ? "opacity-15" : "opacity-10"}`} />
    </div>
  );
}
