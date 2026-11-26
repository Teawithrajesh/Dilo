# DILO — Phase 1 report (26 Nov 2026)

**Status:** Phase 1 prototype complete (Steps 0–7), pending the founder's final approval.
**What it is:** a clickable, installable web app (PWA) on **demo data only**. No real accounts, no database, no payments. Everything resets on refresh, except the chosen demo person.
**Cost so far:** ₹0. No paid service was used.

## Steps

| Step | What was built | Tests at the end |
|---|---|---|
| 0 | Repo, Termux check (Node 24, aarch64), logo concept | — |
| 1 | Next.js static export, PWA, offline page, phone server script | build + install check |
| 2 | One brand logo from the concept (smooth symbol, gradient O), icons, colour tokens, fonts | contrast 16/16 |
| 3 | Splash with a raised "O" key (chime + vibration), 10-section landing page, 4 themed celebrations | 44 |
| 4 | Demo sign-in (4 people), onboarding, 4 tabs, role-aware screens, premium theme pages, roadmap | 72 |
| 5 | Invites (WhatsApp, 7-day links), approve/reject, roles, community cover + photo, link previews, celebrations notify every member | 120 |
| 6 | Wishlist, contribution records, Self-reported/Confirmed, anonymous rule, goal celebration, activity feed | 138 |
| 7 | Profile edit, privacy settings, report/block, moderation, platform admin, accessibility, speed | **160** |

## Acceptance checks (blueprint section 8)

| Area | Check | Result |
|---|---|---|
| Landing | Both CTAs go to the right place; every link works | ✅ automated |
| Landing | Loads in under 3 s on 4G | ✅ ≈2.3 s (emulated 4G + 4× slower CPU) |
| PWA | "Add to Home screen" on Android; full-screen with DILO icon; offline notice | ✅ automated + founder's phone |
| Create community | Empty name blocked; private by default; appears on dashboard | ✅ automated |
| Invite & join | Newcomer sees only name + cover; request reaches owner/moderator; approve/reject; revoked link stops working | ✅ automated |
| Roles | Member can't approve/remove; moderator can approve but not remove the owner; last owner can't leave | ✅ automated |
| Event | Required fields; whole rupees; future date | ✅ automated (visibility per event: not built — every member of a community sees its celebrations) |
| Wishlist | Add, edit, reorder, mark covered | ✅ automated |
| Contributions | Self-reported first; only organiser confirms; anonymous hides the name; no "received/paid/verified by DILO" | ✅ automated |
| Feed & notifications | Each action creates the right feed item / notification; non-members get nothing | ✅ automated |
| Accessibility | WCAG AA contrast; 44 px tap targets; screen-reader names | ✅ automated (axe, 16 screens) · TalkBack on a real phone: **owner check pending** |
| Honesty | DEMO DATA banner on every screen | ✅ automated |

## Not done / known limits
- **Real use**: no real login, database, image storage or hosting (Phase 2).
- **WhatsApp link preview image** works only once DILO is on a public address.
- **Per-event visibility** (hide an event from some members) was not built.
- **Points / 7-day streak** and **milestone wishes**: in the roadmap only.
- **Validation interviews** (blueprint section 8: 5–10 families) have **not** been done yet. This is the most important next step before Phase 2.

## Recommended next steps
1. Show the prototype to 5–10 families (on your phone) and note: would they invite relatives? Can they create a community + celebration + wish in under 5 minutes without help? What does DILO do that WhatsApp + a spreadsheet doesn't?
2. Decide the open questions in `docs/roadmap.md` (city, amounts visible or totals only, Hindi, email vs phone OTP).
3. Then plan Phase 2 (real login with Supabase, private photo storage, hosting, privacy policy reviewed by a lawyer). Costs must be estimated and approved first: Supabase Pro ~$25/month and Vercel Pro ~$20/month once it's a commercial pilot (blueprint section 11).
