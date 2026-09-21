import { useParams } from "react-router-dom";
import BlogArticle from "@/components/blog/BlogArticle";
import ReadingProgress from "@/components/blog/ReadingProgress";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { adjacentBlog, blogEntries, findBySlug } from "@/content/loader";

export default function BlogPost() {
  const { slug } = useParams();
  const entry = findBySlug(blogEntries, slug);
  if (!entry) return <NotFound />;

  const { newer, older } = adjacentBlog(entry.slug);

  return (
    <>
      <Seo
        title={entry.meta.title}
        description={entry.meta.description}
        path={`/blog/${entry.slug}`}
        image={entry.meta.image}
        type="article"
      />
      <ReadingProgress />
      <BlogArticle
        title={entry.meta.title}
        date={entry.meta.date}
        readingTime={entry.readingTime}
        description={entry.meta.description}
        html={entry.html}
        newer={newer}
        older={older}
      />
    </>
  );
}
