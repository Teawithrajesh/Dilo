# DILO brand reference

`reference-concept.png` is the founder-approved logo concept (supplied 26 Nov 2026).
Phase 1 Step 2 reproduces it faithfully as clean SVGs. No new direction.

## Built in Step 2
- Logo SVGs: `public/brand/` — primary, horizontal, symbol, app icon; each in light, dark, mono-black, mono-white. Text is outlined (no font needed).
- PNG icons: `public/icons/` — 192/512, maskable 192/512, apple-touch 180, favicon 32/48.
- Generator: `scripts/brand/build_logos.py` (Python + fonttools, Plus Jakarta Sans 800/600).
- Colours: `brand/tokens.json` (single source), mirrored in `app/globals.css`. `npm run test:contrast` checks every allowed pair against WCAG AA.
- Live guide in the app: `/brand/`.

## Colour changes vs the blueprint (section 6)
The blueprint's proposed palette was replaced by colours sampled from the concept. Two blueprint label colours failed AA on white and were darkened:
- Trust green `#1F9D6B` (3.45:1) → `#157A52` (5.33:1)
- Caution amber `#B7791F` (3.64:1) → `#8A5A12` (5.91:1)

The concept shows white text on an orange button. That is 2.3:1 and fails AA, so DILO uses **navy text on orange** (7.7:1).
