# Feature: feedback form (27 Nov 2026)

Founder request: a feedback form where people can send suggestions and feedback.

- **`/feedback/`**, open to everyone (signed in or not): optional 1–5 face rating, type (Idea / suggestion · Something didn't work · Something I liked · Other), the message (required, max 1,000), optional name and phone/email for a reply, or **"Send without my name"**. Thank-you screen with "Send more feedback".
- Entry points: landing-page footer ("Feedback"), Home card ("Help us improve DILO"), Profile → "Send feedback".
- **Admin dashboard → Feedback**: every message with type, stars, date, name/contact (or "Anonymous"); **Download (CSV)** (opens in Google Sheets/Excel, Hindi-safe) and **Clear all** (asks first).
- **Storage (Phase 1)**: saved in this phone's browser (localStorage), so it survives a refresh. When the founder shows DILO to families on their own phone, all feedback collects there. Phase 2 saves it to the database.

| Check | Result |
|---|---|
| Build | Pass |
| `npm test` (phone + desktop) | **194/194 pass** (adds: send from landing, message required, name prefilled / hidden when anonymous, survives refresh, admin reads + CSV download + clear; a11y audit covers `/feedback/`) |
