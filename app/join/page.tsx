"use client";

import Link from "next/link";
import { Glows } from "@/components/landing/Glows";
import { QueryParam } from "@/components/app/QueryParam";
import { CommunityPhoto, Cover } from "@/components/app/CommunityArt";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";

const reasons = {
  "not-found": "This invite link isn't valid. Check the code, or ask for a new link.",
  expired: "This invite link has expired. Ask the person who invited you for a new one.",
  revoked: "This invite link was switched off. Ask for a new one.",
  "used-up": "This invite link has been used too many times. Ask for a new one.",
} as const;

function Join({ code }: { code: string }) {
  const d = useDemo();
  const check = d.checkInvite(code);

  return (
    <main className="relative grid min-h-[calc(100dvh-2rem)] place-items-center overflow-hidden bg-navy px-4 py-10 text-white">
      <Glows variant="soft" />
      <div className="relative w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="mx-auto h-auto w-16" />
        {!check.ok ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center" data-testid="invite-invalid">
            <Icon name="lock" className="mx-auto h-8 w-8 text-orange" />
            <p className="mt-3 font-display text-heading font-bold">Link not working</p>
            <p className="mt-2 text-small text-white/70">{reasons[check.reason]}</p>
            <Link href="/welcome/" className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-small font-semibold">Go to DILO</Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]" data-testid="invite-preview">
            {/* Only the name and cover are shown before approval */}
            <Cover c={check.community} className="h-28" />
            <div className="-mt-10 flex justify-center"><CommunityPhoto c={check.community} size="h-20 w-20 text-heading" ring /></div>
            <div className="p-6 pt-3 text-center">
              <p className="text-small text-white/70">You&apos;re invited to</p>
              <h1 className="mt-1 font-display text-title font-extrabold">{check.community.name}</h1>
              <p className="mt-2 flex items-center justify-center gap-1 text-tiny text-white/60">
                <Icon name="lock" className="h-4 w-4" /> Private. You&apos;ll see more after an admin approves you.
              </p>
              {!d.ready ? null : !d.me ? (
                <Link
                  href={`/signin/?next=${encodeURIComponent(`/join/?code=${code}`)}`}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy"
                >
                  Sign in to ask to join
                </Link>
              ) : d.roleIn(check.community.id) ? (
                <Link href={`/community/?id=${check.community.id}`} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 font-display font-semibold">
                  You&apos;re already a member · Open
                </Link>
              ) : d.hasRequested(check.community.id) ? (
                <p role="status" className="mt-6 rounded-2xl bg-white/[0.06] px-4 py-3 text-small">Request sent. Waiting for approval.</p>
              ) : (
                <button
                  type="button"
                  onClick={() => d.requestToJoin(check.community.id, code)}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy"
                >
                  Request to join
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function JoinPage() {
  return <QueryParam name="code" render={(code) => <Join code={code} />} />;
}
