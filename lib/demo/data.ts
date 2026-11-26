// Phase 1 demo data. Every name is invented and labelled "Sample" in the UI.
import type { CelebrationSlug } from "@/lib/celebrations";

export type PersonId = "priya" | "amit" | "neha" | "ravi";
export type Role = "owner" | "admin" | "moderator" | "member";

export type Person = { id: PersonId; name: string; short: string; label: string; blurb: string; gradient: string };
export type CommunityType = "Family" | "Friends" | "Community";
export type Community = { id: string; name: string; type: CommunityType; description: string; gradient: string };
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
  { id: "anjali-wedding", dream: "Wedding photography and mehendi decor for Anjali's big day.", communityId: "sharma-family", kind: "wedding", title: "Anjali's Wedding", date: "2027-02-14", goal: 150000, recorded: 108000, wishes: 6 },
  { id: "dadi-birthday", dream: "A family lunch and a new pair of reading glasses for Dadi's 75th.", communityId: "sharma-family", kind: "birthday", title: "Dadi's 75th Birthday", date: "2027-01-09", goal: 40000, recorded: 31000, wishes: 4 },
  { id: "parents-anniversary", dream: "A surprise 25th anniversary dinner with the whole family.", communityId: "sharma-family", kind: "anniversary", title: "Mummy & Papa's 25th Anniversary", date: "2027-03-22", goal: 60000, recorded: 12000, wishes: 3 },
  { id: "aman-neha-engagement", dream: "Matching rings and a small ring-ceremony party.", communityId: "delhi-friends", kind: "engagement", title: "Aman & Pooja's Engagement", date: "2027-01-30", goal: 50000, recorded: 22500, wishes: 3 },
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
