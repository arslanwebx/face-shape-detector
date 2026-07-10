"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

type ConsentChoice = "granted" | "denied";
const storageKey = "visagemetric-analytics-consent";

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initialPageView = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "granted" || saved === "denied") setChoice(saved);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (choice !== "granted" || !window.gtag) return;
    if (initialPageView.current) {
      initialPageView.current = false;
      return;
    }
    window.gtag("config", measurementId, { page_path: pathname, page_title: document.title });
  }, [choice, measurementId, pathname]);

  const saveChoice = (nextChoice: ConsentChoice) => {
    window.localStorage.setItem(storageKey, nextChoice);
    window[`ga-disable-${measurementId}`] = nextChoice === "denied";
    window.gtag?.("consent", "update", { analytics_storage: nextChoice });
    setChoice(nextChoice);
    setSettingsOpen(false);
  };

  if (!measurementId || !ready) return null;
  const showPrompt = choice === null || settingsOpen;

  return (
    <>
      {choice === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', { analytics_storage: 'granted' });
              gtag('config', '${measurementId}', {
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
        </>
      )}

      {showPrompt ? (
        <aside className="consent-banner" aria-label="Analytics privacy choices" aria-live="polite">
          <div>
            <strong>Optional analytics</strong>
            <p>Allow privacy-conscious GA4 measurement of page visits and general device information. Face photos and analysis data are never sent. <Link href="/privacy-policy/#analytics">Privacy details</Link></p>
          </div>
          <div className="consent-actions">
            <button className="button secondary" type="button" onClick={() => saveChoice("denied")}>Reject analytics</button>
            <button className="button" type="button" onClick={() => saveChoice("granted")}>Allow analytics</button>
          </div>
        </aside>
      ) : (
        <button className="consent-settings" type="button" onClick={() => setSettingsOpen(true)}>Analytics settings</button>
      )}
    </>
  );
}
