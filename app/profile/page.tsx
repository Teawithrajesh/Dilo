"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Avatar } from "@/components/app/Avatar";
import { ImagePick } from "@/components/app/ImagePick";
import { SectionTitle } from "@/components/app/ui";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";
import { roleLabel } from "@/lib/permissions";

const box = "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";
const row = "flex min-h-14 items-center justify-between gap-3 px-4 font-semibold transition hover:bg-white/[0.04]";

export default function Profile() {
  const d = useDemo();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const me = d.me;
  if (!me) return <AppShell title="Profile">{null}</AppShell>;

  return (
    <AppShell title="Profile">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar person={me} size="h-24 w-24 text-title" />
          <ImagePick
            label="Change profile photo"
            testId="profile-photo-input"
            onPick={(url) => { d.updateProfile({ photo: url }); setMsg({ kind: "ok", text: "Photo updated." }); }}
            className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full border-4 border-navy bg-white text-navy"
          >
            <Icon name="camera" className="h-4 w-4" />
          </ImagePick>
        </div>
        <p className="mt-4 font-display text-title font-extrabold" data-testid="profile-name">{me.name}</p>
        <p className="mt-1 max-w-xs text-small text-white/70" data-testid="profile-bio">{me.bio || me.blurb}</p>
        <span className="mt-3 rounded-full bg-white/10 px-3 py-1 text-tiny font-semibold">Demo person · {me.label}</span>
      </div>

      {msg && <p role={msg.kind === "error" ? "alert" : "status"} className="mt-4 rounded-2xl bg-white/[0.06] px-4 py-3 text-center text-small">{msg.text}</p>}

      {editing ? (
        <form
          noValidate
          className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const r = d.updateProfile({ name, bio });
            if (!r.ok) return setMsg({ kind: "error", text: r.error });
            setEditing(false);
            setMsg({ kind: "ok", text: "Profile saved." });
          }}
        >
          <label className="block text-small font-semibold">
            Your name
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className={`${box} mt-1 min-h-12`} />
          </label>
          <label className="block text-small font-semibold">
            Short intro <span className="font-normal text-white/60">(optional)</span>
            <textarea value={bio} maxLength={140} rows={3} onChange={(e) => setBio(e.target.value)} placeholder="e.g. Proud Nani of three, loves planning surprises." className={`${box} mt-1 resize-none py-3`} />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-orange font-display font-bold text-navy">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 font-semibold">Cancel</button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => { setName(me.name); setBio(me.bio ?? ""); setEditing(true); setMsg(null); }}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 font-display font-semibold"
        >
          Edit profile
        </button>
      )}

      {!d.isPlatformAdmin && (
        <>
          <SectionTitle>My roles</SectionTitle>
          {d.myCommunities.length === 0 ? (
            <p className="text-small text-white/70">Not a member of any community yet.</p>
          ) : (
            <ul className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
              {d.myCommunities.map((c) => (
                <li key={c.id} className="flex items-center justify-between p-4">
                  <span className="font-semibold">{c.name}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-tiny font-semibold">{roleLabel[d.roleIn(c.id)!]}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <SectionTitle>Settings</SectionTitle>
      <nav aria-label="Settings" className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <Link href="/settings/" className={row}><span>Privacy &amp; safety</span><Icon name="arrow" className="h-5 w-5 text-white/60" /></Link>
        {!d.isPlatformAdmin && <Link href="/sparkles/" className={row}><span>✨ My Sparkles</span><Icon name="arrow" className="h-5 w-5 text-white/60" /></Link>}
        <Link href="/feedback/" className={row}><span>Send feedback</span><Icon name="arrow" className="h-5 w-5 text-white/60" /></Link>
        {d.moderatedCommunities.length > 0 && (
          <Link href="/moderation/" className={row}><span>Moderation</span><Icon name="arrow" className="h-5 w-5 text-white/60" /></Link>
        )}
        {d.isPlatformAdmin && (
          <Link href="/admin/" className={row}><span>Admin dashboard</span><Icon name="arrow" className="h-5 w-5 text-white/60" /></Link>
        )}
      </nav>

      <button
        type="button"
        onClick={() => { d.signOut(); router.push("/signin/"); }}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 font-display font-semibold transition hover:bg-white/10"
      >
        <Icon name="swap" className="h-5 w-5" />
        Switch demo person
      </button>
    </AppShell>
  );
}
