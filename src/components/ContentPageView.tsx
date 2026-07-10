import Image from "next/image";
import Link from "next/link";
import type { ContentPage } from "@/content/types";
import { shapes } from "@/content/shared";
import { absoluteUrl, siteConfig } from "@/config/site";
import { formatContentDate, headingId, readingTime } from "@/lib/content";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import ContactForm from "./ContactForm";
import JsonLd from "./JsonLd";
import AdUnit from "./AdUnit";
import RichText from "./RichText";
import BlogArchive from "./BlogArchive";

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => cellIndex === 0
                ? <th key={cellIndex} scope="row"><RichText text={cell} /></th>
                : <td key={cellIndex}><RichText text={cell} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function breadcrumbItems(page: ContentPage): Crumb[] {
  const items: Crumb[] = [{ label: "Home", href: "/" }];
  if (page.path.startsWith("/face-shapes/") && page.path !== "/face-shapes/") items.push({ label: "Face Shapes", href: "/face-shapes/" });
  if (page.path.startsWith("/blog/") && page.path !== "/blog/") items.push({ label: "Blog", href: "/blog/" });
  items.push({ label: page.title });
  return items;
}

function ArticleMeta({ page }: { page: ContentPage }) {
  const showModified = page.modified !== page.published;
  return (
    <div className="article-meta">
      {page.kind === "article" && <span>By <Link href={siteConfig.authorPath}>{siteConfig.authorName}</Link></span>}
      <time dateTime={page.published}>Published {formatContentDate(page.published)}</time>
      {showModified && <time dateTime={page.modified}>Updated {formatContentDate(page.modified)}</time>}
      <span>{readingTime(page)} min read</span>
    </div>
  );
}

