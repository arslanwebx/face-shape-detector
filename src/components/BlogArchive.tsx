import { blogArticles } from "@/content/pages";
import ArticleCard from "./ArticleCard";

export default function BlogArchive() {
  const featured = blogArticles.find((article) => article.featured) ?? blogArticles[0];
  const remaining = blogArticles.filter((article) => article.path !== featured.path);

  return (
    <section className="blog-library" aria-labelledby="all-articles-heading">
      <div className="featured-article"><ArticleCard article={featured} featured /></div>
      <div className="library-heading"><div><h2 id="all-articles-heading">All face-shape articles</h2></div><p>{blogArticles.length} practical guides and comparisons</p></div>
      <div className="blog-archive-grid">{remaining.map((article) => <ArticleCard article={article} key={article.path} />)}</div>
    </section>
  );
}
