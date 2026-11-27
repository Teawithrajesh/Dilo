# Supabase connected for the live site (27 Nov 2026)

Founder asked: "Supabase tables bana do".

- **Applied** migration `0001_feedback_and_early_access` to project `ieaczkseiggwyaetjcdd` (Singapore, free plan).
- **Security self-test as the public role (anon)**, all inside rolled-back transactions (tables left empty):
  | Try | Result |
  |---|---|
  | Insert feedback / early access | Allowed ✓ |
  | Read feedback | **permission denied** ✓ |
  | Delete feedback | **permission denied** ✓ |
  | Invalid email | Rejected by a check rule ✓ |
  | Supabase security advisor | **0 warnings** ✓ |
- **Two builds**: `preview/` (phone/tests, on-device only) and `site/` (live; Cloudflare now serves `./site`). The live build uses the public publishable key from `config/public-supabase.json`; the secret key is never in the repo.
- Live admin page shows a link to the Supabase Table Editor (feedback / early_access).
- **Tests**: a second test server serves `site/` with Supabase faked (`tests/live-site.spec.ts`): correct table, payload, publishable key in `apikey` only, 409 → "already on the list", offline → clear message and retry. They never touch the real database.

| Check | Result |
|---|---|
| `npm test` (phone + desktop) | **252/252 pass** |
| `wrangler deploy --dry-run` | Reads the `site/` folder, no errors |

After merge: Cloudflare redeploys; send one test feedback on the live site and check it in Supabase → Table Editor → feedback.
