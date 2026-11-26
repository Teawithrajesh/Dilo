// The four celebrations DILO supports in Phase 1 (founder's choice).
export type CelebrationSlug = "birthday" | "engagement" | "wedding" | "anniversary";

export type Celebration = {
  slug: CelebrationSlug;
  title: string;
  line: string; // one-line mood under the title
  photoLabel: string; // label on the photo frame
  photoHint: string;
  wishPlaceholder: string;
  /** Page background (dark, so white text stays readable). */
  bg: string;
  /** Accent gradient for frames, tiles and buttons. */
  accent: string;
  /** Rich theme: base colour, three soft light colours, and the fine line-art colour. */
  base: string;
  glows: [string, string, string];
  gold: string;
  photoShape: "circle" | "arch" | "oval";
};

export const celebrations: Celebration[] = [
  {
    slug: "birthday",
    title: "Birthday",
    line: "Balloons up! Make their special day unforgettable.",
    photoLabel: "Birthday star",
    photoHint: "Add a happy photo of the birthday person",
    wishPlaceholder: "e.g. Riya dreams of her first guitar for her 12th birthday",
    bg: "from-[#1a0f45] via-[#2b1260] to-[#0a1440]",
    accent: "from-pink via-orange to-gold",
    base: "#140c2b",
    glows: ["#ff4f8b", "#ffb347", "#7b61ff"],
    gold: "#f4cf86",
    photoShape: "circle",
  },
  {
    slug: "engagement",
    title: "Engagement",
    line: "Two hearts, one promise. Celebrate the ring moment.",
    photoLabel: "The couple",
    photoHint: "Add a photo of the happy couple",
    wishPlaceholder: "e.g. Matching rings and a beautiful ring ceremony for Aman & Neha",
    bg: "from-[#2a0f2e] via-[#3d1438] to-[#0a1440]",
    accent: "from-[#f7b2c4] via-pink to-[#f6c26b]",
    base: "#1c0a1b",
    glows: ["#f7a8c0", "#d4a373", "#8e3b6b"],
    gold: "#f1d3a1",
    photoShape: "oval",
  },
  {
    slug: "wedding",
    title: "Wedding",
    line: "Shaadi mubarak! Bring the whole family together.",
    photoLabel: "Bride & groom",
    photoHint: "Add a photo of the bride and groom",
    wishPlaceholder: "e.g. Wedding photography and mehendi decor for Anjali's wedding",
    bg: "from-[#3a0814] via-[#4a0d1f] to-[#0a1440]",
    accent: "from-[#d1123f] via-orange to-gold",
    base: "#1c0610",
    glows: ["#b0123f", "#ff8f1f", "#ffb000"],
    gold: "#e9c46a",
    photoShape: "arch",
  },
  {
    slug: "anniversary",
    title: "Anniversary",
    line: "Years of love, one beautiful celebration.",
    photoLabel: "The couple",
    photoHint: "Add a photo of the couple",
    wishPlaceholder: "e.g. A surprise 25th anniversary dinner for Mummy & Papa",
    bg: "from-[#1d1050] via-[#33145a] to-[#0a1440]",
    accent: "from-violet via-pink to-[#ff8fb1]",
    base: "#120b2a",
    glows: ["#ff8fb1", "#7c4dff", "#c2185b"],
    gold: "#ecc1b0",
    photoShape: "oval",
  },
];

export const getCelebration = (slug: string) => celebrations.find((c) => c.slug === slug);
