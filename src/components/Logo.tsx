import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Face outline with facial landmarks">
      <rect width="48" height="48" rx="14" fill="currentColor" opacity="0.12" />
      <path d="M24 7.5c8.1 0 13 6.2 12.2 15.1-.9 10.7-6.3 17.9-12.2 17.9S12.7 33.3 11.8 22.6C11 13.7 15.9 7.5 24 7.5Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M15.8 19.2c2.2-1.4 4.5-1.5 6.4-.2m3.6 0c1.9-1.3 4.2-1.2 6.4.2M20.2 31c2.4 1.6 5.2 1.6 7.6 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="19" cy="21.2" r="1.7" fill="currentColor" />
      <circle cx="29" cy="21.2" r="1.7" fill="currentColor" />
      <circle cx="24" cy="26.2" r="1.5" fill="currentColor" />
      <circle cx="14.3" cy="25" r="1.25" fill="currentColor" />
      <circle cx="33.7" cy="25" r="1.25" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}${inverse ? " brand-inverse" : ""}`} href="/" aria-label={`${siteConfig.brandName} home`}>
      <LogoIcon className="brand-icon" />
      <span className="brand-wordmark" aria-hidden="true"><strong>Face Shape</strong>{!compact && <span>Detector</span>}</span>
    </Link>
  );
}
