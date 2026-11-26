# Step 5: community flows — test report (26 Nov 2026)

Built (demo data, in this browser tab only):
- **Invite links** (`/community/invite/?id=…`): owners, admins and moderators create a link + 8-character code (no 0/O/1/I), **Share on WhatsApp** (opens WhatsApp with a ready message; the person chooses to send), **Copy link**, **Switch off this link**. Links expire after 7 days and have a use limit (20). Old links show "Expired / Switched off / Used up".
- **Invite landing** (`/join/?code=…`): shows only the community name and cover. Signed-out visitors sign in and come straight back (`/signin/?next=…`, internal paths only). Expired, switched-off, used-up and unknown links are refused with a clear message.
- **Join requests** (`/community/members/?id=…`): **Approve / Reject** for owner, admin, moderator. Approved people become members and see the celebrations; both outcomes send a notification. Approvers are notified of new requests.
- **Roles**: owner/admin can make someone moderator or member. Nobody can change or remove the owner. You can only remove people below your role (moderator → members only). Remove asks for confirmation.
- **Leave community**: blocked for the last owner.
- **Create community** (`/communities/new/`): name (required, max 40), type Family/Friends/Community, optional description, 4 covers. Private by default; the creator is the owner.
- Community pages moved to `/community/?id=…` so newly created communities work in the static build.

| Check | Result |
|---|---|
| `npm run build` | Pass (23 pages) |
| `npm run test:contrast` | 16/16 pass |
| `npm test` (Playwright, phone + desktop) | **94/94 pass** |
| Create link, WhatsApp share text has the code, switch off → old links | Pass |
| Landing shows name + cover only; expired / unknown refused | Pass |
| Sign in from the link returns to it; request sent | Pass |
| Approve → Ravi is a member, sees celebrations, gets "Welcome" | Pass |
| Reject (by moderator) → Ravi stays out, told "not approved" | Pass |
| Owner changes roles; owner row has no buttons | Pass |
| Last owner can't leave | Pass |
| Moderator: no role buttons, can remove a member, can't touch the owner | Pass |
| Member: no Invite/Manage; invite page closed | Pass |
| Create community: name required; private; you are Owner; listed | Pass |
| New screens: banner, no side-scroll, 44 px targets | Pass |

Real app (Phase 2): invite tokens are random 128-bit values stored hashed; all of these rules are enforced by the database (Row Level Security + database functions), not by the screens.

## Revision 1 (26 Nov 2026): community photo and cover banner
Founder feedback: community creators should be able to add their own image and a photo banner, like Facebook.
- Community page header is now Facebook-style: a **cover banner** with the **community photo** overlapping it. Owners and admins see **Add/Change cover** and a camera button on the photo; members and moderators don't.
- **Create community** has a live profile preview: add a cover and a photo before creating; colour covers remain the fallback.
- Photos also show on Home, the Communities list and the invite landing page.
- JPG/PNG/WebP up to 5 MB. Pictures stay on the phone (local preview); nothing is uploaded in the demo. Phase 2 stores them in private Supabase Storage with short-lived links.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **100/100 pass** (adds: owner adds cover + photo, members can't, non-image refused, create with images) |

## Fix (26 Nov 2026): "Add cover photo" did not respond on the phone
- Cause: the community-photo row is pulled up over the bottom of the cover (Facebook-style overlap). That invisible row sat on top of the **Add cover** button and swallowed the tap. Same on the create-community preview.
- Why tests missed it: they put the file straight into the hidden input instead of tapping the button.
- Fix: the overlapping row lets taps pass through (`pointer-events-none`, with the photo itself still tappable) and the cover button is raised (`z-10`).
- New `tests/tap-upload.spec.ts` taps the real buttons and waits for the phone's file picker: failed before the fix (Playwright: "…intercepts pointer events"), passes after.

| Check | Result |
|---|---|
| `npm test` (phone + desktop) | **106/106 pass** |

## Revision 2 (26 Nov 2026): link preview, own community, notify every member
Founder feedback: (1) a shared link should show the DILO image and slogan; (2) someone who joins by invite must be free to create their own community (e.g. for their wife's side of the family); (3) every member of a community must get a notification when there is an event.

1. **Link preview**: site-wide Open Graph + Twitter tags with a 1200×630 share image (`public/og/dilo-share.png`: logo + "Together, We Make Dreams Come True." + "Dream · Share · Support · Celebrate"). The WhatsApp invite text now starts with "💖 DILO — Together, We Make Dreams Come True." The invite landing shows the larger logo and slogan.
   - Note: WhatsApp builds the preview by fetching the link from the internet, so the picture appears only once DILO is on a public address. Set `NEXT_PUBLIC_SITE_URL` to that address at build time (currently `http://localhost:8080`).
2. **Own community for everyone**: Home always shows "Start your own community — for your side of the family, your in-laws or your friends". After requesting to join through a link, the landing page offers "+ Create my own community".
3. **Celebrations notify the whole community**: community page has **Add a celebration** (Birthday · Engagement · Wedding · Anniversary). The themed page, when signed in, asks for the celebration name, date (today or later), community (pre-selected), dream wish, budget, photo and invitation, and creates the event. **Every other member** of that community gets a notification; non-members get nothing. Approving a new member also tells the existing members ("Ravi Kumar joined Sharma Family").
   - Event pages moved to `/event/?id=…` (so new events work in the static build); "Back" now returns to the event's community.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **120/120 pass** (adds: preview tags + share image, WhatsApp text has slogan, invitee creates own community, Home offer, new celebration notifies Neha + Amit and not Ravi, join notice to members, past date refused) |

**Step 5 complete.** Approved by the founder on 26 Nov 2026 ("Step 5 OK").
