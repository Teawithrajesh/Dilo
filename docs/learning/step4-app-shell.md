# Step 4 — App shell + demo log (seekhne ke notes)

## 1. क्या बनाया?
App का अंदर वाला ढांचा: नीचे 4 tabs (Home, Communities, Notifications, Profile), 4 demo लोग जिनसे login कर सकते हैं, और हर किसी को उसके role के हिसाब से अलग चीज़ें दिखती हैं।

## 2. क्यों बनाया?
असली login (Phase 2) से पहले यह देखना ज़रूरी है कि Owner, Moderator, Member और Newcomer को app कैसा दिखेगा। गलती अभी पकड़ना सस्ता है।

## 3. कैसे काम करता है?
- **Demo data** एक file (`lib/demo/data.ts`) में है: लोग, communities, events, notifications।
- **Store** (`lib/demo/store.tsx`) एक React **Context** है: पूरे app में "अभी कौन login है" और उसका data बाँटता है।
- **sessionStorage**: browser का छोटा डिब्बा। इसमें सिर्फ़ चुना हुआ person रखते हैं; tab बंद करो तो मिट जाता है।
- **Permissions** (`lib/permissions.ts`): तय करता है कौन क्या देखे। Phase 2 में असली सुरक्षा database (RLS) करेगा, यह सिर्फ़ दिखाने के लिए है।

## 4. आपने क्या सीखा?
- **Role-based access**: एक ही page, अलग लोगों को अलग दिखता है।
- Ravi (newcomer) को private community के events का नाम तक नहीं दिखना चाहिए; test यह जाँचता है।
