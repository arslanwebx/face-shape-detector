import Link from "next/link";
import type { ReactNode } from "react";

const linkPattern = /\[([^\]]+)\]\((\/[^\s\)]+)\)/g;

export default function RichText({ text }: { text: string }) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(linkPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) content.push(text.slice(cursor, index));
    content.push(<Link href={match[2]} key={`${match[2]}-${index}`}>{match[1]}</Link>);
    cursor = index + match[0].length;
  }

  if (cursor < text.length) content.push(text.slice(cursor));
  return <>{content}</>;
}
