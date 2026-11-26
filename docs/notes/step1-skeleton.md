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

## Phone check (owner, Android, 26 Nov 2026)
| Check | Result |
|---|---|
| Clone via `gh` in Termux (folder is `~/Dilo`) | Pass |
| `node scripts/serve.mjs preview` | Pass |
| Page in Brave and Chrome at `localhost:8080` | Pass, matches screenshot |
| Chrome "Install and create shortcut" | **Greyed out** on first try |

## Fix 1: service worker + offline page
Android Chrome greyed out install. Added `public/sw.js` (shows `offline.html` when offline, caches nothing else), `RegisterSW`, and `id`/`scope` in the manifest.

| Re-check (Claude's workspace, Pixel 7 emulation) | Result |
|---|---|
| Chromium installability errors | None |
| Page controlled by service worker | Yes |
| Offline reload shows "You are offline" with DEMO DATA banner | Pass |
| Console errors | None |

Pending: owner re-checks install on the phone after `git pull`.
