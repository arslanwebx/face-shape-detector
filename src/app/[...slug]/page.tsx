import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/ContentPageView";
import { pages, pageByPath } from "@/content/pages";
import { absoluteUrl, siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

function pathFromSlug(slug: string[]) { return `/${slug.join("/")}/`; }

export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pageByPath.get(pathFromSlug(slug));
  if (!page) return {};
  const image = page.image ?? siteConfig.defaultSocialImage;
  const isArticle = page.kind === "article";
  const fullTitle = page.seoTitle.includes(siteConfig.shortBrandName)
    ? page.seoTitle
    : `${page.seoTitle} | ${siteConfig.shortBrandName}`;
  return {
    title: { absolute: fullTitle },
    description: page.description,
    authors: isArticle ? [{ name: siteConfig.authorName, url: absoluteUrl(siteConfig.authorPath) }] : undefined,
    alternates: { canonical: absoluteUrl(page.path) },
    openGraph: isArticle
      ? { title: fullTitle, description: page.description, url: absoluteUrl(page.path), type: "article", publishedTime: page.published, modifiedTime: page.modified !== page.published ? page.modified : undefined, images: [{ url: image, width: 1200, height: 675, alt: page.imageAlt ?? page.title }] }
      : { title: fullTitle, description: page.description, url: absoluteUrl(page.path), type: "website", images: [{ url: image, width: 1200, height: image.endsWith(".jpg") ? 675 : 630, alt: page.imageAlt ?? page.title }] },
    twitter: { card: "summary_large_image", title: fullTitle, description: page.description, images: [image] },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const page = pageByPath.get(pathFromSlug(slug));
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
