# Step 2 — Brand (seekhne ke notes)

## 1. क्या बनाया?
आपके logo concept को **SVG** में दोबारा बनाया: primary, horizontal, symbol, app icon, और हर एक के light, dark, black, white versions। साथ में app icons (PNG), रंगों की list (tokens), fonts, और app में `/brand/` नाम का brand guide page।

## 2. क्यों बनाया?
आगे की हर screen इन्हीं रंगों, fonts और logo से बनेगी। एक जगह तय कर दिया, तो पूरा app एक जैसा दिखेगा।

## 3. कैसे काम करता है?
- **SVG** = चित्र नहीं, गणित वाली drawing। कितना भी बड़ा करो, धुंधला नहीं होता।
- "DILO" के अक्षरों को **outline** (आकृति) में बदल दिया, ताकि किसी phone पर font न हो तब भी logo वैसा ही दिखे।
- **Tokens** (`brand/tokens.json`) = रंगों की एक ही सूची। Code वहीं से रंग लेता है।
- **Contrast check** = एक script जो जाँचता है कि हर रंग-जोड़ी (जैसे navy text on white) आसानी से पढ़ी जा सके (WCAG AA = कम से कम 4.5:1)।

## 4. आपने क्या सीखा?
- सुंदर रंग हमेशा पढ़ने लायक नहीं होते: orange पर सफ़ेद text सिर्फ़ 2.3:1 है, इसलिए button पर navy text रखा।
- **Maskable icon** = Android icon को गोल/चौकोर काटता है, इसलिए ज़रूरी चीज़ें बीच के 80% हिस्से में रखते हैं।
