"use client";

import { useEffect } from "react";

const SESSION_KEY = "bgexim-visit";
const ENDPOINT = "/api/site-visits/track";

/**
 * Counts one visit per browser session for the admin's "visits by country"
 * panel. Sends only the landing page and referring site; the server adds the
 * country from the host's geo header and stores no IP address.
 */
export function VisitBeacon() {
  useEffect(() => {
    try {
      if (navigator.webdriver || sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return; // Storage blocked: skip rather than count every page as a visit.
    }
    const body = JSON.stringify({ page: location.pathname, referrer: document.referrer });
    if (!navigator.sendBeacon?.(ENDPOINT, body)) {
      void fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, []);

  return null;
}
