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
  },
];

export const getCelebration = (slug: string) => celebrations.find((c) => c.slug === slug);
