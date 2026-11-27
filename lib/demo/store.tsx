"use client";

// In-browser demo state. Nothing is sent anywhere. A page refresh resets everything
// except which demo person you picked (kept for this browser tab only).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as seed from "./data";
import type { Activity, Community, CommunityType, Contribution, DemoEvent, InviteLink, Membership, ModerationAction, Notice, Person, PersonId, Priority, Report, ReportReason, ReportTarget, Role, Wish } from "./data";
import type { CelebrationSlug } from "@/lib/celebrations";
import { can } from "@/lib/permissions";

const SESSION_KEY = "dilo-demo-person";
const INVITE_DAYS = 7;

type JoinRequest = { communityId: string; personId: PersonId };

export type DreamCameTrue = { id: string; kind: "wish" | "goal"; title: string; eventId: string; eventTitle: string; eventKind: DemoEvent["kind"]; communityName: string; at: number };

export type InviteCheck =
  | { ok: true; link: InviteLink; community: Community }
  | { ok: false; reason: "not-found" | "expired" | "revoked" | "used-up"; community?: Community };

type Result = { ok: true } | { ok: false; error: string };

type DemoState = {
  ready: boolean;
  me: Person | null;
  signIn: (id: PersonId) => void;
  signOut: () => void;
  // reading
  community: (id: string) => Community | undefined;
  roleIn: (communityId: string) => Role | null;
  roleOf: (communityId: string, personId: PersonId) => Role | null;
  members: (communityId: string) => (Membership & { person: Person })[];
  myCommunities: Community[];
  memberCount: (communityId: string) => number;
  event: (id: string) => DemoEvent | undefined;
  eventsIn: (communityId: string) => DemoEvent[];
  myUpcoming: DemoEvent[];
  myInvites: { community: Community; from: Person; requested: boolean }[];
  requestsFor: (communityId: string) => Person[];
  hasRequested: (communityId: string) => boolean;
  linksFor: (communityId: string) => InviteLink[];
  checkInvite: (code: string) => InviteCheck;
  myNotices: Notice[];
  unread: number;
  // actions
  createCommunity: (input: { name: string; type: CommunityType; description: string; gradient: string; coverImage?: string; photo?: string }) => string;
  setCommunityImages: (communityId: string, images: { coverImage?: string; photo?: string }) => Result;
  createEvent: (input: { communityId: string; kind: CelebrationSlug; title: string; date: string; goal: number; dream: string; photo?: string; invitation?: string }) => { ok: true; id: string } | { ok: false; error: string };
  setEventImages: (eventId: string, images: { photo?: string; invitation?: string }) => void;
  createInvite: (communityId: string) => InviteLink | null;
  revokeInvite: (code: string) => void;
  requestToJoin: (communityId: string, viaCode?: string) => void;
  decide: (communityId: string, personId: PersonId, approve: boolean) => Result;
  setRole: (communityId: string, personId: PersonId, role: Role) => Result;
  removeMember: (communityId: string, personId: PersonId) => Result;
  leave: (communityId: string) => Result;
  markAllRead: () => void;
  // Step 6: wishlist, contributions, feed
  isOrganiser: (eventId: string) => boolean;
  wishesFor: (eventId: string) => Wish[];
  addWish: (eventId: string, w: { title: string; cost: number; priority: Priority; link?: string }) => Result;
  updateWish: (wishId: string, patch: Partial<Pick<Wish, "title" | "cost" | "priority" | "link">>) => Result;
  moveWish: (wishId: string, dir: -1 | 1) => void;
  toggleFulfilled: (wishId: string) => void;
  contributionsFor: (eventId: string) => (Contribution & { shownName: string; isMine: boolean })[];
  recordContribution: (eventId: string, c: { amount: number; wishId?: string; message?: string; anonymous: boolean }) => Result;
  confirmContribution: (contributionId: string) => Result;
  removeContribution: (contributionId: string) => Result;
  feed: (communityId: string) => Activity[];
  /** Wishes and goals that came true, in my communities only, newest first. */
  dreamsCameTrue: DreamCameTrue[];
  // Step 7: profile, privacy, safety, admin
  person: (id: PersonId) => Person;
  updateProfile: (p: { name?: string; bio?: string; photo?: string }) => Result;
  anonymousByDefault: boolean;
  setAnonymousByDefault: (on: boolean) => void;
  exportMyData: () => object;
  deleteAccount: () => Result;
  blocked: PersonId[];
  block: (id: PersonId) => void;
  unblock: (id: PersonId) => void;
  report: (r: { communityId: string; target: ReportTarget; summary: string; reason: ReportReason; note?: string }) => Result;
  reportsFor: (communityId: string) => Report[];
  moderatedCommunities: Community[];
  moderate: (reportId: string, action: "remove" | "dismiss") => Result;
  isSuspended: (communityId: string) => boolean;
  // platform admin only
  isPlatformAdmin: boolean;
  adminStats: { people: number; communities: number; celebrations: number; records: number; openReports: number };
  allReports: (Report & { communityName: string })[];
  allCommunities: (Community & { members: number; suspended: boolean })[];
  setSuspended: (communityId: string, on: boolean) => Result;
  actions: ModerationAction[];
};

