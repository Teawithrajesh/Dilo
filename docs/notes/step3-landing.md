# Step 3: landing page — test report (26 Nov 2026)

Built:
- Splash (`/`): logo on navy. **Tapping the "O" opens the app** (founder's request). The O has a slow, soft glow (switched off for "reduce motion") and the hint "Tap the O to begin".
- Landing page (`/welcome/`), 10 sections: header, hero (2 CTAs + sample event card), how it works, examples, why DILO, trust & privacy, who it's for, FAQ, final call, footer.
- Sign-up placeholder (`/join/`): "Sign-up opens soon", with a link back. Real sign-up is Step 4.
- Automated tests: `tests/landing.spec.ts` (Playwright), run on a phone (Pixel 7) and on desktop.
- No stock photos: the concept's family photo is not ours to use. The page uses logo colours, icons and sample cards instead.

| Check | Result |
|---|---|
| `npm run build` | Pass (5 static routes) |
| `npm run test:contrast` | 16/16 pass |
| `npm test` (Playwright, phone + desktop) | **24/24 pass** |
| Tap O → landing page | Pass |
| Create Your Community → `/join/` → back | Pass |
| Discover How DILO Works → scrolls to How it works | Pass |
| Join → `/join/` | Pass |
| Every link points to a real page or section | Pass |
| FAQ opens and closes | Pass |
| Tap targets ≥ 44 px (phone and desktop) | Pass (desktop menu fixed after first run failed) |
| No horizontal scroll; DEMO DATA banner present | Pass |
| No "donate now", "verified by DILO", "payment received" | Pass |
| No console errors | Pass |

Not done in this step: page load time on a 4G throttle (blueprint section 8). Planned for the Step 7 full check.

## Revision 1 (26 Nov 2026): four celebrations with themed pages
Founder feedback: only Birthday, Engagement, Wedding (+ Anniversary, confirmed); remove laptop/trip examples; each icon opens a page with a photo frame, an invitation-card frame, a dream wish and an estimated budget; each page has a background that feels like that celebration.

- Landing: "Examples" replaced by **"What are you celebrating?"** with 4 tiles. Laptop/trip wording removed everywhere.
- `/celebrate/birthday|engagement|wedding|anniversary/`: themed background (birthday balloons + confetti; engagement rings + sparkles; wedding marigold toran + mandala; anniversary hearts) plus a faint repeating pattern down the page.
- Round **photo frame** and portrait **invitation-card frame** with gradient borders; uploads preview **on the phone only** (nothing is uploaded). JPG/PNG/WebP, max 5 MB.
- **Dream wish** (max 300 characters) and **estimated budget** (whole rupees, Indian digit grouping, max ₹1 crore). "Create … dream" checks both and shows a demo confirmation.
- Button on these pages: white with navy text (the gradients can't carry readable text).

| Check | Result |
|---|---|
| Build | Pass (9 static routes) |
| Contrast | 16/16 pass |
| `npm test` (phone + desktop) | **42/42 pass** |
| Exactly 4 tiles; no laptop/trip/goa text | Pass |
| Each tile opens its page with all 4 fields, banner, no side-scroll | Pass |
| Photo + invitation previews | Pass |
| Non-image file refused | Pass |
| Wish + budget required; budget keeps digits only | Pass |
| Back → celebrations section | Pass |
