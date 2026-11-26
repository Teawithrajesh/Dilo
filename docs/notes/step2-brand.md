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

## Revision 2 (26 Nov 2026): the app icon is the brand logo; premium splash
Founder feedback: keep the app-icon design as the only brand logo, don't make it look like a button, make the app look premium.
- `public/brand/dilo-logo.png`: the app-icon design (symbol + white "DILO") on a transparent background, so it sits on the navy page without a box.
- Home: full-screen navy splash with soft glows from the logo colours, logo, tagline, "Dream · Share · Support · Celebrate". Removed the brand-guide button, the step card and the `/brand/` page.
- DEMO DATA banner kept on every screen (acceptance check) but quieter: 32 px, small text.
- Manifest background is navy, so the Android splash matches.

| Re-check (Pixel 7 emulation) | Result |
|---|---|
| Build | Pass |
| Contrast | 16/16 pass |
| Logo loads, no failed requests, no console errors | Pass |
| No horizontal or vertical scroll on the splash | Pass |
| Chromium installability errors | None |

## Revision 3 (26 Nov 2026): smooth infinity, open "O"
Founder feedback: smooth the infinity; make the "O" in DILO slightly open (ring not closed).
- Symbol edges: colour decontamination (edge pixels take colour from the solid interior, removes the light fringe), 6× upscale, smoothed anti-aliased alpha.
- "O": a 24° gap cut at about 1 o'clock.
- Logo and all app icons/favicons rebuilt from the same source; tagline now balanced (no lone "True.").

| Re-check (Pixel 7 emulation) | Result |
|---|---|
| Build | Pass |
| Logo loads, no failed requests, no console errors | Pass |
| No scroll on the splash | Pass |
| Chromium installability errors | None |

## Revision 4 (26 Nov 2026): round gradient O, softer and smoother symbol
Founder feedback: keep the O fully round and give it a colour that matches the logo; smooth the symbol; its colours were too harsh.
- "O": fully round again, filled with a pink `#FD2E7A` → orange `#FF9A1F` gradient (the two people-dot colours).
- Symbol: smoother outline (stronger alpha smoothing), softer shading (masked colour blur 55%), slightly lower saturation (−5%) and contrast (−8%), deep shadows lifted.
- Logo and all app icons/favicons rebuilt.

| Re-check (Pixel 7 emulation) | Result |
|---|---|
| Build | Pass |
| Logo loads, no failed requests, no console errors | Pass |
| No scroll on the splash | Pass |
| Chromium installability errors | None |
