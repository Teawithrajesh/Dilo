import { Glows } from "@/components/landing/Glows";
import { OButton } from "@/components/OButton";
import { AnimatedLogo } from "@/components/AnimatedLogo";

// Splash. The "O" in DILO is a raised key: press it to open the app (the founder's choice).
// O position inside the logo image (percent of width/height), measured from the image.
const O_BOX = { left: 62.91, top: 74.75, width: 27.63, height: 25.25 };

export default function Splash() {
  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] flex-col items-center justify-center overflow-hidden bg-navy px-4 text-center text-white">
      <Glows />
      <div className="relative">
        <div className="relative mx-auto w-52 sm:w-60">
          {/* Logo without its O, assembling itself once; the O is the key on top. */}
          <AnimatedLogo />
          <OButton
            href="/welcome/"
            style={{ left: `${O_BOX.left}%`, top: `${O_BOX.top}%`, width: `${O_BOX.width}%`, height: `${O_BOX.height}%` }}
          />
        </div>
        <p className="mt-8 text-balance font-display text-[1.0625rem] font-semibold tracking-tight text-white/90 sm:text-heading">
          Together, We Make Dreams Come True.
        </p>
        <p className="mt-3 text-small text-white/60">Dream · Share · Support · Celebrate</p>
        {/* Same pink→orange as the O key, so people see which letter to press. */}
        <p className="mt-14 text-small font-bold uppercase tracking-[0.2em]" data-testid="press-hint">
          <span className="bg-gradient-to-r from-[#ff4f8f] to-orange bg-clip-text text-transparent">
            Press the <span className="text-[1.3em] font-extrabold">O</span> to begin
          </span>
        </p>
      </div>
    </main>
  );
}
