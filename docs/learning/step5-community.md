# Step 5 — Community flows (seekhne ke notes)

## 1. क्या बनाया?
Invite link बनाना और WhatsApp पर भेजना, join request को approve/reject करना, किसी को moderator बनाना या हटाना, community छोड़ना, और नई community बनाना।

## 2. क्यों बनाया?
DILO की असली ताकत "private परिवार" है। कौन अंदर आए, यह owner तय करे — यही भरोसा है।

## 3. कैसे काम करता है?
- **Invite code**: 8 अक्षर का random code (0/O और 1/I नहीं, ताकि पढ़ने में गलती न हो)। 7 दिन बाद expire।
- **Rank (दर्जा)**: Owner 4 > Admin 3 > Moderator 2 > Member 1। आप सिर्फ़ अपने से नीचे वाले को हटा सकते हैं — इसलिए Owner को कोई नहीं हटा सकता।
- **Last owner rule**: community बिना owner के न रहे, इसलिए आखिरी owner छोड़ नहीं सकता।
- **?id= वाला link**: नई community का नाम पहले से पता नहीं होता, इसलिए page एक ही है और community का id link में आता है।

## 4. आपने क्या सीखा?
- सुरक्षा के नियम screen पर दिखाने के लिए हैं; Phase 2 में असली रोक database करेगा।
- "Sign in करके वापस उसी link पर आना" (`next=`) — लेकिन सिर्फ़ अपने app के अंदर के पते पर, बाहर की website पर नहीं (security)।
