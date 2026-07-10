import Link from "next/link";
import { siteConfig } from "@/config/site";
import Logo from "./Logo";

const contentLinks = [
  ["Face Shapes", "/face-shapes/"],
  ["How to Find Your Face Shape", "/how-to-find-your-face-shape/"],
  ["Hairstyles", "/hairstyles-by-face-shape/"],
  ["Glasses", "/glasses-by-face-shape/"],
  ["Blog", "/blog/"],
] as const;

const trustLinks = [
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms and Conditions", "/terms-and-conditions/"],
  ["Disclaimer", "/disclaimer/"],
  ["Cookie and Advertising Policy", "/cookie-advertising-policy/"],
  ["Editorial and Corrections Policy", "/editorial-policy/"],
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><Logo inverse /><p>{siteConfig.description}</p><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></div>
        <div><h3>Explore</h3>{contentLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><h3>Trust and policies</h3>{trustLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span><span>Private by design. No account required.</span></div>
    </footer>
  );
}
