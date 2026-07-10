import Image from "next/image";
import Link from "next/link";
import type { ContentPage } from "@/content/types";
import { formatContentDate, readingTime } from "@/lib/content";

export default function ArticleCard({ article, featured = false }: { article: ContentPage; featured?: boolean }) {
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <Link className="article-card-image" href={article.path} aria-label={`Read ${article.title}`}>
        <Image src={article.image ?? "/og/blog.svg"} alt={article.imageAlt ?? ""} width={1200} height={675} sizes={featured ? "(max-width: 800px) 100vw, 58vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"} />
      </Link>
      <div className="article-card-content">
        <span className="topic-label">{article.topic ?? article.eyebrow}</span>
        <h2><Link href={article.path}>{article.title}</Link></h2>
        <p>{article.description}</p>
        <div className="article-card-meta"><time dateTime={article.published}>{formatContentDate(article.published)}</time><span>{readingTime(article)} min read</span></div>
        <Link className="read-article-link" href={article.path}>Read article <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
