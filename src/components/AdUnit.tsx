import { siteConfig } from "@/config/site";

export default function AdUnit() {
  if (!siteConfig.advertisingEnabled || !siteConfig.adsensePublisherId) return null;
  return <aside className="ad-unit" aria-label="Advertisement"><span>Advertisement</span></aside>;
}
