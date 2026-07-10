import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="VisageMetric face measurement mark">
      <rect width="48" height="48" rx="14" fill="currentColor" />
      <path d="M18 11.5c-3.8 2.7-6 7.1-6 12.5s2.2 9.8 6 12.5M30 11.5c3.8 2.7 6 7.1 6 12.5s-2.2 9.8-6 12.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 12.5c5.1 0 8.3 4.2 7.6 10.4C30.8 30.8 27.8 36 24 36s-6.8-5.2-7.6-13.1C15.7 16.7 18.9 12.5 24 12.5Z" fill="none" stroke="white" strokeWidth="2" />
      <path d="M18.5 24h11M24 18.5v11" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".82" />
      <circle cx="24" cy="24" r="2.4" fill="white" />
    </svg>
  );
}

export default function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}${inverse ? " brand-inverse" : ""}`} href="/" aria-label={`${siteConfig.brandName} home`}>
      <LogoIcon className="brand-icon" />
      <span className="brand-wordmark" aria-hidden="true"><strong>VisageMetric</strong>{!compact && <span>Face shape analysis</span>}</span>
    </Link>
  );
}
