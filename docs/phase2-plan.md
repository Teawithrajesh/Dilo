# DILO — Phase 2 plan: Pilot MVP (draft for approval, 26 Nov 2026)

**Goal:** turn the Phase 1 prototype into a real app for a **private pilot with 5–10 families (≤ 50 people)**: real sign-in, real database, real photos, a public web address, and the welcome email. Still **no payments** — DILO only records gifts given outside it.

**Rule for this phase:** nothing paid, no database change and nothing sent to the outside world without the founder's approval for that specific step. Costs are recorded in `docs/COSTS.md`.

## 0. Before building: validate (recommended first)
The Phase 1 blueprint says: show the prototype to 5–10 families and check three things. If they fail, change the product before Phase 2.
1. At least 7 of 10 would invite relatives to a private DILO community.
2. At least 6 of 10 create a community, a celebration and a wish in under 5 minutes without help.
3. At least half can say what DILO does that WhatsApp + a notebook doesn't.

Steps 1–2 below cost nothing and can start in parallel; real families should only be invited after this check.

## Key technical choice
Keep the app a **static site** (as in Phase 1) and talk to Supabase directly from the browser with the public "anon" key. Security lives in the database: **Row Level Security** on every table, and sensitive actions (approve, change role, confirm a contribution, moderation) as **database functions that check the caller's role**. The secret service key never goes into the app or Git.
Why: free hosting, no server to run, the phone can still serve it, and the database — not the screens — decides who sees what.

## Steps (one branch each, test report, founder approval)

| Step | What gets built | Cost | Needs approval for |
|---|---|---|---|
| 1. Decisions & accounts | Founder decisions below; rename the existing Supabase project (Singapore) to DILO; hosting account | ₹0 | Each account the founder creates |
| 2. Database design + security tests | 15 tables from the blueprint, RLS "deny by default", database functions, numbered migrations in Git; automated tests that an outsider sees **zero rows** | ₹0 | **Applying migrations to the real project** |
| 3. Real sign-in | Email one-time code / magic link (Supabase Auth, free); consent screen (terms + privacy); 18+ check; sign-out | ₹0 (email) | Custom email sender (step 7) |
| 4. Communities for real | Create, invite links (random tokens stored hashed, 7-day expiry), join requests, roles, last-owner rule — all enforced by the database | ₹0 | — |
| 5. Celebrations for real | Events, wishlist, contribution records, Self-reported/Confirmed, anonymous rule, notifications, feed, dreams spotlight | ₹0 | — |
| 6. Photos | Private storage buckets (avatars, community covers, event photos, invitations), short-lived signed links, 5 MB limit, images shrunk on the phone before upload | ₹0 within free storage | — |
| 7. Email | The founder's welcome letter (already written) sent on sign-up; sign-in codes through the same sender; reply-to = founder's inbox | ₹0 on a free tier | **Sending email to real people**; domain for the sender |
| 8. Safety & law | Privacy policy + terms (India's DPDP Act 2023: consent, withdrawal, deletion, breach reporting, grievance contact), real data export/delete, report/block/moderation, admin dashboard that can't read private content | Lawyer review: **quote needed** | Lawyer cost; publishing the policy |
| 9. Hosting + pilot launch | Public address, link previews (WhatsApp image), feedback form, invite the 5–10 families | See costs | **Going live** and **upgrading the database plan** |

Each step: Playwright tests on phone + desktop (as in Phase 1) plus database security tests; nothing merges without passing.

## Costs (checked 26 Nov 2026 — confirm on the providers' pages before paying)

| Item | Choice | Cost | When |
|---|---|---|---|
| Database, sign-in, storage | Supabase **Free** while building | ₹0 (500 MB DB, 1 GB files, 50,000 monthly users; **pauses after 1 week without use**) | Steps 2–8 |
| | Supabase **Pro** for the pilot (doesn't pause, daily backups, spend cap on by default) | **$25/month ≈ ₹2,200** (usage above the included amounts is extra) | From step 9 |
| Hosting | Cloudflare Pages Free (500 builds/month). *Vercel Hobby is for non-commercial use only.* Check Cloudflare's terms for commercial use before launch. | ₹0 | Step 9 |
| Email | Resend Free: about 3,000 emails/month, 100/day | ₹0 | Step 7 |
| Domain (e.g. for the email sender and the app address) | Any registrar | ≈ ₹1,000–1,500/year | Step 7 |
| Phone OTP sign-in (optional, later) | e.g. MSG91 | ≈ ₹0.15–0.25 per OTP + DLT registration | Not in the pilot |
| Lawyer (privacy policy + terms) | — | Get 2–3 quotes | Step 8 |
| **Total** | | **₹0 while building; ≈ ₹2,200/month + domain once the pilot starts** (+ lawyer, one-time) | |

## Decisions needed from the founder
1. **Validation first?** Do the 5–10 family check before inviting anyone for real (recommended: yes).
2. **Sign-in**: email code (free, recommended for the pilot) or phone OTP (families like it, costs per SMS + DLT).
3. **Hosting**: Cloudflare Pages Free (recommended) — the founder creates the account.
4. **Domain name** for DILO (needed for the email sender and a proper address).
5. **Supabase plan**: Free while building, **Pro ($25/month) from the pilot** — approve when we reach step 9.
6. **Email provider**: Resend Free (recommended) — approve before the first real email.
7. **Lawyer** for the privacy policy and terms — the founder chooses after quotes.
8. Product questions from the roadmap: amounts visible to all or totals only? Hindi at launch?

## Not in Phase 2
Payments of any kind, points/streaks, milestone wishes, ads, vendor marketplace, native Android/iOS apps.
