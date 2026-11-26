# Step 2: brand — test report (26 Nov 2026)

Built: logo set (14 SVGs) reproduced from `docs/brand/reference-concept.png`; PNG app icons and favicons; colour tokens with a contrast checker; self-hosted fonts (Inter, Plus Jakarta Sans via @fontsource, work offline); `/brand/` guide page; home page now shows the primary logo.

| Check (Claude's workspace, Pixel 7 emulation) | Result |
|---|---|
| `npm run build` | Pass (4 static routes) |
| `npm run test:contrast` | 16/16 pairs pass WCAG AA |
| Logo on home loads | Pass |
| All 8 logos on `/brand/` load | Pass |
| Fonts load (no internet needed) | Pass |
| Horizontal scroll at phone width | None |
| Tap targets under 44 px | 0 |
| Chromium installability errors | None |
| Console errors / failed requests | None |

Owner checks (phone): logo matches the concept; new home-screen icon after reinstall.

Known differences from the concept: flat vector, no 3D shine; the infinity is a symmetric ribbon. Adjustable in `scripts/brand/build_logos.py`.

## Revision 1 (26 Nov 2026): one logo, exactly like the concept
Founder feedback: "Itne logo nahi chahiye… ek decent logo chahiye." Chosen option: **exactly like the concept image**.
- Removed the 14 SVG variants and their generator.
- Logo = the concept's own logo, cut out with background removed. App icons rebuilt from the concept symbol.
- `/brand/` now shows one logo, the app icon, colours, buttons and type.

| Re-check (Pixel 7 emulation) | Result |
|---|---|
| Build | Pass |
| Contrast | 16/16 pass |
| Logo + icon load, no failed requests, no console errors | Pass |
| No horizontal scroll; tap targets ≥ 44 px | Pass |
| Chromium installability errors | None |
