"use client";

import { useEffect } from "react";

export default function ClerkFallback() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasClerk = (window as any).Clerk || (window as any).__clerkjs_loaded;
    if (hasClerk) return;

    const timer = setTimeout(() => {
      // if Clerk still not present, inject a reliable CDN fallback
      if (!(window as any).Clerk) {
        const existing = document.querySelector("script[data-clerk-fallback]");
        if (existing) return;
        const script = document.createElement("script");
        script.setAttribute("data-clerk-fallback", "true");
        script.src = "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js";
        script.async = true;
        script.onload = () => {
          (window as any).__clerkjs_loaded = true;
        };
        script.onerror = () => {
          // no-op: fallback failed; leave as is so developer can address DNS/CDN
        };
        document.head.appendChild(script);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
