"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { playChime } from "@/lib/sound";

/**
 * The "O" of DILO as a raised, pressable key (founder's request).
 * Press: it sinks, a soft chime plays, the phone gives a tiny buzz, then the app opens.
 */
export function OButton({ href, style }: { href: string; style: React.CSSProperties }) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const leaving = useRef(false);

  function go(e: React.MouseEvent) {
    e.preventDefault();
    if (leaving.current) return;
    leaving.current = true;
    setPressed(true);
    playChime();
    try { navigator.vibrate?.(12); } catch { /* not supported */ }
    window.setTimeout(() => router.push(href), 260);
  }

  return (
    <Link
      href={href}
      onClick={go}
      onPointerDown={() => setPressed(true)}
      onPointerLeave={() => !leaving.current && setPressed(false)}
      onPointerCancel={() => !leaving.current && setPressed(false)}
      aria-label="Enter DILO"
      data-pressed={pressed || undefined}
      className="o-key absolute block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/dilo-o.png" alt="" width={184} height={178} className="o-key__face logo-pop block h-full w-full" draggable={false} />
      {/* Glossy top light, clipped to the O's own shape */}
      <span aria-hidden className="o-key__shine logo-pop" />
    </Link>
  );
}
