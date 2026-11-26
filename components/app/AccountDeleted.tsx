"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/lib/demo/store";

/** On the welcome page after "Delete my account": sign out here (not before leaving the app) and say so. */
export function AccountDeleted() {
  const { signOut } = useDemo();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("deleted") === "1") {
      signOut();
      setShow(true);
    }
  }, [signOut]);
  if (!show) return null;
  return (
    <p role="status" data-testid="account-deleted" className="mx-auto mt-4 max-w-md rounded-2xl bg-white/[0.08] px-4 py-3 text-center text-small text-white">
      Your demo account was deleted and you left your communities. In the real app, deletion completes within 30 days.
    </p>
  );
}
