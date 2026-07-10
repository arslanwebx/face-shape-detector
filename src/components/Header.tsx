"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    document.body.classList.remove("menu-open");
  };

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && closeMobileMenu();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const details = mobileMenuRef.current;
    const syncBodyLock = () => document.body.classList.toggle("menu-open", Boolean(details?.open));
    details?.addEventListener("toggle", syncBodyLock);
    return () => {
      details?.removeEventListener("toggle", syncBodyLock);
      document.body.classList.remove("menu-open");
    };
  }, []);

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
        <details className="mobile-menu-details" ref={mobileMenuRef}>
          <summary className="menu-button" aria-label="Open or close navigation menu">
            <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
          </summary>
          <div className="mobile-menu-panel" role="presentation" onClick={(event) => event.target === event.currentTarget && closeMobileMenu()}>
            <nav id="mobile-menu" className="mobile-nav container" aria-label="Mobile navigation">
              <div className="mobile-menu-heading"><Logo compact /><button className="menu-close" type="button" aria-label="Close navigation menu" onClick={closeMobileMenu}>Close <span aria-hidden="true">×</span></button></div>
              {links.map(([label, href]) => (
                <Link className={isActive(href) ? "is-active" : undefined} aria-current={isActive(href) ? "page" : undefined} key={href} href={href} onClick={closeMobileMenu}>{label}</Link>
              ))}
              <Link className="button" href="/#detector" onClick={closeMobileMenu}>Analyze My Face</Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
