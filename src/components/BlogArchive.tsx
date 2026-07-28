import { blogArticles } from "@/content/pages";
import ArticleCard from "./ArticleCard";

export default function BlogArchive() {
  const articles = [...blogArticles].sort((first, second) =>
    second.published.localeCompare(first.published) || blogArticles.indexOf(second) - blogArticles.indexOf(first),
  );

  return (
    <section className="blog-library" aria-labelledby="all-articles-heading">
      <div className="library-heading"><div><h2 id="all-articles-heading">All face-shape articles</h2></div><p>{blogArticles.length} practical guides and comparisons</p></div>
      <div className="blog-archive-grid">{articles.map((article) => <ArticleCard article={article} key={article.path} />)}</div>
    </section>
  );
}
