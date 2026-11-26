# Step 7: finish — test report (26 Nov 2026)

Built (demo data, this browser tab only):
- **Profile**: change photo (tap the camera), edit name (required, max 40) and a short intro (max 140). The new name shows everywhere, including to others.
- **Privacy & safety** (`/settings/`): **Anonymous by default** switch (pre-ticks new contribution records); **blocked people** list with Unblock; **Download my data** (a JSON file of what the demo holds about you); **Delete my account** (confirm; blocked for the only owner of a community; signs you out on the welcome page with a clear message).
- **Report**: on members, celebrations and contribution records. Reason required (spam, abuse, fake, private info, other) + optional note. Moderators are notified.
- **Block**: from a community's member list. Their messages are hidden from you; they aren't told.
- **Moderation** (`/moderation/`, owners/admins/moderators): open and closed reports per community, **Keep it up** or **Remove** (removes the record/celebration, or the member if your rank allows). The reporter is told the outcome.
- **Platform admin** (`/admin/`, new demo person "DILO Admin" = the founder): totals only (people, communities, celebrations, records), reports shown as short summaries, communities list with **Suspend / Restore** (members see "This community is paused"). The admin **cannot open private communities**; the page is closed to everyone else.
- **Accessibility**: automated axe audit (WCAG 2.1 A/AA) on 16 screens; fixed names for progress bars and the profile button, readable step numbers, and an ARIA label misuse.
- **Speed**: landing page on emulated "Regular 4G" (4 Mbps, 20 ms) with a 4× slower CPU: **≈2.2–2.3 s** to load (target: under 3 s). Page weight ≈1 MB (mostly fonts and the logo image).

| Check | Result |
|---|---|
| `npm run build` | Pass (23 pages) |
| `npm run test:contrast` | 16/16 pass |
| `npm test` (Playwright, phone + desktop) | **160/160 pass** |
| Profile: name required; name, intro, photo saved; others see the new name | Pass |
| Anonymous by default pre-ticks the form | Pass |
| Download my data → `dilo-my-data.json` with profile and 2 communities | Pass |
| Delete: blocked for last owner; works for others, signed out with message | Pass |
| Report record → moderator removes → reporter notified → record gone | Pass |
| Block hides messages; unblock from settings | Pass |
| Admin: totals + report summaries, no private text, can't open community, suspend → members see paused | Pass |
| Admin page closed to others | Pass |
| Accessibility audit (axe) on 16 screens, phone + desktop | Pass (after fixes) |
| New screens: banner, no side-scroll, 44 px targets | Pass |

Found and fixed while testing: after "Delete my account" the app jumped to sign-in instead of the welcome page (sign-out now happens on arrival).
Not checkable by a robot: TalkBack reading order on a real phone — owner check.
