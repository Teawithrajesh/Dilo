# Step 3 — Landing page (seekhne ke notes)

## 1. क्या बनाया?
- **Splash**: logo वाला पहला page। "O" दबाने पर app खुलता है।
- **Landing page**: 10 हिस्सों वाला page जो DILO समझाता है, और "Create Your Community" button।
- **Automated tests**: 24 tests जो हर button अपने-आप दबाकर देखते हैं।

## 2. क्यों बनाया?
नया आदमी सबसे पहले यही page देखता है। अगर यह साफ़ और भरोसेमंद लगे, तभी वह community बनाएगा।

## 3. कैसे काम करता है?
- O के ऊपर एक **अदृश्य link** रखा है, ठीक O के आकार का (logo image में O की जगह नापकर)।
- "Discover How DILO Works" एक **anchor link** (`#how`) है, जो उसी page पर नीचे scroll करता है।
- **Playwright** एक robot browser है: page खोलता है, buttons दबाता है और जाँचता है कि सही जगह पहुँचा या नहीं।

## 4. आपने क्या सीखा?
- Test ने एक गलती पकड़ी: desktop पर menu links बहुत छोटे थे (44px से कम)। Test न होता तो पता नहीं चलता।
- किसी और की photo बिना licence के use नहीं करते।
