import { useParams } from "react-router-dom";
import HeaderAvatar from "@/components/HeaderAvatar";
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
      {/* the article's own title takes the <h1> here */}
      <HeaderAvatar compact nameAs="p" />
      <BlogArticle
        title={entry.meta.title}
        date={entry.meta.date}
        readingTime={entry.readingTime}
        description={entry.meta.description}
        tags={entry.meta.tags}
        html={entry.html}
        newer={newer}
        older={older}
      />
    </>
  );
}
