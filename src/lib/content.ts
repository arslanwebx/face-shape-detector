import type { ContentPage } from "@/content/types";

export function headingId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatContentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function readingTime(page: ContentPage) {
  const parts = [page.title, page.intro];
  for (const section of page.sections) {
    parts.push(section.heading, ...(section.paragraphs ?? []), ...(section.bullets ?? []));
    if (section.table) parts.push(...section.table.headers, ...section.table.rows.flat());
    for (const subsection of section.subsections ?? []) {
      parts.push(subsection.heading, ...(subsection.paragraphs ?? []), ...(subsection.bullets ?? []));
    }
  }
  for (const faq of page.faqs ?? []) parts.push(faq.question, faq.answer);

  const words = parts.join(" ").replace(/\[[^\]]+\]\([^\)]+\)/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}
