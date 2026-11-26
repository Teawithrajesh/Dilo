// The welcome letter every new DILO member receives (in the app now; by email from Phase 2).
// Written in the founder's own voice. Keep it plain and personal: short sentences, real examples,
// no marketing words. The email templates in /emails are made from this same text.

export type Lang = "en" | "hi";

export type Letter = {
  subject: string;
  greeting: string;
  paragraphs: string[];
  points: string[];
  closing: string[];
  signoff: string[];
};

export const FOUNDER_NAME = { en: "Raj", hi: "राज" };

export function welcomeLetter(firstName: string, lang: Lang = "en"): Letter {
  if (lang === "hi") {
    return {
      subject: `DILO में आपका स्वागत है, ${firstName}`,
      greeting: `नमस्ते ${firstName} जी,`,
      paragraphs: [
        `DILO से जुड़ने के लिए दिल से शुक्रिया। मैं ${FOUNDER_NAME.hi} हूँ, और DILO बनाने के पीछे एक छोटी-सी बात है।`,
        "याद कीजिए, परिवार में पिछली शादी या जन्मदिन। सब प्यार से आए, सब कुछ न कुछ लाए। कोई डिनर सेट, कोई दीवार घड़ी, एक जैसी तीन साड़ियाँ, कुछ लिफ़ाफ़े। जिसका दिन था, वो खुश तो हुआ, पर बहुत से तोहफ़े अलमारी में रखे के रखे रह गए।",
        "अब सोचिए, अगर वही सारा प्यार एक ऐसी चीज़ में लगता जो उन्हें सच में चाहिए थी। भतीजे का वो कैमरा जिसके लिए वो पैसे जोड़ रहा है। मम्मी-पापा की वो यात्रा जो कभी हो नहीं पाई। दादी का नया चश्मा, और पूरे परिवार के साथ एक दोपहर का खाना।",
        "DILO इसी के लिए है। जब आपके किसी अपने का कोई खास दिन हो, तो पूरा परिवार उनका सपना देख सके, मिलकर उसमें हाथ बँटा सके, और उसे पूरा होते देख सके। किसी को बहुत ज़्यादा देने की ज़रूरत नहीं। बहुत लोगों का थोड़ा-थोड़ा मिलकर वो बन जाता है जो उनके लिए सच में मायने रखता है।",
        "कुछ बातें जो आपको जाननी चाहिए:",
      ],
      points: [
        "आपकी community private है। सिर्फ़ वही लोग आ सकते हैं जिन्हें आप मंज़ूरी दें।",
        "DILO आपके पैसों को कभी नहीं छूता। आप जैसे हमेशा देते हैं, नकद या UPI से, वैसे ही दीजिए और बस यहाँ लिख दीजिए, ताकि सब देख सकें कि सपना कितना पास आ गया।",
        "अगर आप चुपचाप देना चाहें, तो दे सकते हैं। आपका नाम सिर्फ़ organiser को दिखेगा, ताकि वो आपको धन्यवाद कह सकें।",
      ],
      closing: [
        "आज एक छोटा-सा काम कीजिए। सोचिए, परिवार में अगला जन्मदिन, सगाई, शादी या सालगिरह किसकी है, और उनसे बस एक सवाल पूछिए: \"इस साल आपको सच में किस चीज़ से खुशी मिलेगी?\" फिर वो सपना DILO पर डालिए और परिवार को बुलाइए।",
        "कैसा रहा, ज़रूर बताइएगा। इस email का जवाब दीजिए, वो सीधे मुझ तक पहुँचता है।",
      ],
      signoff: ["ढेर सारी शुभकामनाओं के साथ,", FOUNDER_NAME.hi, "Founder, DILO"],
    };
  }
  return {
    subject: `Welcome to DILO, ${firstName}`,
    greeting: `Hi ${firstName},`,
    paragraphs: [
      `Thank you for joining DILO. I'm ${FOUNDER_NAME.en}, and I started DILO for a simple reason.`,
      "Think about the last wedding or birthday in your family. Everyone came with love, and everyone brought something. A dinner set. Another wall clock. Three of the same sarees. A few envelopes. The person whose day it was felt grateful, but a lot of those gifts went into a cupboard and stayed there.",
      "Now imagine if all that love had gone into one thing they really wanted. The camera your nephew has been saving for. The trip your parents never got to take. A new pair of glasses for Dadi, and a lunch with the whole family around her.",
      "That's what DILO is for. When someone you love has a special day, the family can see their dream, add to it together, and watch it come true. Nobody has to give a lot. A little from many people adds up to something that actually matters to them.",
      "A few things you should know:",
    ],
    points: [
      "Your community is private. Only people you approve can get in.",
      "DILO never touches your money. You give the way you always do, cash or UPI, and just note it here so everyone can see the dream getting closer.",
      "If you'd rather give quietly, you can. Only the organiser will see your name, so they can say thank you.",
    ],
    closing: [
      "Here's one small thing you can do today. Think of the next birthday, engagement, wedding or anniversary in your family, and ask that person one question: \"What would truly make you happy this year?\" Then put that dream on DILO and invite the family.",
      "I'd love to hear how it goes. Just reply to this email. It comes straight to me.",
    ],
    signoff: ["With warmth,", FOUNDER_NAME.en, "Founder, DILO"],
  };
}
