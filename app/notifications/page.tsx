"use client";

import { AppShell } from "@/components/app/AppShell";
import { Icon } from "@/components/Icon";
import { useDemo } from "@/lib/demo/store";

export default function Notifications() {
  const { myNotices, unread, markAllRead } = useDemo();
  return (
    <AppShell title="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-small text-white/70">{unread === 0 ? "All caught up" : `${unread} unread`}</p>
        {unread > 0 && (
          <button type="button" onClick={markAllRead} className="inline-flex min-h-11 items-center px-2 text-small font-semibold text-orange">
            Mark all read
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {myNotices.map((n) => (
          <li key={n.id} data-testid="notice" data-unread={!n.read || undefined} className={`flex gap-3 rounded-2xl border p-4 ${n.read ? "border-white/5 bg-white/[0.02]" : "border-white/15 bg-white/[0.06]"}`}>
            <span className="relative mt-0.5 text-white/70">
              <Icon name="bell" className="h-5 w-5" />
              {!n.read && <><span aria-hidden className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-pink" /><span className="sr-only">Unread:</span></>}
            </span>
            <span className="flex-1">
              <span className={`block text-small ${n.read ? "text-white/70" : "font-semibold"}`}>{n.text}</span>
              <span className="text-tiny text-white/60">{n.when}</span>
            </span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
