import { Glows } from "@/components/landing/Glows";
import { OButton } from "@/components/OButton";

// Splash. The "O" in DILO is a raised key: press it to open the app (the founder's choice).
// O position inside the logo image (percent of width/height), measured from the image.
const O_BOX = { left: 62.91, top: 74.75, width: 27.63, height: 25.25 };

export default function Splash() {
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center overflow-hidden bg-navy px-4 text-center text-white">
      <Glows />
      <div className="relative">
        <div className="relative mx-auto w-52 sm:w-60">
          {/* Logo without its O; the O is the key on top. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dilo-logo-dil.png" alt="DILO" width={666} height={705} className="h-auto w-full" />
          <OButton
            href="/welcome/"
            style={{ left: `${O_BOX.left}%`, top: `${O_BOX.top}%`, width: `${O_BOX.width}%`, height: `${O_BOX.height}%` }}
          />
        </div>
        <p className="mt-8 text-balance font-display text-[1.0625rem] font-semibold tracking-tight text-white/90 sm:text-heading">
          Together, We Make Dreams Come True.
        </p>
        <p className="mt-3 text-small text-white/60">Dream · Share · Support · Celebrate</p>
        <p className="mt-14 text-tiny uppercase tracking-[0.2em] text-white/60">Press the O to begin</p>
      </div>
    </main>
  );
}
