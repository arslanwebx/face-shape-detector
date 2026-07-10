import Link from "next/link";
import type { ReactNode } from "react";

const linkPattern = /\[([^\]]+)\]\(((?:\/|mailto:)[^\s\)]+)\)/g;

export default function RichText({ text }: { text: string }) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(linkPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) content.push(text.slice(cursor, index));
    const href = match[2];
    content.push(href.startsWith("mailto:") ? <a href={href} key={`${href}-${index}`}>{match[1]}</a> : <Link href={href} key={`${href}-${index}`}>{match[1]}</Link>);
    cursor = index + match[0].length;
  }

  if (cursor < text.length) content.push(text.slice(cursor));
  return <>{content}</>;
}
