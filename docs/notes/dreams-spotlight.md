# Feature: "Dreams that came true" on the Home dashboard (26 Nov 2026)

Founder request: whenever someone's dream wish comes true, it should flash on the dashboard, regularly.

- Home shows **✨ Dreams that came true**: one card at a time, newest first, moving to the next every 4 seconds with a soft gold **flash** and a light **shine** sweeping across. Dots show how many there are. Tapping the card opens the event.
- Includes wishes marked **Covered** ("Wish came true 🎉") and celebrations that **reached their goal** ("Goal reached 🎉"). A dream that just came true jumps to the front.
- **Privacy**: only dreams from your own communities. Newcomers and non-members see none.
- **Accessibility**: a **Pause/Play** button (moving content must be stoppable); if the phone asks for reduced motion it doesn't move or flash; screen readers aren't interrupted while it plays.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **180/180 pass** (adds: newest first + opens event, moves every 4 s, Pause/Play, still with reduced motion, newcomer sees none, covered wish jumps to front, goal reached shows) |

Tests now find community links by a stable id (`community-link`), because the spotlight card also mentions the community name.
