# Email: hello@dilowish.com

## क्या बनाया?
- **hello@dilowish.com** — DILO का public contact email।
- Cloudflare **Email Routing** (free) से हर mail founder के DILO-only Gmail में forward होता है।
- Privacy page पर अब contact के लिए **hello@dilowish.com** दिखता है।

## क्यों बनाया?
- Beta testers और users को एक भरोसेमंद, brand वाला address चाहिए।
- Personal Gmail छुपा रहता है, DILO के mail अलग inbox में रहते हैं।

## कैसे काम करता है?
1. Cloudflare ने dilowish.com में MX, SPF और DKIM DNS records जोड़े (Email Routing → Onboard Domain → Activate)।
2. Destination address (DILO Gmail) verify किया।
3. Routing rule: `hello@dilowish.com` → Send to an email → DILO Gmail। Catch-all बंद है (बाकी addresses पर mail नहीं आता)।
4. Code: `lib/site.ts` में `CONTACT_EMAIL = "hello@dilowish.com"`। Test: `tests/early-access.spec.ts` mailto link check करता है।

## आपने क्या सीखा?
- Domain के MX records बताते हैं कि उस domain का mail कहाँ जाए।
- Email Routing सिर्फ़ mail **receive** करता है। hello@ के नाम से **भेजने** के लिए Gmail "Send mail as" अलग से set करना होगा (Part 2)।
- नया domain होने से पहला mail Spam में जा सकता है — "Not spam" + Gmail filter से ठीक होता है।

## बाकी काम
- Part 2: Gmail "Send mail as" hello@dilowish.com (App Password, 2-Step Verification ज़रूरी)।
