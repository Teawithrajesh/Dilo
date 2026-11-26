"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Avatar } from "@/components/app/Avatar";
import { PrivateWall } from "@/components/app/CommunityView";
import { QueryParam } from "@/components/app/QueryParam";
import { SectionTitle } from "@/components/app/ui";
import { useDemo } from "@/lib/demo/store";
import { ReportButton } from "@/components/app/ReportButton";
import { can, roleLabel } from "@/lib/permissions";

const small = "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-small font-semibold transition active:scale-[0.98]";

function Members({ id }: { id: string }) {
  const d = useDemo();
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const c = d.community(id);
  const role = d.roleIn(id);

  if (!c || !can.seeCommunity(role)) {
    return (
      <AppShell title="Private">
        <PrivateWall />
      </AppShell>
    );
  }

  const say = (r: { ok: true } | { ok: false; error: string }, okText: string) =>
    setMsg(r.ok ? { kind: "ok", text: okText } : { kind: "error", text: r.error });

  const waiting = d.requestsFor(id);

  return (
    <AppShell title="Members">
      <p className="font-display text-heading font-bold">{c.name}</p>
      <p className="text-small text-white/60">You: {roleLabel[role!]}</p>

      {msg && (
        <p role={msg.kind === "error" ? "alert" : "status"} className={`mt-4 rounded-2xl px-4 py-3 text-small ${msg.kind === "error" ? "bg-[#ffb4c4]/15 text-[#ffd0da]" : "bg-white/[0.08]"}`}>
          {msg.text}
        </p>
      )}

      {can.approveMembers(role) && (
        <>
          <SectionTitle>Join requests</SectionTitle>
          {waiting.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-white/15 p-5 text-center text-small text-white/70">No one is waiting.</p>
          ) : (
            <ul className="space-y-2">
              {waiting.map((p) => (
                <li key={p.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" data-testid="request">
                  <div className="flex items-center gap-3">
                    <Avatar person={p} />
                    <span className="flex-1">
                      <span className="block font-semibold">{p.name}</span>
                      <span className="text-tiny text-white/60">Wants to join</span>
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => say(d.decide(id, p.id, false), `${p.short}'s request was declined.`)} className={`${small} border border-white/25`}>
                      Reject
                    </button>
                    <button type="button" onClick={() => say(d.decide(id, p.id, true), `${p.short} is now a member.`)} className={`${small} bg-orange font-bold text-navy`}>
                      Approve
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <SectionTitle>Members</SectionTitle>
      <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
        {d.members(id).map((m) => {
          const isMe = m.personId === d.me?.id;
          const canRole = !isMe && can.changeRole(role, m.role);
          const canRemove = !isMe && can.remove(role, m.role);
          return (
            <li key={m.personId} className="p-4" data-testid="member">
              <div className="flex items-center gap-3">
                <Avatar person={m.person} />
                <span className="flex-1 font-semibold">
                  {m.person.name}
                  {isMe && <span className="text-white/60"> (you)</span>}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold" data-testid="member-role">{roleLabel[m.role]}</span>
              </div>
              {!isMe && (
                <div className="mt-2 flex flex-wrap items-start gap-1">
                  <ReportButton communityId={id} target={{ type: "member", personId: m.personId }} summary={`Member: ${m.person.name}`} label="Report" />
                  {d.blocked.includes(m.personId) ? (
                    <button type="button" onClick={() => d.unblock(m.personId)} className="inline-flex min-h-11 items-center rounded-full px-3 text-small font-semibold text-white/70">Unblock</button>
                  ) : (
                    <button type="button" onClick={() => { d.block(m.personId); setMsg({ kind: "ok", text: `You blocked ${m.person.short}. Their messages are hidden from you.` }); }} className="inline-flex min-h-11 items-center rounded-full px-3 text-small font-semibold text-white/70">Block</button>
                  )}
                </div>
              )}
              {(canRole || canRemove) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {canRole && m.role === "member" && (
                    <button type="button" onClick={() => say(d.setRole(id, m.personId, "moderator"), `${m.person.short} is now a moderator.`)} className={`${small} border border-white/25`}>
                      Make moderator
                    </button>
                  )}
                  {canRole && m.role === "moderator" && (
                    <button type="button" onClick={() => say(d.setRole(id, m.personId, "member"), `${m.person.short} is now a member.`)} className={`${small} border border-white/25`}>
                      Make member
                    </button>
                  )}
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove ${m.person.name} from ${c.name}?`)) say(d.removeMember(id, m.personId), `${m.person.short} was removed.`);
                      }}
                      className={`${small} border border-[#ffb4c4]/40 text-[#ffd0da]`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-tiny text-white/60">Plus sample members not shown. Only the people above can be managed in this demo.</p>

      <button
        type="button"
        onClick={() => {
          const r = d.leave(id);
          if (r.ok) router.push("/communities/");
          else setMsg({ kind: "error", text: r.error });
        }}
        className={`${small} mt-8 w-full border border-white/20 text-white/80`}
      >
        Leave community
      </button>
    </AppShell>
  );
}

export default function MembersPage() {
  return <QueryParam name="id" render={(id) => <Members id={id} />} />;
}
