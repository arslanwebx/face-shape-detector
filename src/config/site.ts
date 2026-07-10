export const siteConfig = {
  brandName: "Face Shape Detector",
  shortBrandName: "FaceShape",
  finalDomain: "faceshapedetector.online",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://faceshapedetector.online",
  contactEmail: "contact@faceshapedetector.online",
  publisherName: "Face Shape Detector",
  editorialName: "Face Shape Detector Editorial Team",
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
