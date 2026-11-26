"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Read({ name, render }: { name: string; render: (value: string) => React.ReactNode }) {
  const value = useSearchParams().get(name) ?? "";
  return <>{render(value)}</>;
}

/** Reads one ?query value on a static page (needed because new communities have new ids). */
export function QueryParam({ name, render }: { name: string; render: (value: string) => React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[calc(100dvh-2rem)] bg-navy" aria-busy="true" />}>
      <Read name={name} render={render} />
    </Suspense>
  );
}
