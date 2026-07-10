import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/ContentPageView";
import { pages, pageByPath } from "@/content/pages";
import { absoluteUrl, siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string[] }> };

function pathFromSlug(slug: string[]) { return `/${slug.join("/")}/`; }

export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pageByPath.get(pathFromSlug(slug));
  if (!page) return {};
  const image = page.image?.startsWith("/og/") ? page.image : siteConfig.defaultSocialImage;
  return {
    title: page.seoTitle,
    description: page.description,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: { title: page.seoTitle, description: page.description, url: absoluteUrl(page.path), type: page.kind === "article" ? "article" : "website", images: [{ url: image, width: 1200, height: 630, alt: page.imageAlt ?? page.title }] },
    twitter: { card: "summary_large_image", title: page.seoTitle, description: page.description, images: [image] },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const page = pageByPath.get(pathFromSlug(slug));
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
