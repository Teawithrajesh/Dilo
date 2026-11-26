import Link from "next/link";
import { Glows } from "@/components/landing/Glows";

// Splash. Tapping the "O" in DILO opens the app (the founder's choice).
// O position inside dilo-logo.png (percent of width/height), measured from the image.
const O_BOX = { left: 62.9, top: 74.8, width: 27.3, height: 25.1 };

export default function Splash() {
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center overflow-hidden bg-navy px-4 text-center text-white">
      <Glows />
      <div className="relative">
        <div className="relative mx-auto w-48 sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="h-auto w-full" />
          <Link
            href="/welcome/"
            aria-label="Enter DILO"
            className="o-hotspot absolute rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{
              left: `${O_BOX.left}%`,
              top: `${O_BOX.top}%`,
              width: `${O_BOX.width}%`,
              height: `${O_BOX.height}%`,
            }}
          />
        </div>
        <p className="mt-8 text-balance font-display text-[1.0625rem] font-semibold tracking-tight text-white/90 sm:text-heading">
          Together, We Make Dreams Come True.
        </p>
        <p className="mt-3 text-small text-white/60">Dream · Share · Support · Celebrate</p>
        <p className="mt-14 text-tiny uppercase tracking-[0.2em] text-white/60">Tap the O to begin</p>
      </div>
    </main>
  );
}
