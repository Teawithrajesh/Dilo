# DILO

**Together, We Make Dreams Come True.** A private community app where families and friends plan events, share wishlists and record contributions.

Status: **Phase 1 prototype**, demo data only. No real accounts, no database, no payments.

## View it on an Android phone (Termux)
The `preview/` folder holds the ready-built site, so the phone never compiles anything.

```
cd ~/Dilo && git pull
node scripts/serve.mjs preview
```
Then open http://localhost:8080 in Chrome. Stop with Ctrl+C.

## Develop (Claude's workspace)
```
npm install
npm run build            # static export to out/
npm run preview:update   # build and refresh preview/
npm test                 # Playwright tests (phone + desktop) on preview/
npm run test:contrast    # colour contrast check
npm run test:secrets     # fails if anything that looks like a secret is in git
```

## Secrets and keys (read before deploying)
- **No secrets live in this repo.** DILO is a static site with no server code, so there is no safe place for a secret key. Server-side secrets (Supabase `service_role` / `sb_secret_`, Stripe secret, OAuth client secrets, JWT secrets, SMTP/OpenAI/etc.) must never be added here.
- **Anything prefixed `NEXT_PUBLIC_` is built into browser code.** Only public-safe values may use it. See `.env.example`.
- The **Supabase publishable key** in `config/public-supabase.json` is public by design. It is safe only because **Row Level Security is on for every table** and visitors may only INSERT (`supabase/migrations/`). If you add a table, enable RLS before the site uses it. Env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` override the file.
- `npm run preview:update` **refuses to build** with a secret/service key, and the app ignores one at runtime.
- `.env` and `.env.*` are git-ignored (only `.env.example` is committed).
- ⚠️ **If a secret is ever committed by mistake, rotate it immediately** (create a new key, delete the old one in the provider's dashboard). Deleting the file is not enough: the old value stays in git history. A scan of the full history on 28 Nov 2026 found no secrets.

## Docs
- `docs/notes/` — step reports
- `docs/brand/` — logo reference and colours
- `docs/learning/` — beginner notes (Hindi)
