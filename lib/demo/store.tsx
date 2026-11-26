"use client";

// In-browser demo state. Nothing is sent anywhere. A page refresh resets everything
// except which demo person you picked (kept for this browser tab only).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as seed from "./data";
import type { Community, DemoEvent, Notice, Person, PersonId, Role } from "./data";

const SESSION_KEY = "dilo-demo-person";

type JoinRequest = { communityId: string; personId: PersonId };

type DemoState = {
  ready: boolean;
  me: Person | null;
  signIn: (id: PersonId) => void;
  signOut: () => void;
  roleIn: (communityId: string) => Role | null;
  myCommunities: Community[];
  memberCount: (communityId: string) => number;
  eventsIn: (communityId: string) => DemoEvent[];
  myUpcoming: DemoEvent[];
  myInvites: { community: Community; from: Person; requested: boolean }[];
  requestToJoin: (communityId: string) => void;
  pendingRequests: (communityId: string) => number;
  myNotices: Notice[];
  unread: number;
  markAllRead: () => void;
};

const Ctx = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [meId, setMeId] = useState<PersonId | null>(null);
  const [notices, setNotices] = useState<Notice[]>(seed.notices);
  const [requests, setRequests] = useState<JoinRequest[]>([]);

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
    const roleIn = (communityId: string) =>
      seed.memberships.find((m) => m.communityId === communityId && m.personId === meId)?.role ?? null;
    const myCommunities = seed.communities.filter((c) => roleIn(c.id) !== null);
    const today = new Date().toISOString().slice(0, 10);
    const myUpcoming = seed.events
      .filter((e) => roleIn(e.communityId) !== null && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    const myNotices = notices.filter((n) => n.personId === meId);

    return {
      ready,
      me,
      signIn,
      signOut,
      roleIn,
      myCommunities,
      memberCount: (id) => seed.memberships.filter((m) => m.communityId === id).length + (seed.extraMemberCounts[id] ?? 0),
      eventsIn: (id) => seed.events.filter((e) => e.communityId === id),
      myUpcoming,
      myInvites: seed.invites
        .filter((i) => i.personId === meId && roleIn(i.communityId) === null)
        .map((i) => ({
          community: seed.communities.find((c) => c.id === i.communityId)!,
          from: seed.people.find((p) => p.id === i.from)!,
          requested: requests.some((r) => r.communityId === i.communityId && r.personId === meId),
        })),
      requestToJoin: (communityId) => {
        if (!meId) return;
        setRequests((r) => (r.some((x) => x.communityId === communityId && x.personId === meId) ? r : [...r, { communityId, personId: meId }]));
        setNotices((n) => [
          { id: `req-${Date.now()}`, personId: meId, text: "Your request to join was sent. An admin will review it.", when: "Just now", read: false },
          ...n,
        ]);
      },
      pendingRequests: (communityId) => requests.filter((r) => r.communityId === communityId).length,
      myNotices,
      unread: myNotices.filter((n) => !n.read).length,
      markAllRead: () => setNotices((n) => n.map((x) => (x.personId === meId ? { ...x, read: true } : x))),
    };
  }, [ready, meId, notices, requests, signIn, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used inside <DemoProvider>");
  return v;
}
