# Step 1: skeleton — test report (26 Nov 2026)

Built: Next.js 16 + React 19 + TypeScript + Tailwind v4, static export; PWA manifest; DEMO DATA banner; placeholder page; placeholder icons (real logo icons come in Step 2); `scripts/serve.mjs` for the phone; built site in `preview/`.

| Check (Claude's workspace) | Result |
|---|---|
| `npm run build` | Pass (3 static routes) |
| Page loads at phone size (Pixel 7 emulation) | 200 OK, screenshot taken |
| DEMO DATA banner visible | Pass |
| Manifest linked, `display: standalone`, 3 icons | Pass, all icons 200 |
| Unknown page | 404 page |
| `../` path trick on serve.mjs | Blocked (404) |
| Browser console errors | None |

Not yet checked: real Android Chrome, "Add to Home screen". That is the owner's phone check.
