import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DetectorShell from "@/components/DetectorShell";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/config/site";
import { shapes } from "@/content/shared";

export const metadata: Metadata = {
  title: "Free Face Shape Detector",
  description: "Upload a front-facing photo for a private browser-based face-shape estimate, then understand the proportions, secondary matches, hairstyles, and glasses guidance.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: "Free Face Shape Detector",
    description: "Estimate your face shape privately in your browser and understand the visible proportions behind the result.",
    url: absoluteUrl("/"),
    images: [{ url: "/og/default.svg", width: 1200, height: 630, alt: "VisageMetric private browser face analysis" }],
  },
  twitter: { card: "summary_large_image", title: "Free Face Shape Detector", description: "A private, browser-based face-shape estimate with clear explanations.", images: ["/og/default.svg"] },
};

const faqs = [
  ["How can I find my face shape?", "Use a clear front-facing photo or compare visible face length, maximum width, cheekbone width, jaw width, jaw angle, and chin shape manually. The complete pattern matters more than one feature."],
  ["Is the tool free?", "Yes. The detector and every guide are available without an account or payment."],
  ["Is my photo uploaded or stored?", "No. Your selected photo and derived landmarks and measurements are processed in the current browser page and are not sent to our server or analytics."],
  ["Which photo produces the clearest result?", "Use one face, a straight head, a relaxed expression, eye-level camera placement, moderate distance, even front light, and a fully visible jaw and upper face."],
  ["Why did two photos give different answers?", "Distance, lens perspective, camera height, head tilt, expression, light, hair, and visible jaw detail can change the measured landmark relationships."],
  ["Can someone have characteristics of two face shapes?", "Yes. Categories overlap. A primary estimate with close secondary matches often describes natural variation more honestly than one rigid label."],
  ["Can men and women use the same detector?", "Yes. It compares visible proportion relationships and does not infer or require gender."],
  ["Can hairstyle affect the visible result?", "Yes. Hair can hide the cheeks, jaw, temples, or visible upper-face area. Pull it away from the outline for analysis."],
  ["Is the result guaranteed?", "No. It is an informal estimate from one photo, not a scientific, biometric, medical, or diagnostic conclusion."],
  ["Can I determine my shape manually?", "Yes. The at-home guide explains a photo, mirror, and measurement method without claiming false millimetre precision."],
] as const;