const Ctx = createContext<DemoState | null>(null);

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid mix-ups
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function slugify(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30) || "community";
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [meId, setMeId] = useState<PersonId | null>(null);
  const [communities, setCommunities] = useState<Community[]>(seed.communities);
  const [memberships, setMemberships] = useState<Membership[]>(seed.memberships);
  const [links, setLinks] = useState<InviteLink[]>(seed.inviteLinks);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>(seed.notices);
  const [events, setEvents] = useState<DemoEvent[]>(seed.events);
  const [wishes, setWishes] = useState<Wish[]>(seed.wishes);
  const [contribs, setContribs] = useState<Contribution[]>(seed.contributions);
  const [activity, setActivity] = useState<Activity[]>(seed.activity);
  const [profiles, setProfiles] = useState<Partial<Record<PersonId, { name?: string; bio?: string; photo?: string }>>>({});
  const [anonDefault, setAnonDefault] = useState<Partial<Record<PersonId, boolean>>>({});
  const [blocks, setBlocks] = useState<{ by: PersonId; who: PersonId }[]>([]);
  const [reports, setReports] = useState<Report[]>(seed.reports);
  const [suspended, setSuspendedList] = useState<string[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);

  // A double-tap on a phone fires the same action twice before the screen updates.
  // The same action with the same details within 1 second runs once and returns the first result.
  const recent = useRef(new Map<string, { t: number; r: unknown }>());
  const once = useCallback(<T,>(key: string, fn: () => T): T => {
    const now = Date.now();
    const prev = recent.current.get(key);
    if (prev && now - prev.t < 1000) return prev.r as T;
    const r = fn();
    // Remember only actions that worked, so a corrected retry is never blocked.
    const failed = !!r && typeof r === "object" && (r as unknown as { ok?: boolean }).ok === false;
    if (!failed) recent.current.set(key, { t: now, r });
    return r;
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY) as PersonId | null;
      if (saved && seed.people.some((p) => p.id === saved)) setMeId(saved);
    } catch {
      /* storage blocked: stay signed out */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((id: PersonId) => {
    setMeId(id);
    try { sessionStorage.setItem(SESSION_KEY, id); } catch { /* ignore */ }
    // A new member gets the founder's welcome letter (by email from Phase 2; in the app for now).
    let welcomed = false;
    try { welcomed = sessionStorage.getItem(`dilo-welcomed-${id}`) === "1"; sessionStorage.setItem(`dilo-welcomed-${id}`, "1"); } catch { /* ignore */ }
    if (!welcomed) {
      setNotices((n) =>
        n.some((x) => x.personId === id && x.href === "/letter/")
          ? n
          : [{ id: `welcome-${id}`, personId: id, text: "📩 A welcome letter from Raj, DILO's founder. Tap to read.", when: "Just now", read: false, href: "/letter/" }, ...n],
      );
    }
  }, []);

  const signOut = useCallback(() => {
    setMeId(null);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const value = useMemo<DemoState>(() => {
    const person = (id: PersonId): Person => {
      const base = seed.people.find((p) => p.id === id)!;
      const o = profiles[id] ?? {};
      const name = o.name?.trim() || base.name;
      return { ...base, ...o, name, short: o.name?.trim() ? name.split(" ")[0] : base.short };
    };
    const me = meId ? person(meId) : null;
    const community = (id: string) => communities.find((c) => c.id === id);
    const roleOf = (cid: string, pid: PersonId) => memberships.find((m) => m.communityId === cid && m.personId === pid)?.role ?? null;
    const roleIn = (cid: string) => (meId ? roleOf(cid, meId) : null);
    const myCommunities = communities.filter((c) => roleIn(c.id) !== null);
    const today = new Date().toISOString().slice(0, 10);
    const myNotices = notices.filter((n) => n.personId === meId);
    // "Recorded" always comes from the contribution records (self-reported + confirmed).
    const recordedFor = (eid: string) => contribs.filter((c) => c.eventId === eid).reduce((t, c) => t + c.amount, 0);
    const liveEvents = events.filter((e) => !e.removed).map((e) => ({ ...e, recorded: recordedFor(e.id) }));
    const findEvent = (eid: string) => liveEvents.find((e) => e.id === eid);
    const isOrganiser = (eid: string) => {
      const e = findEvent(eid);
      if (!e || !meId) return false;
      const r = roleOf(e.communityId, meId);
      return r !== null && (e.createdBy === meId || r === "owner" || r === "admin");
    };
    const organisersOf = (e: DemoEvent) =>
      memberships
        .filter((m) => m.communityId === e.communityId && (m.personId === e.createdBy || m.role === "owner" || m.role === "admin"))
        .map((m) => m.personId);
    const log = (communityId: string, text: string, eventId?: string) =>
      setActivity((a) => [{ id: `a-${Date.now()}-${a.length}`, communityId, text, when: "Just now", eventId }, ...a]);
    const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

    const ownersOf = (cid: string) => memberships.filter((m) => m.communityId === cid && m.role === "owner");

    const notify = (personIds: PersonId[], text: string) =>
      setNotices((n) => [
        ...personIds.map((pid, i) => ({ id: `n-${Date.now()}-${i}-${pid}`, personId: pid, text, when: "Just now", read: false })),
        ...n,
      ]);
    const approversOf = (cid: string) =>
      memberships.filter((m) => m.communityId === cid && can.approveMembers(m.role)).map((m) => m.personId);

    const checkInvite = (code: string): InviteCheck => {
      const link = links.find((l) => l.code === code.trim().toUpperCase());
      if (!link) return { ok: false, reason: "not-found" };
      const c = community(link.communityId);
      if (!c) return { ok: false, reason: "not-found" };
      if (link.revoked) return { ok: false, reason: "revoked", community: c };
      if (link.expiresAt < Date.now()) return { ok: false, reason: "expired", community: c };
      if (link.uses >= link.maxUses) return { ok: false, reason: "used-up", community: c };
      return { ok: true, link, community: c };
    };

    const lastOwnerRule = (cid: string, pid: PersonId, self: boolean): string | null => {
      const target = roleOf(cid, pid);
      if (!target) return self ? "You aren't a member." : "That person isn't a member.";
      if (target === "owner" && ownersOf(cid).length <= 1)
        return self ? "You're the last owner, so you can't leave yet." : "The last owner can't be removed.";
      return null;
    };

    return {
      ready,
      me,
      signIn,
      signOut,
      community,
      roleIn,
      roleOf,
      members: (cid) =>
        memberships.filter((m) => m.communityId === cid).map((m) => ({ ...m, person: person(m.personId) })),
      myCommunities,
      memberCount: (cid) => memberships.filter((m) => m.communityId === cid).length + (seed.extraMemberCounts[cid] ?? 0),
      event: (id) => findEvent(id),
      eventsIn: (cid) => liveEvents.filter((e) => e.communityId === cid),
      myUpcoming: liveEvents
        .filter((e) => roleIn(e.communityId) !== null && e.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
      myInvites: seed.invites
        .filter((i) => i.personId === meId && roleIn(i.communityId) === null)
        .map((i) => ({
          community: community(i.communityId)!,
          from: person(i.from),
          requested: requests.some((r) => r.communityId === i.communityId && r.personId === meId),
        })),
      requestsFor: (cid) => requests.filter((r) => r.communityId === cid).map((r) => person(r.personId)),
      hasRequested: (cid) => requests.some((r) => r.communityId === cid && r.personId === meId),
      linksFor: (cid) => links.filter((l) => l.communityId === cid),
      checkInvite,
      myNotices,
      unread: myNotices.filter((n) => !n.read).length,

      createCommunity: ({ name, type, description, gradient, coverImage, photo }) => once(`createCommunity:${meId}:${name.trim()}`, () => {
        const id = slugify(name);
        setCommunities((c) => [...c, { id, name: name.trim(), type, description: description.trim(), gradient, coverImage, photo }]);
        if (meId) setMemberships((m) => [...m, { communityId: id, personId: meId, role: "owner" }]);
        return id;
      }),

      setCommunityImages: (cid, images) => {
        if (!can.editCommunity(roleIn(cid))) return { ok: false, error: "Only owners and admins can change the photos." };
        setCommunities((c) => c.map((x) => (x.id === cid ? { ...x, ...images } : x)));
        return { ok: true };
      },

      createEvent: ({ communityId, kind, title, date, goal, dream, photo, invitation }) => once(`createEvent:${meId}:${communityId}:${title.trim()}:${date}`, () => {
        if (!meId || !can.createEvent(roleIn(communityId))) return { ok: false, error: "Join this community before adding a celebration." };
        const id = slugify(title);
        setEvents((e) => [...e, { id, communityId, kind, title: title.trim(), date, goal, recorded: 0, wishes: 0, dream: dream.trim(), createdBy: meId, photo, invitation }]);
        // Every member of the community hears about it (except the person who added it).
        const others = memberships.filter((m) => m.communityId === communityId && m.personId !== meId).map((m) => m.personId);
        const when = new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        notify(others, `${person(meId).short} added a new celebration in ${community(communityId)?.name}: ${title.trim()} on ${when}.`);
        log(communityId, `${person(meId).short} created ${title.trim()}.`, id);
        return { ok: true, id };
      }),

      setEventImages: (eventId, images) => {
        setEvents((e) => e.map((x) => (x.id === eventId && roleIn(x.communityId) !== null ? { ...x, ...images } : x)));
      },

      createInvite: (cid) => once(`createInvite:${meId}:${cid}`, () => {
        if (!meId || !can.invite(roleIn(cid))) return null;
        const link: InviteLink = { code: randomCode(), communityId: cid, createdBy: meId, expiresAt: Date.now() + INVITE_DAYS * 86_400_000, revoked: false, maxUses: 20, uses: 0 };
        setLinks((l) => [link, ...l]);
        return link;
      }),

      revokeInvite: (code) => {
        setLinks((l) => l.map((x) => (x.code === code && can.invite(roleIn(x.communityId)) ? { ...x, revoked: true } : x)));
      },

      requestToJoin: (cid, viaCode) => once(`requestToJoin:${meId}:${cid}`, () => {
        if (!meId || roleIn(cid) !== null) return;
        if (requests.some((r) => r.communityId === cid && r.personId === meId)) return;
        if (viaCode) {
          const check = checkInvite(viaCode);
          if (!check.ok || check.community.id !== cid) return;
          setLinks((l) => l.map((x) => (x.code === check.link.code ? { ...x, uses: x.uses + 1 } : x)));
        }
        setRequests((r) => [...r, { communityId: cid, personId: meId }]);
        const name = community(cid)?.name ?? "the community";
        notify([meId], `Your request to join ${name} was sent. An admin will review it.`);
        notify(approversOf(cid), `${person(meId).name} asked to join ${name}.`);
      }),

      decide: (cid, pid, approve) => once(`decide:${cid}:${pid}`, () => {
        if (!can.approveMembers(roleIn(cid))) return { ok: false, error: "Only owners, admins and moderators can do this." };
        if (!requests.some((r) => r.communityId === cid && r.personId === pid)) return { ok: false, error: "That request is no longer waiting." };
        setRequests((r) => r.filter((x) => !(x.communityId === cid && x.personId === pid)));
        const name = community(cid)?.name ?? "the community";
        if (approve) {
          const existing = memberships.filter((m) => m.communityId === cid && m.personId !== meId).map((m) => m.personId);
          setMemberships((m) => (m.some((x) => x.communityId === cid && x.personId === pid) ? m : [...m, { communityId: cid, personId: pid, role: "member" }]));
          notify([pid], `Welcome! You are now a member of ${name}.`);
          notify(existing, `${person(pid).name} joined ${name}.`);
          log(cid, `${person(pid).name} joined the community.`);
        } else {
          notify([pid], `Your request to join ${name} was not approved.`);
        }
        return { ok: true };
      }),

      setRole: (cid, pid, role) => once(`setRole:${cid}:${pid}:${role}`, () => {
        const target = roleOf(cid, pid);
        if (!target || !can.changeRole(roleIn(cid), target) || role === "owner") return { ok: false, error: "You can't change this person's role." };
        setMemberships((m) => m.map((x) => (x.communityId === cid && x.personId === pid ? { ...x, role } : x)));
        notify([pid], `You are now a ${role} in ${community(cid)?.name}.`);
        return { ok: true };
      }),

      removeMember: (cid, pid) => once(`removeMember:${cid}:${pid}`, () => {
        const target = roleOf(cid, pid);
        const rule = lastOwnerRule(cid, pid, false);
        if (rule) return { ok: false, error: rule };
        if (!can.remove(roleIn(cid), target!)) return { ok: false, error: "You can't remove this person." };
        setMemberships((m) => m.filter((x) => !(x.communityId === cid && x.personId === pid)));
        notify([pid], `You were removed from ${community(cid)?.name}.`);
        return { ok: true };
      }),

      leave: (cid) => {
        if (!meId) return { ok: false, error: "Not signed in." };
        const rule = lastOwnerRule(cid, meId, true);
        if (rule) return { ok: false, error: rule };
        setMemberships((m) => m.filter((x) => !(x.communityId === cid && x.personId === meId)));
        return { ok: true };
      },

      markAllRead: () => setNotices((n) => n.map((x) => (x.personId === meId ? { ...x, read: true } : x))),

      isOrganiser,
      wishesFor: (eid) => wishes.filter((w) => w.eventId === eid).sort((a, b) => a.position - b.position),

      addWish: (eid, w) => once(`addWish:${eid}:${w.title.trim()}:${w.cost}`, () => {
        if (!isOrganiser(eid)) return { ok: false, error: "Only the organiser can add wishes." };
        if (!w.title.trim()) return { ok: false, error: "Please name the wish." };
        if (!Number.isInteger(w.cost) || w.cost <= 0) return { ok: false, error: "Please enter the cost in whole rupees." };
        const pos = Math.max(0, ...wishes.filter((x) => x.eventId === eid).map((x) => x.position)) + 1;
        setWishes((list) => [...list, { id: `w-${Date.now()}`, eventId: eid, title: w.title.trim(), cost: w.cost, priority: w.priority, link: w.link?.trim() || undefined, fulfilled: false, position: pos }]);
        const e = findEvent(eid)!;
        log(e.communityId, `${person(meId!).short} added a wish to ${e.title}: ${w.title.trim()}.`, eid);
        return { ok: true };
      }),

      updateWish: (wid, patch) => {
        const w = wishes.find((x) => x.id === wid);
        if (!w || !isOrganiser(w.eventId)) return { ok: false, error: "Only the organiser can edit wishes." };
        if (patch.title !== undefined && !patch.title.trim()) return { ok: false, error: "Please name the wish." };
        if (patch.cost !== undefined && (!Number.isInteger(patch.cost) || patch.cost <= 0)) return { ok: false, error: "Please enter the cost in whole rupees." };
        setWishes((list) => list.map((x) => (x.id === wid ? { ...x, ...patch, title: (patch.title ?? x.title).trim() } : x)));
        return { ok: true };
      },

      moveWish: (wid, dir) => {
        const w = wishes.find((x) => x.id === wid);
        if (!w || !isOrganiser(w.eventId)) return;
        const sorted = wishes.filter((x) => x.eventId === w.eventId).sort((a, b) => a.position - b.position);
        const i = sorted.findIndex((x) => x.id === wid);
        const j = i + dir;
        if (j < 0 || j >= sorted.length) return;
        const a = sorted[i], b = sorted[j];
        setWishes((list) => list.map((x) => (x.id === a.id ? { ...x, position: b.position } : x.id === b.id ? { ...x, position: a.position } : x)));
      },

      toggleFulfilled: (wid) => once(`toggleFulfilled:${wid}`, () => {
        const w = wishes.find((x) => x.id === wid);
        if (!w || !isOrganiser(w.eventId)) return;
        setWishes((list) => list.map((x) => (x.id === wid ? { ...x, fulfilled: !x.fulfilled, fulfilledAt: x.fulfilled ? undefined : Date.now() } : x)));
        if (!w.fulfilled) {
          const e = findEvent(w.eventId)!;
          log(e.communityId, `${w.title} is now covered for ${e.title}. 🎉`, e.id);
        }
      }),

      contributionsFor: (eid) => {
        const e = findEvent(eid);
        const org = isOrganiser(eid);
        return contribs
          .filter((c) => c.eventId === eid)
          .map((c) => {
            const isMine = c.personId === meId;
            const realName = c.personId === "sample" ? c.sampleName ?? "Sample guest" : person(c.personId).name;
            // Anonymous: only the contributor and the organiser see the name.
            const shownName = c.anonymous && !isMine && !org ? "Anonymous" : realName;
            const isBlocked = c.personId !== "sample" && blocks.some((b) => b.by === meId && b.who === c.personId);
            return { ...c, shownName, isMine, message: isBlocked ? undefined : c.message };
          })
          .reverse()
          .filter(() => !!e);
      },

      recordContribution: (eid, c) => once(`record:${meId}:${eid}:${c.amount}:${c.message ?? ""}`, () => {
        const e = findEvent(eid);
        if (!e || !meId || roleIn(e.communityId) === null) return { ok: false, error: "Only members can record a contribution." };
        if (!Number.isInteger(c.amount) || c.amount <= 0) return { ok: false, error: "Please enter the amount in whole rupees." };
        if (c.amount > 1_00_00_000) return { ok: false, error: "Please enter an amount up to ₹1,00,00,000." };
        setContribs((list) => [...list, { id: `c-${Date.now()}`, eventId: eid, personId: meId, amount: c.amount, wishId: c.wishId || undefined, message: c.message?.trim() || undefined, anonymous: c.anonymous, status: "self_reported", when: "Just now" }]);
        const who = c.anonymous ? "Someone" : person(meId).short;
        log(e.communityId, `${who} recorded a contribution to ${e.title}.`, eid);
        notify(organisersOf(e).filter((p) => p !== meId), `${c.anonymous ? "Someone (anonymous)" : person(meId).name} recorded ${inr(c.amount)} for ${e.title}. Please confirm when you can.`);
        const total = e.recorded + c.amount;
        if (total >= e.goal && !e.celebrated) {
          setEvents((list) => list.map((x) => (x.id === eid ? { ...x, celebrated: true, celebratedAt: Date.now() } : x)));
          const all = memberships.filter((m) => m.communityId === e.communityId).map((m) => m.personId);
          notify(all, `🎉 ${e.title} reached its goal! Thank you, everyone.`);
          log(e.communityId, `🎉 ${e.title} reached its goal!`, eid);
        }
        return { ok: true };
      }),

      confirmContribution: (id) => once(`confirm:${id}`, () => {
        const c = contribs.find((x) => x.id === id);
        if (!c || !isOrganiser(c.eventId)) return { ok: false, error: "Only the organiser can confirm." };
        setContribs((list) => list.map((x) => (x.id === id ? { ...x, status: "confirmed" } : x)));
        const e = findEvent(c.eventId)!;
        if (c.personId !== "sample") notify([c.personId], `${person(meId!).short} confirmed your contribution to ${e.title}. Thank you!`);
        return { ok: true };
      }),

      removeContribution: (id) => {
        const c = contribs.find((x) => x.id === id);
        if (!c || c.personId !== meId || c.status !== "self_reported") return { ok: false, error: "You can only remove your own record before it's confirmed." };
        setContribs((list) => list.filter((x) => x.id !== id));
        return { ok: true };
      },

      feed: (cid) => activity.filter((a) => a.communityId === cid),

      dreamsCameTrue: [
        ...wishes
          .filter((w) => w.fulfilled)
          .map((w) => ({ w, e: findEvent(w.eventId) }))
          .filter(({ e }) => e && roleIn(e.communityId) !== null)
          .map(({ w, e }) => ({ id: `wish-${w.id}`, kind: "wish" as const, title: w.title, eventId: e!.id, eventTitle: e!.title, eventKind: e!.kind, communityName: community(e!.communityId)?.name ?? "", at: w.fulfilledAt ?? 0 })),
        ...liveEvents
          .filter((e) => e.recorded >= e.goal && roleIn(e.communityId) !== null)
          .map((e) => ({ id: `goal-${e.id}`, kind: "goal" as const, title: e.dream, eventId: e.id, eventTitle: e.title, eventKind: e.kind, communityName: community(e.communityId)?.name ?? "", at: e.celebratedAt ?? 0 })),
      ].sort((a, b) => b.at - a.at),

      person,
      updateProfile: ({ name, bio, photo }) => {
        if (!meId) return { ok: false, error: "Not signed in." };
        if (name !== undefined && !name.trim()) return { ok: false, error: "Please enter your name." };
        setProfiles((p) => ({ ...p, [meId]: { ...p[meId], ...(name !== undefined ? { name: name.trim().slice(0, 40) } : {}), ...(bio !== undefined ? { bio: bio.trim().slice(0, 140) } : {}), ...(photo ? { photo } : {}) } }));
        return { ok: true };
      },
      anonymousByDefault: !!(meId && anonDefault[meId]),
      setAnonymousByDefault: (on) => { if (meId) setAnonDefault((a) => ({ ...a, [meId]: on })); },

      exportMyData: () => {
        if (!meId) return {};
        const mine = (pid: PersonId | "sample") => pid === meId;
        return {
          exportedAt: new Date().toISOString(),
          note: "DILO demo data export. In the real app this file lists everything DILO stores about you.",
          profile: { name: person(meId).name, bio: person(meId).bio ?? "", hasPhoto: !!person(meId).photo },
          settings: { anonymousByDefault: !!anonDefault[meId] },
          communities: memberships.filter((m) => m.personId === meId).map((m) => ({ community: community(m.communityId)?.name, role: m.role })),
          contributions: contribs.filter((c) => mine(c.personId)).map((c) => ({ event: findEvent(c.eventId)?.title, amount: c.amount, anonymous: c.anonymous, status: c.status, message: c.message ?? "" })),
          notifications: notices.filter((n) => n.personId === meId).map((n) => n.text),
          blocked: blocks.filter((b) => b.by === meId).map((b) => person(b.who).name),
        };
      },

      deleteAccount: () => {
        if (!meId) return { ok: false, error: "Not signed in." };
        const lastOwnerOf = communities.filter((c) => roleOf(c.id, meId) === "owner" && ownersOf(c.id).length <= 1);
        if (lastOwnerOf.length) return { ok: false, error: `You're the only owner of ${lastOwnerOf.map((c) => c.name).join(", ")}. Make someone else an owner first.` };
        setMemberships((m) => m.filter((x) => x.personId !== meId));
        return { ok: true };
      },

      blocked: blocks.filter((b) => b.by === meId).map((b) => b.who),
      block: (id) => { if (meId && id !== meId) setBlocks((b) => (b.some((x) => x.by === meId && x.who === id) ? b : [...b, { by: meId, who: id }])); },
      unblock: (id) => setBlocks((b) => b.filter((x) => !(x.by === meId && x.who === id))),

      report: ({ communityId, target, summary, reason, note }) => once(`report:${meId}:${JSON.stringify(target)}`, () => {
        if (!meId || roleIn(communityId) === null) return { ok: false, error: "Only members can report." };
        const r: Report = { id: `r-${Date.now()}`, communityId, reporterId: meId, target, summary, reason, note: note?.trim() || undefined, status: "open", when: "Just now" };
        setReports((list) => [r, ...list]);
        notify(approversOf(communityId).filter((p) => p !== meId), `New report in ${community(communityId)?.name}: ${summary}. Please review.`);
        return { ok: true };
      }),
      reportsFor: (cid) => (can.approveMembers(roleIn(cid)) ? reports.filter((r) => r.communityId === cid) : []),
      moderatedCommunities: communities.filter((c) => can.approveMembers(roleIn(c.id))),

      moderate: (reportId, action) => once(`moderate:${reportId}`, () => {
        const r = reports.find((x) => x.id === reportId);
        if (!r || !meId) return { ok: false, error: "Report not found." };
        if (!can.approveMembers(roleIn(r.communityId))) return { ok: false, error: "Only owners, admins and moderators can act on reports." };
        if (action === "remove") {
          const t = r.target;
          if (t.type === "contribution") setContribs((list) => list.filter((c) => c.id !== t.contributionId));
          else if (t.type === "event") setEvents((list) => list.map((e) => (e.id === t.eventId ? { ...e, removed: true } : e)));
          else {
            const target = roleOf(r.communityId, t.personId);
            if (target && !can.remove(roleIn(r.communityId), target)) return { ok: false, error: "You can't remove this person (their role is equal to or higher than yours)." };
            setMemberships((m) => m.filter((x) => !(x.communityId === r.communityId && x.personId === t.personId)));
          }
        }
        setReports((list) => list.map((x) => (x.id === reportId ? { ...x, status: action === "remove" ? "removed" : "dismissed" } : x)));
        setActions((a) => [{ id: `m-${Date.now()}`, reportId, byId: meId, action: action === "remove" ? "removed" : "dismissed", when: "Just now" }, ...a]);
        notify([r.reporterId], action === "remove" ? "Thanks for your report. The content was removed." : "Thanks for your report. A moderator reviewed it and left it up.");
        return { ok: true };
      }),
      isSuspended: (cid) => suspended.includes(cid),

      isPlatformAdmin: !!me?.platformAdmin,
      adminStats: {
        people: seed.people.filter((p) => !p.platformAdmin).length + Object.values(seed.extraMemberCounts).reduce((a, b) => a + b, 0),
        communities: communities.length,
        celebrations: liveEvents.length,
        records: contribs.length,
        openReports: reports.filter((r) => r.status === "open").length,
      },
      // The admin sees what was reported (the summary), never the community's private content.
      allReports: me?.platformAdmin ? reports.map((r) => ({ ...r, communityName: community(r.communityId)?.name ?? "" })) : [],
      allCommunities: me?.platformAdmin
        ? communities.map((c) => ({ ...c, members: memberships.filter((m) => m.communityId === c.id).length + (seed.extraMemberCounts[c.id] ?? 0), suspended: suspended.includes(c.id) }))
        : [],
      setSuspended: (cid, on) => {
        if (!me?.platformAdmin) return { ok: false, error: "Only the platform admin can do this." };
        setSuspendedList((l) => (on ? [...new Set([...l, cid])] : l.filter((x) => x !== cid)));
        setActions((a) => [{ id: `m-${Date.now()}`, reportId: "", byId: meId!, action: on ? "suspended" : "restored", when: "Just now" }, ...a]);
        notify(memberships.filter((m) => m.communityId === cid).map((m) => m.personId), on ? `${community(cid)?.name} was suspended by DILO while we review a report.` : `${community(cid)?.name} is active again.`);
        return { ok: true };
      },
      actions,
    };
  }, [ready, meId, communities, memberships, links, requests, notices, events, wishes, contribs, activity, profiles, anonDefault, blocks, reports, suspended, actions, signIn, signOut, once]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside <DemoProvider>");
  return v;
}
