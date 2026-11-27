import Link from "next/link";
import { CONTACT_EMAIL, PRIVACY_VERSION } from "@/lib/site";

export const metadata = { title: "Privacy notice · DILO" };

// Plain-language notice for the demo + early-access stage. To be reviewed by a lawyer before real accounts.
export default function Privacy() {
  const h = "mt-8 font-display text-heading font-bold";
  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-navy px-4 pb-16 text-white">
      <article className="mx-auto max-w-2xl pt-10 text-white/85">
        <Link href="/welcome/" className="inline-flex min-h-11 items-center text-small font-semibold text-white/70 hover:text-white">← DILO</Link>
        <h1 className="mt-4 font-display text-title font-extrabold text-white">Privacy notice</h1>
        <p className="mt-1 text-small text-white/60">Version {PRIVACY_VERSION} · for the DILO demo and early-access list</p>

        <h2 className={h}>What this covers</h2>
        <p className="mt-2">DILO is not open yet. Right now you can try a demo and, if you like, join the early-access list. The demo uses made-up people; anything you type into it stays on your own phone.</p>

        <h2 className={h}>What we collect, and why</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li><b>Early access:</b> your email (required), and your name and city if you choose to give them. We use them only to tell you when DILO opens and to invite you to try it.</li>
          <li><b>Feedback:</b> what you write, your rating, and a name or phone/email only if you add them. We use it only to improve DILO.</li>
        </ul>
        <p className="mt-2">We don&apos;t sell or share your details, we don&apos;t use them for ads, and we don&apos;t collect anything about your family or money.</p>

        <h2 className={h}>Where it&apos;s kept and who can see it</h2>
        <p className="mt-2">It&apos;s stored with our database provider (Supabase, data centre in Singapore). Only DILO&apos;s founder can read it.</p>

        <h2 className={h}>How long</h2>
        <p className="mt-2">Early-access details are kept until DILO opens and you&apos;ve been invited, or until you ask us to delete them. Feedback is kept for as long as it helps us improve DILO.</p>

        <h2 className={h}>Your choices</h2>
        <p className="mt-2">You can ask to see, correct or delete your details, or withdraw your consent, at any time{CONTACT_EMAIL ? <> by writing to <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></> : <> through the <Link className="underline" href="/feedback/">feedback form</Link> (add your email so we can reply)</>}. This follows India&apos;s Digital Personal Data Protection Act, 2023.</p>

        <h2 className={h}>Age</h2>
        <p className="mt-2">Early access is for people aged 18 and over.</p>
      </article>
    </main>
  );
}
