# CLAUDE.md — DILO

- Owner is a beginner on an Android phone (Termux). Reply in simple Hindi (Devanagari) with English technical terms.
- Phase 1 = clickable prototype on **demo data only**. Plan: the "DILO Phase 1 Blueprint" doc. Steps 0–7, one branch each, owner approves each step before the next.
- Never push to `main`; owner merges PRs. Never commit secrets or `.env`.
- Phone never compiles: after UI changes run `npm run preview:update` and commit `preview/`.
- Contributions are record-only: never say DILO "received", "paid" or "verified" money. No payment features.
- Keep the "DEMO DATA" banner on every in-app screen.
- New phone scripts need owner approval before first run. Never touch the owner's other Termux projects.
- Report test results honestly.
- Brand: one logo only (`public/brand/dilo-logo.png`: symbol + "DIL" white + gradient "O"). On the splash, tapping the O opens `/welcome/` (founder's choice). Premium navy style; no amateur-looking cards or buttons.
- Tests: `npm run preview:update && npm test` (Playwright, phone + desktop) and `npm run test:contrast`.
- Two builds (`npm run preview:update`): `preview/` (phone + tests, everything on-device) and `site/` (dilowish.com via Cloudflare Workers, feedback + early access go to Supabase). Commit both. Tests fake Supabase; they never write to the real database.
- Supabase: insert-only tables `feedback`, `early_access` (RLS on). Only the public publishable key is in the repo (`config/public-supabase.json`); never add the secret/service key.
