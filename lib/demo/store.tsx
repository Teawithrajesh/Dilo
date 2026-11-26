"use client";

// In-browser demo state. Nothing is sent anywhere. A page refresh resets everything
// except which demo person you picked (kept for this browser tab only).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as seed from "./data";
import type { Activity, Community, CommunityType, Contribution, DemoEvent, InviteLink, Membership, Notice, Person, PersonId, Priority, Role, Wish } from "./data";
import type { CelebrationSlug } from "@/lib/celebrations";
import { can } from "@/lib/permissions";

const SESSION_KEY = "dilo-demo-person";
const INVITE_DAYS = 7;

type JoinRequest = { communityId: string; personId: PersonId };

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
  }, []);

  const signOut = useCallback(() => {
    setMeId(null);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const value = useMemo<DemoState>(() => {
    const me = seed.people.find((p) => p.id === meId) ?? null;
    const person = (id: PersonId) => seed.people.find((p) => p.id === id)!;
    const community = (id: string) => communities.find((c) => c.id === id);
    const roleOf = (cid: string, pid: PersonId) => memberships.find((m) => m.communityId === cid && m.personId === pid)?.role ?? null;
    const roleIn = (cid: string) => (meId ? roleOf(cid, meId) : null);
    const myCommunities = communities.filter((c) => roleIn(c.id) !== null);
    const today = new Date().toISOString().slice(0, 10);
    const myNotices = notices.filter((n) => n.personId === meId);
    // "Recorded" always comes from the contribution records (self-reported + confirmed).
    const recordedFor = (eid: string) => contribs.filter((c) => c.eventId === eid).reduce((t, c) => t + c.amount, 0);
    const liveEvents = events.map((e) => ({ ...e, recorded: recordedFor(e.id) }));
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

      createCommunity: ({ name, type, description, gradient, coverImage, photo }) => {
        const id = slugify(name);
        setCommunities((c) => [...c, { id, name: name.trim(), type, description: description.trim(), gradient, coverImage, photo }]);
        if (meId) setMemberships((m) => [...m, { communityId: id, personId: meId, role: "owner" }]);
        return id;
      },

      setCommunityImages: (cid, images) => {
        if (!can.editCommunity(roleIn(cid))) return { ok: false, error: "Only owners and admins can change the photos." };
        setCommunities((c) => c.map((x) => (x.id === cid ? { ...x, ...images } : x)));
        return { ok: true };
      },

      createEvent: ({ communityId, kind, title, date, goal, dream, photo, invitation }) => {
        if (!meId || !can.createEvent(roleIn(communityId))) return { ok: false, error: "Join this community before adding a celebration." };
        const id = slugify(title);
        setEvents((e) => [...e, { id, communityId, kind, title: title.trim(), date, goal, recorded: 0, wishes: 0, dream: dream.trim(), createdBy: meId, photo, invitation }]);
        // Every member of the community hears about it (except the person who added it).
        const others = memberships.filter((m) => m.communityId === communityId && m.personId !== meId).map((m) => m.personId);
        const when = new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        notify(others, `${person(meId).short} added a new celebration in ${community(communityId)?.name}: ${title.trim()} on ${when}.`);
        log(communityId, `${person(meId).short} created ${title.trim()}.`, id);
        return { ok: true, id };
      },

      setEventImages: (eventId, images) => {
        setEvents((e) => e.map((x) => (x.id === eventId && roleIn(x.communityId) !== null ? { ...x, ...images } : x)));
      },

      createInvite: (cid) => {
        if (!meId || !can.invite(roleIn(cid))) return null;
        const link: InviteLink = { code: randomCode(), communityId: cid, createdBy: meId, expiresAt: Date.now() + INVITE_DAYS * 86_400_000, revoked: false, maxUses: 20, uses: 0 };
        setLinks((l) => [link, ...l]);
        return link;
      },

      revokeInvite: (code) => {
        setLinks((l) => l.map((x) => (x.code === code && can.invite(roleIn(x.communityId)) ? { ...x, revoked: true } : x)));
      },

      requestToJoin: (cid, viaCode) => {
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
      },

      decide: (cid, pid, approve) => {
        if (!can.approveMembers(roleIn(cid))) return { ok: false, error: "Only owners, admins and moderators can do this." };
        if (!requests.some((r) => r.communityId === cid && r.personId === pid)) return { ok: false, error: "That request is no longer waiting." };
        setRequests((r) => r.filter((x) => !(x.communityId === cid && x.personId === pid)));
        const name = community(cid)?.name ?? "the community";
        if (approve) {
          const existing = memberships.filter((m) => m.communityId === cid && m.personId !== meId).map((m) => m.personId);
          setMemberships((m) => [...m, { communityId: cid, personId: pid, role: "member" }]);
          notify([pid], `Welcome! You are now a member of ${name}.`);
          notify(existing, `${person(pid).name} joined ${name}.`);
          log(cid, `${person(pid).name} joined the community.`);
        } else {
          notify([pid], `Your request to join ${name} was not approved.`);
        }
        return { ok: true };
      },

      setRole: (cid, pid, role) => {
        const target = roleOf(cid, pid);
        if (!target || !can.changeRole(roleIn(cid), target) || role === "owner") return { ok: false, error: "You can't change this person's role." };
        setMemberships((m) => m.map((x) => (x.communityId === cid && x.personId === pid ? { ...x, role } : x)));
        notify([pid], `You are now a ${role} in ${community(cid)?.name}.`);
        return { ok: true };
      },

      removeMember: (cid, pid) => {
        const target = roleOf(cid, pid);
        const rule = lastOwnerRule(cid, pid, false);
        if (rule) return { ok: false, error: rule };
        if (!can.remove(roleIn(cid), target!)) return { ok: false, error: "You can't remove this person." };
        setMemberships((m) => m.filter((x) => !(x.communityId === cid && x.personId === pid)));
        notify([pid], `You were removed from ${community(cid)?.name}.`);
        return { ok: true };
      },

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

      addWish: (eid, w) => {
        if (!isOrganiser(eid)) return { ok: false, error: "Only the organiser can add wishes." };
        if (!w.title.trim()) return { ok: false, error: "Please name the wish." };
        if (!Number.isInteger(w.cost) || w.cost <= 0) return { ok: false, error: "Please enter the cost in whole rupees." };
        const pos = Math.max(0, ...wishes.filter((x) => x.eventId === eid).map((x) => x.position)) + 1;
        setWishes((list) => [...list, { id: `w-${Date.now()}`, eventId: eid, title: w.title.trim(), cost: w.cost, priority: w.priority, link: w.link?.trim() || undefined, fulfilled: false, position: pos }]);
        const e = findEvent(eid)!;
        log(e.communityId, `${person(meId!).short} added a wish to ${e.title}: ${w.title.trim()}.`, eid);
        return { ok: true };
      },

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

      toggleFulfilled: (wid) => {
        const w = wishes.find((x) => x.id === wid);
        if (!w || !isOrganiser(w.eventId)) return;
        setWishes((list) => list.map((x) => (x.id === wid ? { ...x, fulfilled: !x.fulfilled } : x)));
        if (!w.fulfilled) {
          const e = findEvent(w.eventId)!;
          log(e.communityId, `${w.title} is now covered for ${e.title}. 🎉`, e.id);
        }
      },

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
            return { ...c, shownName, isMine };
          })
          .reverse()
          .filter(() => !!e);
      },

      recordContribution: (eid, c) => {
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
          setEvents((list) => list.map((x) => (x.id === eid ? { ...x, celebrated: true } : x)));
          const all = memberships.filter((m) => m.communityId === e.communityId).map((m) => m.personId);
          notify(all, `🎉 ${e.title} reached its goal! Thank you, everyone.`);
          log(e.communityId, `🎉 ${e.title} reached its goal!`, eid);
        }
        return { ok: true };
      },

      confirmContribution: (id) => {
        const c = contribs.find((x) => x.id === id);
        if (!c || !isOrganiser(c.eventId)) return { ok: false, error: "Only the organiser can confirm." };
        setContribs((list) => list.map((x) => (x.id === id ? { ...x, status: "confirmed" } : x)));
        const e = findEvent(c.eventId)!;
        if (c.personId !== "sample") notify([c.personId], `${person(meId!).short} confirmed your contribution to ${e.title}. Thank you!`);
        return { ok: true };
      },

      removeContribution: (id) => {
        const c = contribs.find((x) => x.id === id);
        if (!c || c.personId !== meId || c.status !== "self_reported") return { ok: false, error: "You can only remove your own record before it's confirmed." };
        setContribs((list) => list.filter((x) => x.id !== id));
        return { ok: true };
      },

      feed: (cid) => activity.filter((a) => a.communityId === cid),
    };
  }, [ready, meId, communities, memberships, links, requests, notices, events, wishes, contribs, activity, signIn, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside <DemoProvider>");
  return v;
}
