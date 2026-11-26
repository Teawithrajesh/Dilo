# DILO brand reference

`reference-concept.png` is the founder-approved logo concept (supplied 26 Nov 2026).
Phase 1 Step 2 reproduces it faithfully as clean SVGs. No new direction.

## Built in Step 2 (revised)
The founder asked for **one** logo, exactly as in the concept. So the logo is cut directly from `reference-concept.png` with its background removed:
- `public/brand/dilo-logo.png` (865 × 268) — the only logo. Use on white or light backgrounds.
- `public/brand/dilo-symbol.png` — symbol only, used for favicons.
- `public/icons/` — app icons: navy square + concept symbol + "DILO" in Plus Jakarta Sans 800 (as in the concept's App Icon tile).
- Colours: `brand/tokens.json`, mirrored in `app/globals.css`; `npm run test:contrast` checks them.

The first version (14 vector SVG variants) was removed at the founder's request; it is still in Git history (commit on `step2-brand`).

Limit: the logo is a raster image cut from a 1536 × 1024 concept, so it is sharp up to about 430 px wide on a phone. A vector redraw can be done later if large print is needed.

## Colour changes vs the blueprint (section 6)
The blueprint's proposed palette was replaced by colours sampled from the concept. Two blueprint label colours failed AA on white and were darkened:
- Trust green `#1F9D6B` (3.45:1) → `#157A52` (5.33:1)
- Caution amber `#B7791F` (3.64:1) → `#8A5A12` (5.91:1)

The concept shows white text on an orange button. That is 2.3:1 and fails AA, so DILO uses **navy text on orange** (7.7:1).