export default function ContentPageView({ page }: { page: ContentPage }) {
  const crumbs = breadcrumbItems(page);
  const isAuthorPage = page.path === siteConfig.authorPath;
  const schemaType = isAuthorPage ? "ProfilePage" : page.path === "/about/" ? "AboutPage" : page.path === "/contact/" ? "ContactPage" : page.kind === "article" ? "BlogPosting" : page.kind === "trust" || page.kind === "blog-index" ? "WebPage" : "Article";
  const pageSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: page.title,
    description: page.description,
    datePublished: page.published,
    mainEntityOfPage: absoluteUrl(page.path),
    publisher: { "@type": "Organization", name: siteConfig.publisherName, url: siteConfig.siteUrl, email: siteConfig.contactEmail, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: siteConfig.contactEmail, url: absoluteUrl("/contact/") }, logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logoPath) } },
    image: absoluteUrl(page.image ?? siteConfig.defaultSocialImage),
  };
  if (isAuthorPage) pageSchema.mainEntity = { "@type": "Person", name: siteConfig.authorName, url: absoluteUrl(siteConfig.authorPath), jobTitle: "Publisher and editor", worksFor: { "@type": "Organization", name: siteConfig.publisherName, url: siteConfig.siteUrl } };
  if (page.modified !== page.published) pageSchema.dateModified = page.modified;
  if (page.kind === "article") pageSchema.author = { "@type": "Person", name: siteConfig.authorName, url: absoluteUrl(siteConfig.authorPath) };

  const jsonLd: Record<string, unknown>[] = [
    pageSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.label, item: crumb.href ? absoluteUrl(crumb.href) : absoluteUrl(page.path) })),
    },
  ];
  if (page.faqs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    });
  }
  const showToc = page.kind === "article" && page.sections.length >= 7;

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content">
        <div className="container article-container">
          <Breadcrumbs items={crumbs} />
          <header className={`article-hero${page.kind === "article" ? " article-hero-blog" : ""}`}>
            <div className="article-hero-copy">
              <p className="eyebrow">{page.topic ?? page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="lead">{page.intro}</p>
              {(page.kind === "article" || page.kind === "guide" || page.kind === "shape") && <ArticleMeta page={page} />}
            </div>
            {page.image && (
              <figure className={`article-visual${page.kind === "article" ? " article-featured-image" : ""}`}>
                <Image src={page.image} alt={page.imageAlt ?? ""} width={page.kind === "article" ? 1200 : 560} height={page.kind === "article" ? 675 : 400} sizes={page.kind === "article" ? "(max-width: 1240px) 100vw, 1180px" : "(max-width: 800px) 100vw, 40vw"} priority />
                {page.imageCaption && <figcaption>{page.imageCaption}</figcaption>}
              </figure>
            )}
          </header>

          {page.kind === "blog-index" && <BlogArchive />}

          {page.path === "/face-shapes/" && (
            <section className="shape-link-grid" aria-label="Individual face-shape guides">
              {shapes.map((shape) => <Link className="mini-shape-card" href={`/face-shapes/${shape.slug}/`} key={shape.slug}><Image src={shape.image} alt={`${shape.name} face outline illustration`} width={96} height={112} /><span><strong>{shape.name}</strong><small>{shape.traits[0]}</small></span></Link>)}
            </section>
          )}

          {page.kind !== "blog-index" && (
            <>
              <div className="article-layout">
                <article className="prose">
                  {showToc && (
                    <nav className="table-of-contents" aria-labelledby="toc-heading">
                      <h2 id="toc-heading">In this article</h2>
                      <ol>{page.sections.map((section) => <li key={section.heading}><a href={`#${headingId(section.heading)}`}>{section.heading}</a></li>)}</ol>
                    </nav>
                  )}
                  {page.sections.map((section, index) => (
                    <section id={headingId(section.heading)} key={section.heading}>
                      <h2>{section.heading}</h2>
                      {section.paragraphs?.map((paragraph) => <p key={paragraph}><RichText text={paragraph} /></p>)}
                      {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}><RichText text={bullet} /></li>)}</ul>}
                      {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
                      {section.subsections?.map((subsection) => (
                        <div className="prose-subsection" key={subsection.heading}>
                          <h3>{subsection.heading}</h3>
                          {subsection.paragraphs?.map((paragraph) => <p key={paragraph}><RichText text={paragraph} /></p>)}
                          {subsection.bullets && <ul>{subsection.bullets.map((bullet) => <li key={bullet}><RichText text={bullet} /></li>)}</ul>}
                        </div>
                      ))}
                      {index === 2 && <AdUnit />}
                    </section>
                  ))}
                  {page.path === "/about/" && <section><h2>Technical references</h2><p>The implementation follows the <a href="https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js" rel="noreferrer">official MediaPipe Face Landmarker guide for web</a> for browser landmark detection. Temporary image previews and local decoding use standard browser file and image APIs described in the <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" rel="noreferrer">MDN File API reference</a>. These sources describe the underlying APIs; the face-shape categories and scoring logic are owned by this project.</p></section>}
                  {page.path === "/contact/" && <ContactForm />}
                  {page.faqs && (
                    <section className="faq-section"><h2>Frequently asked questions</h2>{page.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
                  )}
                </article>
                <aside className="article-aside">
                  <div className="aside-card"><p className="eyebrow">Keep exploring</p><h2>Related guides</h2>{page.related.slice(0, 4).map((item) => <Link href={item.href} key={item.href + item.label}><strong>{item.label}</strong><span>{item.description}</span></Link>)}</div>
                  <div className="aside-card soft"><h2>Private estimate</h2><p>Use a clear front-facing photo. It stays in your browser and is not stored.</p><Link className="button" href="/#detector">Analyze my photo</Link></div>
                  {page.kind === "shape" && <div className="aside-card"><h2>Core references</h2><Link href="/face-shapes/"><strong>All seven face shapes</strong><span>Compare the full set side by side.</span></Link><Link href="/how-to-find-your-face-shape/"><strong>Manual measurement guide</strong><span>Check visible length, width, jaw, and chin.</span></Link><Link href="/hairstyles-by-face-shape/"><strong>Hairstyle principles</strong><span>Adapt volume, length, part, and texture.</span></Link><Link href="/glasses-by-face-shape/"><strong>Glasses and frame fit</strong><span>Combine shape guidance with proper fitting.</span></Link></div>}
                </aside>
              </div>
              {page.kind === "article" && (
                <section className="related-reading" aria-labelledby="related-reading-heading">
                  <div className="section-heading split"><div><p className="eyebrow">Continue learning</p><h2 id="related-reading-heading">Related articles and guides</h2></div><Link className="text-link" href="/blog/">View all articles <span aria-hidden="true">→</span></Link></div>
                  <div className="related-reading-grid">{page.related.map((item) => <article key={item.href + item.label}><h3><Link href={item.href}>{item.label}</Link></h3><p>{item.description}</p><Link href={item.href}>Explore <span aria-hidden="true">→</span></Link></article>)}</div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
