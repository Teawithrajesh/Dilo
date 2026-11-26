"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Avatar } from "@/components/app/Avatar";
import { SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { roleLabel } from "@/lib/permissions";

export default function Profile() {
  const { me, myCommunities, roleIn, signOut } = useDemo();
  const router = useRouter();
  if (!me) return <AppShell title="Profile">{null}</AppShell>;

  return (
    <AppShell title="Profile">
      <div className="flex flex-col items-center text-center">
        <Avatar person={me} size="h-24 w-24 text-title" />
        <p className="mt-4 font-display text-title font-extrabold">{me.name}</p>
        <p className="mt-1 max-w-xs text-small text-white/70">{me.blurb}</p>
        <span className="mt-3 rounded-full bg-white/10 px-3 py-1 text-tiny font-semibold">Demo person · {me.label}</span>
      </div>

      <SectionTitle>My roles</SectionTitle>
      {myCommunities.length === 0 ? (
        <p className="text-small text-white/70">Not a member of any community yet.</p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
          {myCommunities.map((c) => (
            <li key={c.id} className="flex items-center justify-between p-4">
              <span className="font-semibold">{c.name}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold">{roleLabel[roleIn(c.id)!]}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => { signOut(); router.push("/signin/"); }}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 font-display font-semibold transition hover:bg-white/10"
      >
        <Icon name="swap" className="h-5 w-5" />
        Switch demo person
      </button>
      <p className="mt-3 text-center text-tiny text-white/60">Privacy settings and editing your profile come in Step 7.</p>
    </AppShell>
  );
}
