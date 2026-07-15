import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: siteConfig.brandName, template: `%s | ${siteConfig.shortBrandName}` },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: { type: "website", siteName: siteConfig.brandName, images: [{ url: siteConfig.defaultSocialImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
  verification: siteConfig.searchConsoleVerification ? { google: siteConfig.searchConsoleVerification } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fbf9ff" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        {children}
        <Footer />
        {siteConfig.analyticsEnabled && <GoogleAnalytics measurementId={siteConfig.analyticsId} />}
      </body>
    </html>
  );
}
