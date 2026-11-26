"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { PrivateWall } from "@/components/app/CommunityView";
import { QueryParam } from "@/components/app/QueryParam";
import { SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { can } from "@/lib/permissions";
import type { InviteLink } from "@/lib/demo/data";

function daysLeft(l: InviteLink) {
  return Math.max(0, Math.ceil((l.expiresAt - Date.now()) / 86_400_000));
}

function Invite({ id }: { id: string }) {
  const d = useDemo();
  const [copied, setCopied] = useState<string | null>(null);
  const c = d.community(id);
  const role = d.roleIn(id);

  if (!c || !can.invite(role)) {
    return (
      <AppShell title="Invite">
        <PrivateWall title="Only owners, admins and moderators can invite" />
      </AppShell>
    );
  }

  const url = (code: string) => `${window.location.origin}/join/?code=${code}`;
  const message = (code: string) =>
    `💖 DILO — Together, We Make Dreams Come True.\n\nYou're invited to join "${c.name}", our private space for family celebrations.\n\nJoin here: ${url(code)}\nInvite code: ${code}`;

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(url(code));
      setCopied(code);
    } catch {
      setCopied(null);
    }
  }

  const links = d.linksFor(id);
  const live = links.filter((l) => !l.revoked && l.expiresAt > Date.now() && l.uses < l.maxUses);
  const old = links.filter((l) => !live.includes(l));

  return (
    <AppShell title="Invite">
      <p className="font-display text-heading font-bold">{c.name}</p>
      <p className="mt-1 text-small text-white/70">
        Anyone with the link can ask to join. You still approve every person. Links last {7} days and can be switched off any time.
      </p>

      <button
        type="button"
        onClick={() => d.createInvite(id)}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-orange font-display font-bold text-navy transition active:scale-[0.98]"
      >
        <Icon name="share" className="h-5 w-5" /> Create new invite link
      </button>

      <SectionTitle>Active links</SectionTitle>
      {live.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/15 p-5 text-center text-small text-white/70">No active links.</p>
      ) : (
        <ul className="space-y-3">
          {live.map((l) => (
            <li key={l.code} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" data-testid="invite-link">
              <p className="text-tiny font-semibold uppercase tracking-[0.2em] text-white/60">Invite code</p>
              <p className="mt-1 font-display text-title font-extrabold tracking-[0.15em]" data-testid="invite-code">{l.code}</p>
              <p className="mt-1 text-small text-white/60">
                Expires in {daysLeft(l)} days · used {l.uses} of {l.maxUses}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(message(l.code))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25d366] px-3 text-small font-bold text-[#062e16]"
                >
                  Share on WhatsApp
                </a>
                <button type="button" onClick={() => copy(l.code)} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-3 text-small font-semibold">
                  {copied === l.code ? "Copied ✓" : "Copy link"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => d.revokeInvite(l.code)}
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full text-small font-semibold text-[#ffd0da]"
              >
                Switch off this link
              </button>
            </li>
          ))}
        </ul>
      )}

      {old.length > 0 && (
        <>
          <SectionTitle>Old links</SectionTitle>
          <ul className="space-y-2">
            {old.map((l) => (
              <li key={l.code} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 text-small text-white/60" data-testid="old-link">
                <span className="font-semibold tracking-[0.1em]">{l.code}</span>
                <span>{l.revoked ? "Switched off" : l.expiresAt <= Date.now() ? "Expired" : "Used up"}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-6 text-center text-tiny text-white/60">Demo: links work in this browser tab only.</p>
    </AppShell>
  );
}

export default function InvitePage() {
  return <QueryParam name="id" render={(id) => <Invite id={id} />} />;
}
