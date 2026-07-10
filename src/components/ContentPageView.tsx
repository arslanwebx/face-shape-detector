import Image from "next/image";
import Link from "next/link";
import type { ContentPage } from "@/content/types";
import { shapes } from "@/content/shared";
import { absoluteUrl, siteConfig } from "@/config/site";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import ContactForm from "./ContactForm";
import JsonLd from "./JsonLd";
import AdUnit from "./AdUnit";

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
  );
}

function breadcrumbItems(page: ContentPage): Crumb[] {
  const items: Crumb[] = [{ label: "Home", href: "/" }];
  if (page.path.startsWith("/face-shapes/") && page.path !== "/face-shapes/") items.push({ label: "Face Shapes", href: "/face-shapes/" });
  if (page.path.startsWith("/blog/") && page.path !== "/blog/") items.push({ label: "Blog", href: "/blog/" });
  items.push({ label: page.title });
  return items;
}

export default function ContentPageView({ page }: { page: ContentPage }) {
  const crumbs = breadcrumbItems(page);
  const schemaType = page.path === "/about/" ? "AboutPage" : page.path === "/contact/" ? "ContactPage" : page.kind === "article" ? "BlogPosting" : page.kind === "trust" || page.kind === "blog-index" ? "WebPage" : "Article";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      headline: page.title,
      description: page.description,
      datePublished: page.published,
      dateModified: page.modified,
      mainEntityOfPage: absoluteUrl(page.path),
      publisher: { "@type": "Organization", name: siteConfig.publisherName, url: siteConfig.siteUrl },
      image: absoluteUrl(page.image ?? siteConfig.defaultSocialImage),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: crumb.href ? absoluteUrl(crumb.href) : absoluteUrl(page.path),
      })),
    },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content">
        <div className="container article-container">
          <Breadcrumbs items={crumbs} />
          <header className="article-hero">
            <div>
              <p className="eyebrow">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="lead">{page.intro}</p>
              {(page.kind === "article" || page.kind === "guide" || page.kind === "shape") && <p className="date-line">Published <time dateTime={page.published}>July 10, 2026</time> · Reviewed for clarity and limitations</p>}
            </div>
            {page.image && <div className="article-visual"><Image src={page.image} alt={page.imageAlt ?? ""} width={560} height={400} priority /></div>}
          </header>

          {page.path === "/face-shapes/" && (
            <section className="shape-link-grid" aria-label="Individual face-shape guides">
              {shapes.map((shape) => <Link className="mini-shape-card" href={`/face-shapes/${shape.slug}/`} key={shape.slug}><Image src={shape.image} alt={`${shape.name} face outline illustration`} width={96} height={112} /><span><strong>{shape.name}</strong><small>{shape.traits[0]}</small></span></Link>)}
            </section>
          )}

          <div className="article-layout">
            <article className="prose">
              {page.sections.map((section, index) => (
                <section id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                  {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
                  {index === 2 && <AdUnit />}
                </section>
              ))}
              {page.path === "/about/" && <p className="publisher-note"><strong>Current publisher configuration:</strong> {siteConfig.publisherName}. The owner should replace this central value with accurate launch information.</p>}
              {page.path === "/about/" && <section><h2>Technical references</h2><p>The implementation follows the <a href="https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js" rel="noreferrer">official MediaPipe Face Landmarker guide for web</a> for browser landmark detection. Temporary image previews and local decoding use standard browser file and image APIs described in the <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" rel="noreferrer">MDN File API reference</a>. These sources describe the underlying APIs; the face-shape categories and scoring logic are owned by this project.</p></section>}
              {page.path === "/contact/" && <ContactForm />}
              {page.faqs && (
                <section className="faq-section"><h2>Frequently asked questions</h2>{page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
              )}
            </article>
            <aside className="article-aside">
              <div className="aside-card"><p className="eyebrow">Keep exploring</p><h2>Related guides</h2>{page.related.map((item) => <Link href={item.href} key={item.href + item.label}><strong>{item.label}</strong><span>{item.description}</span></Link>)}</div>
              <div className="aside-card soft"><h2>Private estimate</h2><p>Use a clear front-facing photo. It stays in your browser and is not stored.</p><Link className="button" href="/#detector">Analyze my photo</Link></div>
              {page.kind === "shape" && <div className="aside-card"><h2>Core references</h2><Link href="/face-shapes/"><strong>All seven face shapes</strong><span>Compare the full set side by side.</span></Link><Link href="/how-to-find-your-face-shape/"><strong>Manual measurement guide</strong><span>Check visible length, width, jaw, and chin.</span></Link><Link href="/hairstyles-by-face-shape/"><strong>Hairstyle principles</strong><span>Adapt volume, length, part, and texture.</span></Link><Link href="/glasses-by-face-shape/"><strong>Glasses and frame fit</strong><span>Combine shape guidance with proper fitting.</span></Link></div>}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
