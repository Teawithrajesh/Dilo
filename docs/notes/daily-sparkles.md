# Feature: ✨ Daily Sparkles (27 Nov 2026)

Founder idea (inspired by a daily "collect" screen in another app): bring people back every day. Concept kept, look made DILO's own and premium. **What Sparkles are for is deliberately not decided** — the app only asks people to collect.

- **Sparkles** = the gold star from the DILO logo. Not "coins" or "points", and the app says plainly: "Sparkles aren't money and can't be bought, sold or exchanged."
- **7-day ladder**: Day 1 +10 · Day 2 +20 · Day 3 +30 · Day 4 +40 · Day 5 +50 · Day 6 +60 · **Day 7 +100 bonus**. One collect per calendar day. Miss a day → back to Day 1 (with a friendly note). After Day 7 a new week starts.
- **`/sparkles/`**: glowing star, balance that counts up, the ladder (done = gold ✓, today = glowing), **Collect +N Sparkles** button (burst of sparkles, chime, short vibration), then "Collected today ✓ · Next Sparkles in hh:mm:ss". **History** tab. A "Coming soon — Something special is on its way" card with no promises.
- **Daily nudge**: Home card "Collect today's +N Sparkles" with a 7-step bar; a ✨ balance chip in the top bar on every app screen; Profile → "✨ My Sparkles". The admin has none.
- Demo: Priya starts on a 3-day streak (1,240 Sparkles, today = Day 4).
- Storage: per person in this browser (Phase 1); database in Phase 2. Reduced motion: no glow/burst animations.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **210/210 pass** (adds: collect + countdown, next day +20 and saved after refresh, missed day resets, full week → +100 then a new week, Priya's demo streak, no money words, admin has none, layout; a11y audit covers `/sparkles/`) |

Found and fixed while testing: the top-bar balance didn't update after collecting (now every Sparkles view refreshes together).
