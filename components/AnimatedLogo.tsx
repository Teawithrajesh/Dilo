// The splash logo, built from its pieces so it can assemble itself once (about 1.6 s):
// the infinity draws in, the two people settle on top, the star twinkles, "DIL" rises,
// and the O (the button) pops in last. The O can be pressed at any time.
// Positions are percentages of the full logo (666 × 705), measured from the image.
const pieces = [
  { src: "/brand/anim/infinity.png", cls: "logo-draw", left: 0.0, top: 18.298, width: 100.0, w: 666, h: 324 },
  { src: "/brand/anim/dot-left.png", cls: "logo-drop logo-drop-1", left: 20.42, top: 1.418, width: 17.868, w: 119, h: 118 },
  { src: "/brand/anim/dot-right.png", cls: "logo-drop logo-drop-2", left: 63.363, top: 1.418, width: 18.168, w: 121, h: 119 },
  { src: "/brand/anim/star.png", cls: "logo-twinkle", left: 43.243, top: 0.0, width: 15.616, w: 104, h: 111 },
  { src: "/brand/anim/dil.png", cls: "logo-rise", left: 9.459, top: 74.752, width: 52.703, w: 351, h: 178 },
];

export function AnimatedLogo() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "666 / 705" }} role="img" aria-label="DILO">
      {pieces.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.src}
          src={p.src}
          alt=""
          width={p.w}
          height={p.h}
          draggable={false}
          className={`absolute h-auto select-none ${p.cls}`}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.width}%` }}
        />
      ))}
    </div>
  );
}
