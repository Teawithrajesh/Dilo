# DILO roadmap: referral, platform admin and earning

Status: **plan only** (26 Nov 2026). Nothing here is built yet. Each item needs the founder's approval before work starts. Paid services and payments need a cost estimate and approval first.

> **सार (Hindi):** पहले Phase 1 पूरा करो और 5–10 परिवारों से feedback लो। Referral और admin Phase 2–3 में आएँगे। कमाई (ads, affiliate, vendors, premium) तभी शुरू होगी जब असली users हों। लोगों का data कभी नहीं बेचना, हर ad पर "Sponsored" लिखना, और पैसे DILO के बीच से नहीं गुज़रेंगे।

## 1. Invites and referral

### 1a. Invite to a community (Phase 1 Step 5 as a demo, real in Phase 2)
1. Owner, admin or moderator taps **Invite**. DILO makes a link and a short code.
2. They share it on WhatsApp or SMS.
3. The new person opens it and sees only the community name and cover.
4. They tap **Request to join**. An owner, admin or moderator approves or rejects.
5. Links expire after 7 days, have a use limit, and can be revoked. Tokens are stored hashed.

### 1b. Referral (growing DILO) — Phase 3
- Every user gets a personal referral code; their profile shows how many families joined with it.
- Rewards are **not cash** (cash rewards bring tax and legal rules): premium themes, free invitation designs, extra photo storage, a "Founding Family" badge.
- Count a referral only when the new family creates a community and at least one celebration (stops fake sign-ups).
- Rate limits and duplicate checks (same phone/email) to prevent abuse.

## 2. Platform admin (the founder's role)

The **platform admin** sits above community owners. Privacy comes first: families must be able to trust that DILO itself does not look into their private communities.

| Can | Cannot |
|---|---|
| See totals: users, communities, celebrations (numbers only) | Open a private community's photos, wishes or amounts |
| Review content **after someone reports it**, remove it | Browse a family's data without a report |
| Suspend abusive users or communities | Sell or share anyone's personal data |
| Manage partners, ads, themes and app settings | Change contribution records |
| Answer grievances (legal requirement) | |

- Every admin action is written to an audit log.
- Built as a basic dashboard in Phase 1 Step 7 (demo data), and enforced by database rules in Phase 2.
- Law to follow: Digital Personal Data Protection Act, 2023 and its Rules (consent, deletion, breach reporting, grievance contact). A lawyer reviews the privacy policy and terms before real users.

## 3. Earning — around the four celebrations

Birthday, Engagement, Wedding and Anniversary all come with spending: cakes, decor, photographers, jewellery, venues, gifts, clothes.

| Model | How it works | Earliest | Notes |
|---|---|---|---|
| **Premium features** | Paid invitation templates, extra themes, larger photo album, custom community link | Phase 3 | Simple; no third parties |
| **Affiliate links** | "Buy this wish here" links in wishlists (gifts, cakes, decor) | Phase 3 | Commission paid by the seller, never taken from the family |
| **Contextual ads** | Wedding pages show photographers; birthday pages show cake shops | After ~5,000 users | Chosen by **celebration type and city**, never by personal data; always labelled "Sponsored"; families can hide ads with premium |
| **Vendor marketplace** | Photographers, decorators, caterers, venues pay for listings / "Featured" spots | After Beta | Needs vendor verification and reviews |
| **DILO's own products** | Gift boxes, e-invitation design service | Long term | Needs suppliers, stock, GST |

### Rules for earning (never break)
1. **Never sell or share personal data.** Ads use the celebration type and city only.
2. Every ad or partner item is clearly marked **"Sponsored"**.
3. **Money does not pass through DILO.** Families give each other money directly; partners pay DILO commissions or fees. Holding or moving money brings RBI and fundraising rules, so any payment feature needs a lawyer first.
4. No ads inside a community's private feed; only on celebration pages and suggestions.
5. Every paid service DILO uses is costed and approved first (lab cost register).

## 4. Order of work

| When | What |
|---|---|
| **Now: Phase 1 (Steps 5–7)** | Invite + join demo, events/wishlist/contributions demo, profile/privacy + basic admin dashboard. Test with 5–10 families. |
| **Phase 2: Pilot (≤ 50 users)** | Real login and database (Supabase), real invites, privacy policy and terms reviewed by a lawyer. |
| **Phase 3: Beta (≤ 5,000 users)** | Referral codes, premium features, first affiliate links. |
| **After Beta** | Contextual ads, vendor marketplace, own products — only if users ask for them and the numbers make sense. |

## 5. Open questions for the founder
- Which city to start with (for local vendors and ads)?
- Should contribution amounts be visible to all members, or totals only?
- Hindi first, or English + Hindi together?
- Sign-in by email (free) or phone OTP (families prefer it, but each SMS costs money)?
