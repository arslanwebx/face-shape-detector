"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const links = [
  ["Detector", "/#detector"],
  ["Face Shapes", "/face-shapes/"],
  ["Hairstyles", "/hairstyles-by-face-shape/"],
  ["Glasses", "/glasses-by-face-shape/"],
  ["Blog", "/blog/"],
  ["About", "/about/"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label={`${siteConfig.brandName} home`}>
          <Image src={siteConfig.logoPath} alt="" width={42} height={42} priority />
          <span>{siteConfig.brandName}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link className="nav-cta" href="/#detector">Analyze My Face</Link>
        </nav>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-nav container" aria-label="Mobile navigation">
          <button className="menu-close" type="button" onClick={() => setOpen(false)}>Close menu <span aria-hidden="true">×</span></button>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="button" href="/#detector" onClick={() => setOpen(false)}>Analyze My Face</Link>
        </nav>
      )}
    </header>
  );
}
