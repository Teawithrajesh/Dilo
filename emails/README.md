# DILO emails

`welcome.en.html` / `welcome.hi.html` (+ `.txt`): the founder's welcome letter, sent once when someone signs up.
Built from `lib/welcomeLetter.ts` (the same text the app shows on `/letter/`) by:

```
node --experimental-strip-types scripts/build-emails.mjs
```

`{{first_name}}` is filled in by the email service.

**Not sent yet.** Sending needs real sign-up (Phase 2) and an email service. Free options to compare when we get there (approval needed before use, as it sends messages outside DILO):
- Supabase Auth hook + an email provider's free tier (e.g. Resend, Brevo). Check current free limits and terms then.
- The reply-to address should be a real inbox the founder reads, because the letter says "reply to this email".