export default function Home() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.brandName, url: siteConfig.siteUrl, description: siteConfig.description },
    { "@context": "https://schema.org", "@type": "WebPage", name: "Free Face Shape Detector", url: siteConfig.siteUrl, description: metadata.description },
    { "@context": "https://schema.org", "@type": "Organization", name: siteConfig.publisherName, url: siteConfig.siteUrl, email: siteConfig.contactEmail, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: siteConfig.contactEmail, url: absoluteUrl("/contact/") }, logo: absoluteUrl(siteConfig.logoPath) },
    { "@context": "https://schema.org", "@type": "WebApplication", name: siteConfig.brandName, url: siteConfig.siteUrl, applicationCategory: "LifestyleApplication", operatingSystem: "Any modern web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "A browser-based tool that estimates a face-shape pattern from visible facial landmark proportions." },
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy"><p className="eyebrow">No account · No photo upload · Free to use</p><h1>Free Face Shape Detector</h1><p>Upload a clear front-facing photo to estimate your face shape and understand the visible proportions behind the result. Your photo is processed in your browser and is not stored.</p><div className="hero-actions"><Link className="button" href="#detector">Analyze my photo</Link><Link className="text-link" href="/how-to-find-your-face-shape/">Find it manually <span aria-hidden="true">→</span></Link></div><p className="micro-trust"><span aria-hidden="true">✓</span> No registration, beauty score, identity check, or personal profiling.</p></div>
            <div className="hero-visual" aria-label="Original illustrations of seven common face shapes">{shapes.slice(0, 5).map((shape, index) => <div className={`hero-face face-${index}`} key={shape.slug}><Image src={shape.image} alt={`${shape.name} face outline`} width={118} height={138} priority={index === 0} /></div>)}</div>
          </div>
        </section>

        <div className="container"><DetectorShell /></div>

        <section className="section how-section"><div className="container"><div className="section-heading"><p className="eyebrow">Transparent method</p><h2>How the analysis works</h2><p>The tool separates landmark detection from face-shape classification, then explains the result in plain language.</p></div><div className="step-grid"><article><span>1</span><h3>Prepare the photo locally</h3><p>The browser validates file type and size, reduces very large images for efficient analysis, and checks brightness and severe blur.</p></article><article><span>2</span><h3>Locate visible landmarks</h3><p>MediaPipe Face Landmarker identifies points around the face. It does not label your shape or identify who you are.</p></article><article><span>3</span><h3>Compare proportions</h3><p>Project-owned logic compares visible length, maximum width, cheek, upper-face, jaw, chin, taper, and angle proxies.</p></article><article><span>4</span><h3>Explain close matches</h3><p>The seven similarity scores total 100%. The leading estimate and two secondary matches show where categories overlap.</p></article></div><div className="notice"><strong>Why it remains an estimate:</strong> Face-shape categories are informal patterns, not diagnoses. A selfie cannot reveal an exact hairline, and camera perspective or hidden contours can change visible proportions.</div></div></section>

        <section className="section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">Shape library</p><h2>Compare the seven common face shapes</h2></div><Link className="text-link" href="/face-shapes/">View the complete comparison <span aria-hidden="true">→</span></Link></div><div className="shape-grid">{shapes.map((shape) => <article className="shape-card" key={shape.slug}><Image src={shape.image} alt={`${shape.name} face shape outline illustration`} width={180} height={210} /><h3>{shape.name}</h3><ul>{shape.traits.map((trait) => <li key={trait}>{trait}</li>)}</ul><Link href={`/face-shapes/${shape.slug}/`}>Read the {shape.name.toLowerCase()} guide <span aria-hidden="true">→</span></Link></article>)}</div></div></section>

        <section className="section soft-section"><div className="container feature-grid"><article><p className="eyebrow">Manual method</p><h2>Prefer to identify your shape without a tool?</h2><p>Use one consistent photo, compare visible length and width, then examine cheekbones, jaw width, jaw corners, and chin. The guide includes a worked example and explains camera-lens distortion.</p><Link className="text-link" href="/how-to-find-your-face-shape/">Follow the at-home steps <span aria-hidden="true">→</span></Link></article><article><p className="eyebrow">Hair principles</p><h2>Style the effect you want</h2><p>Length, volume, fringe, parting, texture, density, and maintenance all matter. Learn what each choice changes without treating face shape as a beauty rule.</p><Link className="text-link" href="/hairstyles-by-face-shape/">Explore hairstyle guidance <span aria-hidden="true">→</span></Link></article><article><p className="eyebrow">Frame and fit</p><h2>Use shape after fit</h2><p>Compare curves, angles, frame width, and lens depth only after considering bridge comfort, temples, pupillary distance, prescription, and optician advice.</p><Link className="text-link" href="/glasses-by-face-shape/">Choose glasses thoughtfully <span aria-hidden="true">→</span></Link></article></div></section>

        <section className="section"><div className="container two-column"><div><p className="eyebrow">Results in context</p><h2>Why two photos may not agree</h2><p>A close phone lens can broaden central features, while camera height changes the apparent upper-to-lower taper. Head tilt, expression, uneven light, blur, hairstyle, facial hair, and a hidden jaw add more variation.</p><p>For a useful comparison, keep distance, pose, lighting, and expression consistent. If two neighbouring shapes remain close, use manual proportions to see which feature creates the overlap.</p><Link className="text-link" href="/blog/why-face-shape-results-change-between-photos/">Improve photo consistency <span aria-hidden="true">→</span></Link></div><div className="mixed-card"><h3>Mixed characteristics are normal</h3><p>You might have oval-like length, diamond-like cheek emphasis, and a chin between both. Use the primary estimate as a starting point and the secondary match to refine styling choices.</p><Link href="/blog/can-you-have-more-than-one-face-shape/">How mixed face shapes work</Link></div></div></section>

        <section className="section faq-home"><div className="container narrow"><div className="section-heading"><p className="eyebrow">Questions answered</p><h2>Frequently asked questions</h2></div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

        <section className="section"><div className="container"><div className="section-heading split"><div><p className="eyebrow">Learning centre</p><h2>Latest face-shape guides</h2></div><Link className="text-link" href="/blog/">Browse the blog <span aria-hidden="true">→</span></Link></div><div className="blog-grid"><article><span>Comparison</span><h3><Link href="/blog/round-vs-oval-face/">Round face vs oval face</Link></h3><p>Use length, cheek width, jaw taper, chin, and one simple photo test.</p></article><article><span>Comparison</span><h3><Link href="/blog/oval-vs-oblong-face/">Oval face vs oblong face</Link></h3><p>See how stronger length and straighter sides separate two similar outlines.</p></article><article><span>Photo guide</span><h3><Link href="/blog/why-face-shape-results-change-between-photos/">Why results change between photos</Link></h3><p>Control perspective, pose, expression, lighting, and jaw visibility.</p></article><article><span>Understanding results</span><h3><Link href="/blog/can-you-have-more-than-one-face-shape/">Can you have more than one face shape?</Link></h3><p>Use secondary matches as helpful context instead of a contradiction.</p></article></div></div></section>

        <section className="section trust-section"><div className="container trust-inner"><div><p className="eyebrow">Built for useful answers</p><h2>A respectful tool, not an appearance score</h2><p>We explain visible proportion patterns and their limits. The website does not infer identity, ethnicity, health, personality, emotion, gender, attractiveness, or beauty. Style suggestions remain optional and inclusive.</p><div className="trust-links"><Link href="/about/">About the project</Link><Link href="/privacy-policy/">Privacy details</Link><Link href="/editorial-policy/">Editorial standards</Link></div></div><Link className="button" href="#detector">Analyze another photo</Link></div></section>
      </main>
    </>
  );
}
