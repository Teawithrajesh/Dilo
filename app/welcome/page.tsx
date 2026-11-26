import Link from "next/link";
import { Glows } from "@/components/landing/Glows";
import { GhostButton, PrimaryButton } from "@/components/landing/Buttons";
import { Icon, type IconName } from "@/components/Icon";

export const metadata = { title: "DILO · Together, We Make Dreams Come True" };

const nav = [
  { href: "#how", label: "How it works" },
  { href: "#examples", label: "Examples" },
  { href: "#trust", label: "Trust" },
  { href: "#faq", label: "FAQ" },
];

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "dream", title: "Dream", text: "Create an event for a wedding, a birthday, a laptop for college or a family trip." },
  { icon: "share", title: "Share", text: "Invite family and friends with a private link. You approve who joins." },
  { icon: "support", title: "Support", text: "Add a wishlist. People record what they gave, openly or anonymously." },
  { icon: "celebrate", title: "Celebrate", text: "Watch the goal fill up together, and celebrate when the dream comes true." },
];

// Sample events (invented, shown as examples only).
const examples = [
  { tag: "Wedding", title: "Anjali's Wedding", date: "14 Feb 2027", goal: 150000, raised: 108000, people: 23, accent: "from-pink to-orange" },
  { tag: "Education", title: "Rohan's College Laptop", date: "1 Jul 2027", goal: 65000, raised: 41600, people: 11, accent: "from-violet to-pink" },
  { tag: "Family trip", title: "Sharma Family Goa Trip", date: "20 Dec 2027", goal: 90000, raised: 27000, people: 8, accent: "from-orange to-gold" },
];

const compare = [
  { old: "Messages get lost in a busy group chat", dilo: "One page per event with the wishlist and progress" },
  { old: "Someone keeps a spreadsheet by hand", dilo: "Every contribution is listed automatically" },
  { old: "No one knows what is still needed", dilo: "Each wish shows what's covered and what's left" },
  { old: "Hard to stay anonymous", dilo: "Give anonymously; only the organiser sees your name" },
];

const trust: { icon: IconName; title: string; text: string }[] = [
  { icon: "lock", title: "Private by default", text: "Every community is private. Outsiders see nothing." },
  { icon: "shield", title: "You approve every member", text: "People request to join; an admin says yes or no." },
  { icon: "receipt", title: "DILO never touches money", text: "You give the way you always do. DILO only keeps the record." },
  { icon: "eye", title: "Honest labels", text: "Every entry shows “Self-reported” until the organiser confirms it." },
];

const audiences: { icon: IconName; title: string; text: string }[] = [
  { icon: "home", title: "Families", text: "Weddings, birthdays, a new home, a parent's dream." },
  { icon: "users", title: "Friends", text: "Farewells, group gifts, a trip you've talked about for years." },
  { icon: "globe", title: "Communities", text: "Housing societies, alumni groups, clubs and teams." },
];

const faqs = [
  { q: "Is DILO free?", a: "Yes. This preview is free, and there are no ads." },
  { q: "Does DILO collect or hold money?", a: "No. You give money the way you already do (cash, UPI, bank). You then record it in DILO so everyone can see the progress." },
  { q: "Who can see my community?", a: "Only approved members. Communities are private by default, and new people must be approved by an admin or moderator." },
  { q: "Can I give anonymously?", a: "Yes. Other members see “Anonymous”. Only the event organiser sees your name, so they can say thank you." },
  { q: "Do I need to install an app?", a: "No. DILO works in your phone's browser, and you can add it to your home screen like an app." },
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-tiny font-semibold uppercase tracking-[0.2em] text-orange">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-title font-extrabold leading-tight sm:text-display">{title}</h2>
      {text && <p className="mt-3 text-balance text-white/70">{text}</p>}
    </div>
  );
}

