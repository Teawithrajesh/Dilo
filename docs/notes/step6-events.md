# Step 6: event flows — test report (26 Nov 2026)

Built (demo data, this browser tab only):
- **Wishlist** on every event: name, estimated cost (whole rupees), priority (High/Medium/Low), optional "where to buy" link. The **organiser** (the person who created the event, or the community owner/admin) can add, edit, move up/down and mark **Covered**; members only see it.
- **Record a contribution**: amount (whole rupees, required), optional wish, optional message, **"Show as Anonymous to others"**. Copy makes clear people give outside DILO (cash, UPI, bank) and "DILO never handles money".
- **Honest labels**: every record is **Self-reported** until the organiser taps **Confirm** → **Confirmed by organiser**. The contributor can remove their own record only while it is self-reported.
- **Anonymous rule** (founder decision): only the contributor and the organiser see the name; everyone else sees "Anonymous".
- **Progress** is always the sum of the records; seeded sample records add up to the earlier totals.
- **Celebration**: when the goal is reached, the event shows "The dream came true!", every member is notified once, and the feed gets a milestone.
- **Notifications**: organisers hear about new records; contributors hear when theirs is confirmed.
- **Activity feed** on each community page: new celebrations, wishes, records (respecting anonymity), covered wishes, new members, goals reached. Items open their event.

| Check | Result |
|---|---|
| `npm run build` | Pass |
| `npm run test:contrast` | 16/16 pass |
| `npm test` (Playwright, phone + desktop) | **138/138 pass** |
| Organiser: add (validated), edit, reorder, mark covered | Pass |
| Members can't change the wishlist | Pass |
| Record: amount required, Self-reported, progress up; remove own record | Pass |
| Anonymous: contributor sees own name, other member sees "Anonymous", organiser sees name and confirms, contributor notified | Pass |
| Seeded anonymous record hidden from members, visible to organiser | Pass |
| Goal reached → banner, notification to all, feed milestone | Pass |
| Feed item opens the event | Pass |
| No "donate now / verified by DILO / payment received / paid via DILO" | Pass |
| Event page with forms open: no side-scroll, 44 px targets | Pass |

Found and fixed while testing: the "Add wish" form stayed open after adding.
