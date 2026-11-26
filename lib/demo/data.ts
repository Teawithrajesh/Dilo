// Phase 1 demo data. Every name is invented and labelled "Sample" in the UI.
import type { CelebrationSlug } from "@/lib/celebrations";

export type PersonId = "priya" | "amit" | "neha" | "ravi";
export type Role = "owner" | "admin" | "moderator" | "member";

export type Person = { id: PersonId; name: string; short: string; label: string; blurb: string; gradient: string };
export type CommunityType = "Family" | "Friends" | "Community";
export type Community = {
  id: string;
  name: string;
  type: CommunityType;
  description: string;
  gradient: string; // fallback cover colour
  /** Picked on this phone; a local preview link (blob:) — never uploaded in the demo. */
  coverImage?: string;
  photo?: string;
};
export type Membership = { communityId: string; personId: PersonId; role: Role };
export type DemoEvent = {
  id: string;
  communityId: string;
  kind: CelebrationSlug;
  title: string;
  date: string; // ISO date
  goal: number; // whole rupees
  recorded: number; // whole rupees, self-reported records only
  wishes: number;
  dream: string; // the dream wish
  createdBy?: PersonId; // the organiser
  sample?: boolean;
  celebrated?: boolean; // goal reached and celebrated
  /** Local preview links picked on this phone (never uploaded in the demo). */
  photo?: string;
  invitation?: string;
};
/** A personal invite already sent to someone (shown on their Home). */
export type Invite = { communityId: string; personId: PersonId; from: PersonId };
/** A shareable invite link. Real app: random 128-bit token, stored hashed. */
export type InviteLink = { code: string; communityId: string; createdBy: PersonId; expiresAt: number; revoked: boolean; maxUses: number; uses: number };
export type Notice = { id: string; personId: PersonId; text: string; when: string; read: boolean };

export const people: Person[] = [
  { id: "priya", name: "Priya Sharma", short: "Priya", label: "Owner", blurb: "Created Sharma Family. Can approve, remove and manage everyone.", gradient: "from-pink to-orange" },
  { id: "amit", name: "Amit Sharma", short: "Amit", label: "Moderator", blurb: "Helps Priya: approves new members and keeps things friendly.", gradient: "from-violet to-pink" },
  { id: "neha", name: "Neha Verma", short: "Neha", label: "Member", blurb: "Part of the family group. Can see events and add wishes.", gradient: "from-orange to-gold" },
  { id: "ravi", name: "Ravi Kumar", short: "Ravi", label: "Newcomer", blurb: "Has an invite to Sharma Family but isn't a member yet.", gradient: "from-[#2bb3a3] to-violet" },
];

export const communities: Community[] = [
  { id: "sharma-family", name: "Sharma Family", type: "Family", description: "Our family's celebrations, all in one private place.", gradient: "from-pink via-orange to-gold" },
  { id: "delhi-friends", name: "Delhi Friends", type: "Friends", description: "College friends who never miss a celebration.", gradient: "from-violet via-pink to-[#ff8fb1]" },
];

export const memberships: Membership[] = [
  { communityId: "sharma-family", personId: "priya", role: "owner" },
  { communityId: "sharma-family", personId: "amit", role: "moderator" },
  { communityId: "sharma-family", personId: "neha", role: "member" },
  { communityId: "delhi-friends", personId: "neha", role: "owner" },
  { communityId: "delhi-friends", personId: "amit", role: "member" },
];

/** Extra sample members, so member counts look real (not selectable as demo people). */
export const extraMemberCounts: Record<string, number> = { "sharma-family": 9, "delhi-friends": 4 };

export const events: DemoEvent[] = [
  { id: "anjali-wedding", createdBy: "priya", sample: true, dream: "Wedding photography and mehendi decor for Anjali's big day.", communityId: "sharma-family", kind: "wedding", title: "Anjali's Wedding", date: "2027-02-14", goal: 150000, recorded: 108000, wishes: 6 },
  { id: "dadi-birthday", createdBy: "amit", sample: true, dream: "A family lunch and a new pair of reading glasses for Dadi's 75th.", communityId: "sharma-family", kind: "birthday", title: "Dadi's 75th Birthday", date: "2027-01-09", goal: 40000, recorded: 31000, wishes: 4 },
  { id: "parents-anniversary", createdBy: "priya", sample: true, dream: "A surprise 25th anniversary dinner with the whole family.", communityId: "sharma-family", kind: "anniversary", title: "Mummy & Papa's 25th Anniversary", date: "2027-03-22", goal: 60000, recorded: 12000, wishes: 3 },
  { id: "aman-neha-engagement", createdBy: "neha", sample: true, dream: "Matching rings and a small ring-ceremony party.", communityId: "delhi-friends", kind: "engagement", title: "Aman & Pooja's Engagement", date: "2027-01-30", goal: 50000, recorded: 22500, wishes: 3 },
];

export const invites: Invite[] = [{ communityId: "sharma-family", personId: "ravi", from: "priya" }];

export const notices: Notice[] = [
  { id: "n1", personId: "priya", text: "Ravi Kumar was invited to Sharma Family.", when: "2h ago", read: false },
  { id: "n2", personId: "priya", text: "Neha added a wish to Anjali's Wedding.", when: "Yesterday", read: false },
  { id: "n3", personId: "priya", text: "Dadi's 75th Birthday is 44 days away.", when: "2 days ago", read: true },
  { id: "n4", personId: "amit", text: "Anjali's Wedding reached 72% of its goal.", when: "3h ago", read: false },
  { id: "n5", personId: "amit", text: "New event in Delhi Friends: Aman & Pooja's Engagement.", when: "Yesterday", read: true },
  { id: "n6", personId: "neha", text: "Priya created Mummy & Papa's 25th Anniversary.", when: "5h ago", read: false },
  { id: "n7", personId: "neha", text: "You are the owner of Delhi Friends.", when: "Last week", read: true },
  { id: "n8", personId: "ravi", text: "Priya Sharma invited you to Sharma Family.", when: "1h ago", read: false },
];

