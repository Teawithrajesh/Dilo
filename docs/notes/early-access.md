# Option B: demo online + early-access list (27 Nov 2026)

Founder chose **B**: put the demo online, let people join an early-access list (with consent), and send feedback straight to the founder.

## Built
- **`/early-access/`**: email (required, validated, max 254), name and city (optional), consent tick box (18+, purpose, can delete any time, link to the notice). Thank-you screen; "already on the list" for a repeat email (case-insensitive). Double-tap safe.
- **`/privacy/`**: plain-language notice (what, why, where — Supabase Singapore, who — founder only, how long, your rights under India's DPDP Act 2023, 18+). Contact: **hello@dilowish.com** (Cloudflare Email Routing → the founder’s DILO-only Gmail, which is never shown on the site; override with `NEXT_PUBLIC_CONTACT_EMAIL`). To be reviewed by a lawyer before real accounts.
- Entry points: landing final section ("Get early access" + "Try the demo"), footer (Early access · Privacy), sign-in page ("Want your own real account?").
- **Feedback + early access go to Supabase when configured** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`); otherwise they stay on the device (as before).
- **Database (not applied yet — needs approval)**: `supabase/migrations/0001_feedback_and_early_access.sql` — two tables, Row Level Security on, **insert-only** for visitors (no read/update/delete), size and format checks, consent must be true, one entry per email.
- The site asks search engines not to list it (`noindex`) while it's a demo.

## Still to do (with approvals)
1. Apply the migration to the founder's Supabase project.
2. Founder creates a free Cloudflare Pages project linked to the GitHub repo; set the env values there.
3. Choose the contact email for the privacy notice (optional).

| Check | Result |
|---|---|
| `npm test` (phone + desktop) | **242/242 pass** (adds early-access + privacy tests; a11y audit covers both pages) |
