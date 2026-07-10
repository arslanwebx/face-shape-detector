export const siteConfig = {
  brandName: "Face Shape Detector",
  shortBrandName: "FaceShape",
  finalDomain: "example.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  contactEmail: "hello@example.com",
  publisherName: "Website Owner",
  logoPath: "/logo.svg",
  defaultSocialImage: "/og/default.svg",
  description:
    "A private, browser-based face shape estimator with practical guides to facial proportions, hairstyles, and glasses.",
  socialProfiles: [] as string[],
  searchConsoleVerification: "",
  analyticsId: "",
  adsensePublisherId: "",
  analyticsEnabled: false,
  advertisingEnabled: false,
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl.replace(/\/$/, "")}/`).toString();
}
