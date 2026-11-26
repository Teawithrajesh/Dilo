# Step 4: app shell + demo data — test report (26 Nov 2026)

Built:
- **Demo sign-in** (`/signin/`): pick one of 4 sample people (Priya Owner, Amit Moderator, Neha Member, Ravi Newcomer). No account or password. The choice is kept for this browser tab only (sessionStorage); everything else resets on refresh.
- **Onboarding** (`/onboarding/`): Dream → Share → Support cards with Next / Skip / Get started. Shown once per tab.
- **App shell**: top bar (logo, page title, avatar) and bottom tabs Home · Communities · Notifications · Profile, with an unread badge. Signed-out visitors are sent to sign-in.
- **Home**: greeting, pending invites (newcomer sees name + cover only and can "Request to join"), my communities, upcoming celebrations.
- **Communities** list and **community page** (`/communities/sharma-family|delhi-friends/`): private wall for non-members; join-requests panel only for owner/admin/moderator; celebrations; members.
- **Notifications** with "Mark all read". **Profile** with roles and "Switch demo person".
- Demo data: `lib/demo/data.ts` (2 communities, 4 celebrations, 8 notifications). State: `lib/demo/store.tsx`. Display rules: `lib/permissions.ts` (the database decides in Phase 2).
- Landing "Create Your Community" and "Join" now go to demo sign-in; the old `/join/` placeholder is removed.

| Check | Result |
|---|---|
| `npm run build` | Pass (16 pages) |
| `npm run test:contrast` | 16/16 pass |
| `npm test` (Playwright, phone + desktop) | **66/66 pass** |
| Signed-out → sign-in on every app page | Pass |
| 4 demo people; onboarding 3 cards | Pass |
| Bottom tabs navigate and mark the active tab | Pass |
| Owner + Moderator see join-requests panel; Member doesn't | Pass |
| Newcomer sees only the invite; private wall on the community; no event names leak | Pass |
| Ravi requests → switch to Priya → 1 request waiting | Pass |
| Unread badge clears with Mark all read | Pass |
| App screens: banner, no side-scroll, 44 px targets, no console errors | Pass |

Not in this step: approving/rejecting requests, inviting, roles changes (Step 5); event details, wishlist, contributions (Step 6); profile editing and privacy settings (Step 7).

## Revision 1 (26 Nov 2026): event cards open
Founder feedback: "koi bhi event khul nahi raha" — event cards were not tappable (event pages were planned for Step 6).
- Every event card now opens `/events/<id>/` in its celebration theme (Birthday/Engagement/Wedding/Anniversary background): title, date, community, days to go, progress (self-reported, "DILO never handles money"), photo frame, invitation-card frame, dream wish, estimated budget.
- Non-members see a private wall. Wishlist and contributions remain for Step 6.

| Check | Result |
|---|---|
| Build | Pass (20 pages) |
| `npm test` (phone + desktop) | **72/72 pass** (adds: event card opens, every card opens and Back returns, Ravi can't open a private event) |

## Revision 2 (26 Nov 2026): rich, premium theme pages
Founder feedback: theme pages should look like the world's best web apps — decent and rich.
- Cartoon balloons/confetti replaced by a quiet luxury style (`components/celebrate/Theme.tsx`): per-theme base colour, soft aurora light, vignette, film grain, and **fine gold line-art** behind the title (birthday sparkle constellation, engagement interlocked rings, wedding mandala, anniversary intertwined hearts).
- **Cormorant Garamond** serif (self-hosted, @fontsource) for titles, taglines, the dream quote and amounts. Gold small-caps eyebrows and line-diamond dividers.
- **Keepsakes**: photo frame (birthday circle, engagement/anniversary oval, **wedding arch / jharokha**) and an ivory **invitation card** ("You are invited / Your invitation"), each with a double gold hairline, slight tilt and deep shadow.
- Event page: gold-lined **progress ring**, frosted panels, dream wish as a serif quote.
- Fix: base CSS moved into `@layer base` so utility classes (like `font-serif`) can override heading fonts.
- Old cartoon decoration code removed; tile icons kept in `CelebrationIcon.tsx`.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **72/72 pass** |
| Contrast of new theme text (gold on theme base 11.6–13.1:1; ivory card text 5.8–10.3:1) | Pass (AA) — one card label darkened from 4.38:1 to 5.76:1 |
