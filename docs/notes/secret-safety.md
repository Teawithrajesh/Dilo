# Secret safety pass — 28 Nov 2026

## What was checked
- Every tracked file (source, config, docs, tests, built `preview/` and `site/`) and the **full git history** for: Supabase secret/service_role keys and JWTs, Stripe keys, database URLs, OAuth/JWT secrets, AWS/GitHub/Slack/Google/OpenAI/SendGrid/Twilio keys, private keys.
- All `NEXT_PUBLIC_` variables (they reach the browser).
- `.gitignore` and `.env.example`; whether any `.env` file was ever committed.
- `console.*` calls and error handling (`lib/remote.ts`).
- Live Supabase project: Row Level Security, policies, grants, security advisor.

## Findings
| What | Where | Secret? | Action |
|---|---|---|---|
| Supabase project URL | `config/public-supabase.json`, built into `site/` | No (public address) | Kept. Env var `NEXT_PUBLIC_SUPABASE_URL` now overrides it. |
| Supabase **publishable** key `sb_publishable_…` | `config/public-supabase.json`, built into `site/` (3 files), git history (4 times) | No — public by design; safe because RLS is on and visitors can only INSERT | Kept (decision recorded in `CLAUDE.md`). Env var `NEXT_PUBLIC_SUPABASE_ANON_KEY` now overrides it. No rotation needed. |
| Supabase secret / service_role key | — | — | **Not found** anywhere, incl. history. Build now refuses one; `lib/remote.ts` ignores one. |
| Stripe, DB URLs, OAuth/JWT secrets, other API keys | — | — | **None found**. DILO has no server code and no payments. |
| `.env` files | — | — | Never committed. `.gitignore` covers `.env` and `.env.*` (keeps `.env.example`). |
| Logs / responses | `scripts/*.mjs` console output; `lib/remote.ts` errors | — | Nothing prints a key or URL with credentials. Errors only say `server said <status>`, `duplicate` or `offline`. |

## Supabase check (live)
- `feedback`: RLS **on**; one policy: INSERT for `anon`, `authenticated`; column-level INSERT grants only (no SELECT/UPDATE/DELETE).
- `early_access`: same.
- Security advisor: **0 issues**.

## Added
- `npm run test:secrets` (`scripts/check-secrets.mjs`): scans tracked files; fails on anything that looks like a secret.
- Build guard in `scripts/build-all.mjs`; runtime guard in `lib/remote.ts`.
- `.env.example` lists every variable with placeholders and explains which are public.
- README section "Secrets and keys" with the rotation warning.
