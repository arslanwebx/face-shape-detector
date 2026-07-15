import type { MetadataRoute } from "next";
import { pages } from "@/content/pages";
import { absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: new Date("2026-07-10"), changeFrequency: "monthly", priority: 1 },
    ...pages.map((page) => ({ url: absoluteUrl(page.path), lastModified: new Date(page.modified), changeFrequency: "monthly" as const, priority: page.kind === "shape" || page.kind === "guide" ? 0.8 : 0.65 })),
  ];
}
