# Feature: splash logo animation, option A "the dream comes together" (26 Nov 2026)

Founder asked how an animated logo on the first page would look; chose option A.

- The logo is split into pieces (`public/brand/anim/`: infinity, two people, star, "DIL"), cut from the existing logo image with exact positions.
- Plays **once** on load, about **1.6 s**:
  1. 0.1–1.05 s: the infinity is revealed left to right, like being drawn.
  2. 0.78 / 0.88 s: the two people drop gently onto it.
  3. 1.05 s: the star twinkles once with a warm glow.
  4. 1.15 s: "DIL" rises in.
  5. 1.35 s: the O (the button) pops in, then keeps its soft breathing.
- The O can be pressed at any time, even during the animation.
- Reduced motion: no intro; the full logo shows at once.
- Weight: the pieces add up to about the same as the old single logo image (~190 KB).
- Limit: because the logo is a picture (not vector), the infinity is "revealed" by a moving edge, not traced along its curve. A true line-drawing needs a vector redraw of the logo.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **186/186 pass** (adds: all pieces load and the intro ends within 2 s, the O works immediately, reduced motion shows the full logo) |
