"use client";

// In-browser demo state. Nothing is sent anywhere. A page refresh resets everything
// except which demo person you picked (kept for this browser tab only).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as seed from "./data";
import type { Community, CommunityType, DemoEvent, InviteLink, Membership, Notice, Person, PersonId, Role } from "./data";
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
      event: (id) => events.find((e) => e.id === id),
      eventsIn: (cid) => events.filter((e) => e.communityId === cid),
      myUpcoming: events
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
    };
  }, [ready, meId, communities, memberships, links, requests, notices, events, signIn, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside <DemoProvider>");
  return v;
}
