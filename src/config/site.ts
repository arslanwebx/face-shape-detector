export const siteConfig = {
  brandName: "Face Shape Detector",
  shortBrandName: "Face Shape Detector",
  finalDomain: "faceshapedetector.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://faceshapedetector.online",
  contactEmail: "contact@faceshapedetector.online",
  publisherName: "Face Shape Detector",
  editorialName: "Face Shape Detector Editorial Team",
  authorName: "Arslan Ejaz",
  authorPath: "/authors/arslan-ejaz/",
  logoPath: "/logo.svg",
  defaultSocialImage: "/og/default.svg",
  description:
    "A private, browser-based face shape estimator with practical guides to facial proportions, hairstyles, and glasses.",
  socialProfiles: [] as string[],
  searchConsoleVerification: "",
  analyticsId: "G-8TH7Q6YHF1",
  adsensePublisherId: "",
  analyticsEnabled: true,
  advertisingEnabled: false,
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl.replace(/\/$/, "")}/`).toString();
}