function Progress({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function HeroCard() {
  const e = examples[0];
  const pct = Math.round((e.raised / e.goal) * 100);
  return (
    <div className="relative mx-auto w-full max-w-xs rotate-[-2deg] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 text-left shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-3 py-1 text-tiny font-semibold">{e.tag}</span>
        <span className="text-tiny text-white/60">Sample</span>
      </div>
      <p className="mt-4 font-display text-heading font-bold">{e.title}</p>
      <p className="text-small text-white/60">{e.date} · {e.people} people</p>
      <div className="mt-5 flex items-end justify-between">
        <p className="font-display text-title font-extrabold">{pct}%</p>
        <p className="text-small text-white/70">{inr(e.raised)} of {inr(e.goal)}</p>
      </div>
      <div className="mt-2"><Progress value={pct} accent={e.accent} /></div>
      <ul className="mt-5 space-y-2 text-small">
        <li className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2">
          <span>Wedding photography</span><span className="text-gold">{inr(60000)}</span>
        </li>
        <li className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2">
          <span>Mehendi decor</span><span className="flex items-center gap-1 text-white/70"><Icon name="check" className="h-4 w-4" />Covered</span>
        </li>
      </ul>
    </div>
  );
}

export default function Welcome() {
  return (
    <div className="bg-navy text-white">
      {/* 1. Header */}
      <header className="sticky top-8 z-40 border-b border-white/10 bg-navy/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/welcome/" className="flex min-h-11 items-center" aria-label="DILO home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="h-11 w-auto" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-8 text-small text-white/70 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="inline-flex min-h-11 items-center transition hover:text-white">{n.label}</a>
            ))}
          </nav>
          <Link
            href="/join/"
            className="inline-flex min-h-11 items-center rounded-full bg-white px-5 font-display text-small font-bold text-navy transition hover:bg-white/90"
          >
            Join
          </Link>
        </div>
      </header>

      <main>
        {/* 2. Hero */}
        <section className="relative overflow-hidden">
          <Glows />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 md:grid-cols-2 md:pt-24">
            <div className="text-center md:text-left">
              <p className="text-tiny font-semibold uppercase tracking-[0.2em] text-white/60">Private · Family-first · Free</p>
              <h1 className="mt-4 text-balance text-[2.25rem] font-extrabold leading-[1.1] sm:text-5xl">
                Your dreams deserve more than{" "}
                <span className="bg-gradient-to-r from-pink to-orange bg-clip-text text-transparent">ordinary gifts.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-balance text-white/70 md:mx-0">
                Bring your loved ones together in a private space. Turn celebrations into meaningful memories, and small contributions into big dreams.
              </p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start">
                <PrimaryButton href="/join/">Create Your Community</PrimaryButton>
                <GhostButton href="#how">Discover How DILO Works</GhostButton>
              </div>
            </div>
            <HeroCard />
          </div>
        </section>

        {/* 3. How it works */}
        <section id="how" className="scroll-mt-28 border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="How it works" title="Four simple steps" text="From a dream to a celebration, with the people who matter." />
          <ol className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink to-orange text-white">
                    <Icon name={s.icon} />
                  </span>
                  <span className="font-display text-title font-extrabold text-white/15">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-heading font-bold">{s.title}</h3>
                <p className="mt-2 text-small text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Examples */}
        <section id="examples" className="scroll-mt-28 border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="Examples" title="Dreams people celebrate on DILO" text="Sample events, to show how it looks." />
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
            {examples.map((e) => {
              const pct = Math.round((e.raised / e.goal) * 100);
              return (
                <article key={e.title} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                  <div className={`h-24 bg-gradient-to-br ${e.accent} opacity-80`} />
                  <div className="p-6">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-tiny font-semibold">{e.tag}</span>
                    <h3 className="mt-4 text-heading font-bold">{e.title}</h3>
                    <p className="text-small text-white/60">{e.date} · {e.people} people</p>
                    <div className="mt-5"><Progress value={pct} accent={e.accent} /></div>
                    <p className="mt-2 text-small text-white/70">
                      <span className="font-bold text-white">{pct}%</span> · {inr(e.raised)} of {inr(e.goal)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 5. Why DILO */}
        <section className="border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="Why DILO" title="Better than a group chat and a spreadsheet" />
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-2 bg-white/[0.06] text-tiny font-semibold uppercase tracking-wider text-white/60">
              <p className="p-4">Today</p>
              <p className="border-l border-white/10 p-4 text-orange">With DILO</p>
            </div>
            {compare.map((c) => (
              <div key={c.old} className="grid grid-cols-2 border-t border-white/10 text-small">
                <p className="flex gap-2 p-4 text-white/60"><Icon name="x" className="mt-0.5 h-4 w-4 shrink-0" />{c.old}</p>
                <p className="flex gap-2 border-l border-white/10 p-4"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{c.dilo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Trust & privacy */}
        <section id="trust" className="scroll-mt-28 border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="Trust & privacy" title="Built for families, so built to be safe" />
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <Icon name={t.icon} className="h-7 w-7 text-orange" />
                <h3 className="mt-4 font-display text-body font-bold">{t.title}</h3>
                <p className="mt-2 text-small text-white/70">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Who it's for */}
        <section className="border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="Who it's for" title="For everyone you celebrate with" />
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10"><Icon name={a.icon} /></span>
                <div>
                  <h3 className="font-display text-body font-bold">{a.title}</h3>
                  <p className="mt-1 text-small text-white/70">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="scroll-mt-28 border-t border-white/10 px-4 py-20">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/[0.04]">
            {faqs.map((f) => (
              <details key={f.q} className="group px-6">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-semibold">
                  {f.q}
                  <Icon name="chevron" className="h-5 w-5 shrink-0 text-white/60 transition group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-small text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 9. Final call */}
        <section className="relative overflow-hidden border-t border-white/10 px-4 py-24 text-center">
          <Glows variant="soft" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-balance text-title font-extrabold sm:text-display">Start your first dream today</h2>
            <p className="mt-3 text-white/70">It takes less than five minutes to create a private community.</p>
            <div className="mt-8"><PrimaryButton href="/join/">Create Your Community</PrimaryButton></div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-white/10 px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/dilo-logo.png" alt="DILO" width={666} height={705} className="h-12 w-auto" />
            <p className="text-small text-white/60">Together, We Make Dreams Come True.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-small text-white/60">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="inline-flex min-h-11 items-center hover:text-white">{n.label}</a>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-tiny text-white/60">© 2026 DILO · Prototype on demo data</p>
      </footer>
    </div>
  );
}