const DAY = 86_400_000;
/** Seeded links: one live, one expired (to show what an old link looks like). */
export const inviteLinks: InviteLink[] = [
  { code: "SHARMA7Q", communityId: "sharma-family", createdBy: "priya", expiresAt: Date.now() + 7 * DAY, revoked: false, maxUses: 20, uses: 1 },
  { code: "OLDLINK1", communityId: "sharma-family", createdBy: "priya", expiresAt: Date.now() - DAY, revoked: false, maxUses: 20, uses: 3 },
];

export const coverChoices = [
  "from-pink via-orange to-gold",
  "from-violet via-pink to-[#ff8fb1]",
  "from-[#2bb3a3] via-violet to-pink",
  "from-orange via-gold to-[#f6e7b0]",
];

export type Priority = "high" | "medium" | "low";
export type Wish = { id: string; eventId: string; title: string; cost: number; priority: Priority; link?: string; fulfilled: boolean; position: number };
export type ContributionStatus = "self_reported" | "confirmed";
/** A record of a gift given OUTSIDE DILO (cash, UPI, bank). DILO never handles money. */
export type Contribution = { id: string; eventId: string; personId: PersonId | "sample"; sampleName?: string; amount: number; wishId?: string; message?: string; anonymous: boolean; status: ContributionStatus; when: string };
export type Activity = { id: string; communityId: string; text: string; when: string; eventId?: string };

export const wishes: Wish[] = [
  { id: "w1", eventId: "anjali-wedding", title: "Wedding photography", cost: 60000, priority: "high", fulfilled: false, position: 1 },
  { id: "w2", eventId: "anjali-wedding", title: "Mehendi decor", cost: 25000, priority: "medium", fulfilled: true, position: 2 },
  { id: "w3", eventId: "anjali-wedding", title: "Bridal lehenga alteration", cost: 15000, priority: "medium", fulfilled: false, position: 3 },
  { id: "w4", eventId: "dadi-birthday", title: "Reading glasses", cost: 6000, priority: "high", fulfilled: true, position: 1 },
  { id: "w5", eventId: "dadi-birthday", title: "Family lunch", cost: 30000, priority: "medium", fulfilled: false, position: 2 },
  { id: "w6", eventId: "parents-anniversary", title: "Surprise dinner", cost: 35000, priority: "high", fulfilled: false, position: 1 },
  { id: "w7", eventId: "parents-anniversary", title: "Photo album", cost: 8000, priority: "low", fulfilled: false, position: 2 },
  { id: "w8", eventId: "aman-neha-engagement", title: "Ring ceremony decor", cost: 20000, priority: "high", fulfilled: false, position: 1 },
];

// Sample records that add up to each event's starting "recorded" amount.
export const contributions: Contribution[] = [
  { id: "c1", eventId: "anjali-wedding", personId: "amit", amount: 51000, wishId: "w1", message: "Blessings to Anjali!", anonymous: false, status: "confirmed", when: "3 days ago" },
  { id: "c2", eventId: "anjali-wedding", personId: "neha", amount: 25000, wishId: "w2", anonymous: false, status: "confirmed", when: "2 days ago" },
  { id: "c3", eventId: "anjali-wedding", personId: "sample", sampleName: "Sunita Mausi", amount: 21000, anonymous: true, status: "self_reported", when: "Yesterday" },
  { id: "c4", eventId: "anjali-wedding", personId: "sample", sampleName: "Vikram Chacha", amount: 11000, anonymous: false, status: "self_reported", when: "5h ago" },
  { id: "c5", eventId: "dadi-birthday", personId: "priya", amount: 21000, anonymous: false, status: "confirmed", when: "4 days ago" },
  { id: "c6", eventId: "dadi-birthday", personId: "neha", amount: 10000, message: "Happy 75th, Dadi!", anonymous: false, status: "self_reported", when: "Yesterday" },
  { id: "c7", eventId: "parents-anniversary", personId: "amit", amount: 12000, anonymous: false, status: "self_reported", when: "6h ago" },
  { id: "c8", eventId: "aman-neha-engagement", personId: "amit", amount: 15000, anonymous: false, status: "confirmed", when: "2 days ago" },
  { id: "c9", eventId: "aman-neha-engagement", personId: "sample", sampleName: "Kabir", amount: 7500, anonymous: true, status: "self_reported", when: "Yesterday" },
];

export const activity: Activity[] = [
  { id: "a1", communityId: "sharma-family", text: "Vikram Chacha recorded a contribution to Anjali's Wedding.", when: "5h ago", eventId: "anjali-wedding" },
  { id: "a2", communityId: "sharma-family", text: "Amit recorded a contribution to Mummy & Papa's 25th Anniversary.", when: "6h ago", eventId: "parents-anniversary" },
  { id: "a3", communityId: "sharma-family", text: "Priya created Mummy & Papa's 25th Anniversary.", when: "Yesterday", eventId: "parents-anniversary" },
  { id: "a4", communityId: "delhi-friends", text: "Neha created Aman & Pooja's Engagement.", when: "3 days ago", eventId: "aman-neha-engagement" },
];
