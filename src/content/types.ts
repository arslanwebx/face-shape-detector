export type Faq = { question: string; answer: string };

export type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
};

export type PageKind =
  | "hub"
  | "shape"
  | "guide"
  | "blog-index"
  | "article"
  | "trust";

export type ContentPage = {
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  kind: PageKind;
  published: string;
  modified: string;
  image?: string;
  imageAlt?: string;
  sections: Section[];
  faqs?: Faq[];
  related: { href: string; label: string; description: string }[];
};
