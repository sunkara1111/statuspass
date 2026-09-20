"use client";

import { useEffect } from "react";

const SELECTORS = [
  "[data-vercel-toolbar]",
  "[data-vercel-overlay]",
  "vercel-live-feedback",
  "#vercel-live-feedback",
  'iframe[src*="vercel.live"]',
  'a[href*="vercel.com"][href*="utm_"]',
];

export function StripVendorBadges() {
  useEffect(() => {
    const hide = () => {
      for (const selector of SELECTORS) {
        document.querySelectorAll(selector).forEach((node) => {
          node.parentElement?.removeChild(node);
        });
      }
      document.querySelectorAll("a").forEach((anchor) => {
        const text = (anchor.textContent || "").trim();
        if (/powered by/i.test(text) || /sponsored by vercel/i.test(text)) {
          anchor.remove();
        }
      });
    };
    hide();
    const observer = new MutationObserver(hide);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
