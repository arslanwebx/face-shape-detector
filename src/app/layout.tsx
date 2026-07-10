import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { absoluteUrl, siteConfig } from "@/config/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

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
      <body className={poppins.variable}>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
