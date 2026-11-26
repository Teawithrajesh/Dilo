"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { CommunityPhoto, Cover } from "@/components/app/CommunityArt";
import { ImagePick } from "@/components/app/ImagePick";
import { Icon } from "@/components/Icon";
import { coverChoices, type CommunityType } from "@/lib/demo/data";
import { useDemo } from "@/lib/demo/store";

const types: CommunityType[] = ["Family", "Friends", "Community"];
const MAX_NAME = 40;
const input = "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none";

export default function NewCommunity() {
  const d = useDemo();
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<CommunityType>("Family");
  const [description, setDescription] = useState("");
  const [gradient, setGradient] = useState(coverChoices[0]);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [photo, setPhoto] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please give your community a name.");
    const id = d.createCommunity({ name, type, description, gradient, coverImage, photo });
    router.push(`/community/?id=${id}`);
  }

  return (
    <AppShell title="New community">
      <form onSubmit={submit} noValidate className="space-y-6">
        {/* Live preview: cover banner + community photo, like a profile page */}
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="relative">
            <Cover c={{ gradient, coverImage, name: name || "New community" }} className="h-36" />
            <ImagePick
              label="Add cover photo"
              testId="new-cover-input"
              onPick={setCoverImage}
              className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-black/55 px-4 text-small font-semibold text-white backdrop-blur"
            >
              <Icon name="camera" className="h-4 w-4" /> {coverImage ? "Change cover" : "Add cover"}
            </ImagePick>
          </div>
          <div className="relative -mt-10 flex items-end gap-3 px-4 pb-4">
            <div className="relative">
              <CommunityPhoto c={{ gradient, photo, name: name || "New community" }} size="h-20 w-20 text-heading" ring />
              <ImagePick
                label="Add community photo"
                testId="new-photo-input"
                onPick={setPhoto}
                className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full border-4 border-navy bg-white text-navy"
              >
                <Icon name="camera" className="h-4 w-4" />
              </ImagePick>
            </div>
            <p className="pb-1 font-display font-bold">{name || "Your community"}</p>
          </div>
        </div>

        <fieldset>
          <legend className="text-small font-semibold">No photo yet? Pick a colour</legend>
          <div className="mt-2 flex gap-3">
            {coverChoices.map((g, i) => (
              <button
                key={g}
                type="button"
                aria-label={`Cover ${i + 1}`}
                aria-pressed={g === gradient}
                onClick={() => setGradient(g)}
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${g} ring-offset-2 ring-offset-navy transition ${g === gradient ? "ring-2 ring-white" : "opacity-70"}`}
              />
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="cname" className="text-small font-semibold">Community name</label>
          <input id="cname" value={name} maxLength={MAX_NAME} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sharma Family" className={`${input} mt-2 min-h-12`} />
        </div>

        <fieldset>
          <legend className="text-small font-semibold">Type</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === type}
                onClick={() => setType(t)}
                className={`min-h-11 rounded-full border text-small font-semibold transition ${t === type ? "border-white bg-white text-navy" : "border-white/20"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="cdesc" className="text-small font-semibold">Description <span className="text-white/60">(optional)</span></label>
          <textarea id="cdesc" value={description} maxLength={200} rows={3} onChange={(e) => setDescription(e.target.value)} placeholder="What is this community for?" className={`${input} mt-2 resize-none py-3`} />
        </div>

        <p className="flex items-center gap-2 text-small text-white/70">🔒 Private by default. Only people you approve can see it.</p>

        {error && <p role="alert" className="text-small text-[#ffd0da]">{error}</p>}

        <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange font-display font-bold text-navy transition active:scale-[0.98]">
          Create community
        </button>
      </form>
    </AppShell>
  );
}
