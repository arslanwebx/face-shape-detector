import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: siteConfig.brandName, short_name: siteConfig.shortBrandName, description: siteConfig.description, start_url: "/", display: "standalone", background_color: "#fbf9ff", theme_color: "#6d4aff", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}
