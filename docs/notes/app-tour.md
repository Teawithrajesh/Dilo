# App Tour (पहली बार आने वालों के लिए गाइड)

## क्या बनाया?
- **Home tour (9 steps):** Welcome → Daily Sparkles → Dreams that came true → Your communities → Start your own community → Upcoming celebrations → Communities tab → Notifications → Your profile।
- **Celebration tour (4 steps):** पहली बार कोई celebration खोलने पर — progress ring, dream wish, wishlist, contributions।
- Screen धुंधली हो जाती है, एक हिस्सा चमकता है (spotlight), और एक card उसे आसान भाषा में समझाता है।
- Buttons: **Next / Back / Skip tour / Finish**। Keyboard: → ← और Esc।
- **Profile → 🧭 Take the app tour** से tour दोबारा देख सकते हैं।

## क्यों बनाया?
- नया व्यक्ति app खोलकर उलझे नहीं; 1 मिनट में समझ जाए कि DILO कैसे काम करता है।

## कैसे काम करता है?
- `components/app/Tour.tsx` — spotlight + card. Target ना मिले (जैसे Admin के पास Sparkles नहीं) तो वो step अपने-आप skip।
- `components/app/tours.ts` — दोनों tours के steps (text यहीं बदलें)।
- `lib/tour.ts` — हर demo person के लिए याद रखता है कि tour हो चुका (`localStorage` key `dilo-tours`)। एक बार Finish/Skip के बाद दोबारा अपने-आप नहीं आता।
- DEMO DATA banner tour के ऊपर दिखता रहता है।
- Tests: `tests/tour.spec.ts` (14 tests, phone + desktop)। बाकी tests "पुराने visitor" की तरह चलते हैं (`tests/fixtures/tours-seen.json`), ताकि tour उनके रास्ते में ना आए।

## आपने क्या सीखा?
- **Product tour / onboarding** — नए user को पहली बार में रास्ता दिखाना।
- **Spotlight trick:** एक box के चारों ओर बहुत बड़ी परछाईं (box-shadow) से बाकी screen धुंधली।
- **Accessibility:** card एक `dialog` है, focus उसी में रहता है, Esc से बंद।
