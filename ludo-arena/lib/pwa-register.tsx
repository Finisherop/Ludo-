"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      const promptNewVersionAvailable = () => {
        if (
          confirm(
            "A new version of Ludo Arena is available! Click OK to refresh."
          )
        ) {
          wb.addEventListener("controlling", () => {
            window.location.reload();
          });
          wb.messageSkipWaiting();
        }
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.register();
    } else if ("serviceWorker" in navigator) {
      // Fallback registration
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((error) => {
            console.log("SW registration failed: ", error);
          });
      });
    }
  }, []);

  return null;
}

declare global {
  interface Window {
    workbox?: {
      register: () => void;
      addEventListener: (event: string, callback: () => void) => void;
      messageSkipWaiting: () => void;
    };
  }
}
