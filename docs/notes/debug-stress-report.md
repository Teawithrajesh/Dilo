# Debugging & stress test report (27 Nov 2026)

## 1. Debugging sweep
| Check | Result |
|---|---|
| TypeScript, strict mode | 0 errors |
| Production build | 0 warnings |
| Every page × every demo person (guest + 5 people, 32 pages) | 0 page errors, 0 failed requests |
| Internal links (35 unique) | 0 broken |
| Damaged saved data (garbage text, wrong shape, negative/huge numbers) | **2 crashes found → fixed** (Sparkles page, admin feedback list now validate stored data) |
| Unknown demo person in the session | Sent to sign-in ✓ |
| Storage blocked (private mode) | App works, nothing crashes ✓ |
| Storage full when sending feedback | Clear message ✓ |
| Code-like text (`<img onerror=…>`) in names | Shown as text, never runs ✓ |
| Unknown address (404) | Was a plain unbranded page → **now a DILO "page not found" with a way back** |

## 2. Stress tests
### Server (the phone's preview server), 50 users at the same time for 10 s
| Page | Requests | Per second | Avg time | Errors |
|---|---|---|---|---|
| Splash `/` | 73,709 | ~6,700 | 7 ms | 0 |
| Landing `/welcome/` | 58,552 | ~5,900 | 8 ms | 0 |
| Logo image (150 KB) | 4,489 | ~450 | 119 ms | 0 |
(Measured on Claude's workspace; a phone is slower, but this is far beyond one or two people.)

### App under load (one session, phone size)
| Test | Result |
|---|---|
| 25 new communities (names with emoji + Hindi) | Fine; list of 26 opens in ~70 ms |
| 30 celebrations with 300-character wishes | Fine |
| 60 wishes + 120 contributions on one event | Fine; a tap still answers in ~80 ms |
| 200 tab switches | ~100 ms each; JS memory 6.4 → 7.1 MB (no leak) |
| Budget above ₹1 crore | Refused (validation works) |
| 6 MB photo | Refused with a message |
| 40 photo changes in a row | Fine |
| 8 rapid taps on the O | Opens once, no errors |
| Slow phone (6× CPU) + slow network (1.6 Mbps, 150 ms) | Page visible in 0.2–0.4 s; fully loaded in 4.6–5.8 s |

### Double-tap safety — **bugs found and fixed**
A quick double-tap fired the same action twice before the screen updated:
| Action | Before | After |
|---|---|---|
| Add wish | 2 wishes | 1 |
| Record contribution | 2 records (wrong total) | 1 |
| Create invite link | 2 links | 1 |
| Create community | duplicate | 1 |
| Approve member | member added twice | 1 |
| Send feedback | saved twice | 1 |
| Mark covered | flipped back | stays covered |
Fix: the same action with the same details within 1 second runs once (store-level guard for every action, plus the feedback form). Only successful actions are remembered, so fixing an error and sending again right away still works (a regression the tests caught during the fix).

## 3. Notes for Phase 2
- Full load on a slow network is mostly fonts, the logo and app code (~0.9 MB). Hosting on a CDN with compression (e.g. Cloudflare) should cut this a lot; the phone's local server doesn't compress (not needed on the phone).
- In Phase 2 the database must also refuse duplicates (unique keys, idempotent database functions), not only the screens.

## Tests
`npm test`: **232/232 pass** (phone + desktop), including new `tests/robustness.spec.ts` (damaged/blocked/full storage, code-like text, 404, double-taps).
