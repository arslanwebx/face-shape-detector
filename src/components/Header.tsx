"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

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
  const pathname = usePathname();

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/#detector") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link className={isActive(href) ? "is-active" : undefined} aria-current={isActive(href) ? "page" : undefined} key={href} href={href}>{label}</Link>
          ))}
          <Link className="nav-cta" href="/#detector">Analyze My Face</Link>
        </nav>
        <button className="menu-button" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
      {open && (
        <div className="mobile-menu-panel">
          <nav id="mobile-menu" className="mobile-nav container" aria-label="Mobile navigation">
            <div className="mobile-menu-heading"><span>Menu</span><button className="menu-close" type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button></div>
            {links.map(([label, href]) => (
              <Link className={isActive(href) ? "is-active" : undefined} aria-current={isActive(href) ? "page" : undefined} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <Link className="button" href="/#detector" onClick={() => setOpen(false)}>Analyze My Face</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
