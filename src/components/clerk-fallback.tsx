"use client";

import { useEffect } from "react";

export default function ClerkFallback() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasClerk = (window as any).Clerk || (window as any).__clerkjs_loaded;
    if (hasClerk) return;

    const injectScript = (src: string, marker: string) => {
      if (document.querySelector(`script[data-clerk-fallback="${marker}"]`)) return;
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-clerk-fallback", marker);
      script.src = src;
      script.onload = () => {
        (window as any).__clerkjs_loaded = true;
      };
      document.head.appendChild(script);
    };

    const timer = window.setTimeout(() => {
      injectScript("https://cdn.jsdelivr.net/npm/@clerk/ui@1/dist/ui.browser.js", "ui");
      injectScript("https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js", "clerk-js");
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
