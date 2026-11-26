# Step 1 — Skeleton (seekhne ke notes)

## 1. क्या बनाया?
DILO app का खाली ढांचा (skeleton): एक page जिस पर DILO नाम, tagline और ऊपर "DEMO DATA" banner है। साथ में PWA manifest, ताकि Android Chrome में "Add to Home screen" आ सके।

## 2. क्यों बनाया?
घर बनाने से पहले नींव डालते हैं। आगे के सारे steps (logo, landing page, screens) इसी ढांचे पर बनेंगे।

## 3. कैसे काम करता है?
- **Next.js** React का framework है। हम इसे **static export** पर चलाते हैं: `npm run build` सिर्फ़ सादी HTML/CSS/JS files बनाता है।
- ये files `preview/` folder में रखी जाती हैं। आपके phone को कुछ compile नहीं करना पड़ता।
- `scripts/serve.mjs` एक छोटा server है जो इन files को `http://localhost:8080` पर दिखाता है। यह सिर्फ़ आपके phone के अंदर चलता है (127.0.0.1), Wi-Fi पर कोई और नहीं देख सकता।
- **Manifest** एक छोटी file है जो Chrome को app का नाम, रंग और icon बताती है। इसी से "Add to Home screen" बनता है।

## 4. आपने क्या सीखा?
- **Static site** = पहले से बनी files, server पर कोई logic नहीं।
- **PWA** = website जो phone पर app जैसी install होती है।
- **Branch** = अलग रास्ता जहाँ काम होता है, `main` सुरक्षित रहता है।
