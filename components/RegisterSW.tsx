"use client";

import { useEffect } from "react";

// Registers the service worker so Android Chrome can install DILO and show an offline notice.
export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* not critical for the prototype */
      });
    }
  }, []);
  return null;
}
