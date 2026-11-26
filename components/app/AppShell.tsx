"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo/store";
import { Icon, type IconName } from "@/components/Icon";
import { Avatar } from "./Avatar";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/home/", label: "Home", icon: "home" },
  { href: "/communities/", label: "Communities", icon: "users" },
  { href: "/notifications/", label: "Notifications", icon: "bell" },
  { href: "/profile/", label: "Profile", icon: "user" },
];

/** Signed-in app frame: top bar, content, bottom tabs. Sends signed-out visitors to demo sign-in. */
export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { ready, me, unread } = useDemo();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (ready && !me) router.replace("/signin/");
  }, [ready, me, router]);

  if (!ready || !me) {
    return <div className="min-h-[calc(100dvh-2rem)] bg-navy" aria-busy="true" />;
  }

  return (
    <div className="min-h-[calc(100dvh-2rem)] bg-navy pb-28 text-white">
      <header className="sticky top-8 z-40 border-b border-white/10 bg-navy/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/dilo-logo.png" alt="" width={666} height={705} className="h-9 w-auto" />
            <h1 className="font-display text-heading font-bold">{title}</h1>
          </div>
          <Link href="/profile/" aria-label={`Signed in as ${me.name}. Open profile`} className="inline-flex min-h-11 min-w-11 items-center justify-center">
            <Avatar person={me} size="h-9 w-9 text-tiny" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6">{children}</main>

      <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="mx-auto grid max-w-2xl grid-cols-4">
          {tabs.map((t) => {
            const active = path === t.href || (t.href !== "/home/" && path.startsWith(t.href));
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-tiny font-semibold transition ${active ? "text-white" : "text-white/60 hover:text-white/80"}`}
                >
                  {active && <span aria-hidden className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-pink to-orange" />}
                  <span className="relative">
                    <Icon name={t.icon} />
                    {t.icon === "bell" && unread > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink-deep px-1 text-[10px] font-bold text-white">
                        {unread}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
