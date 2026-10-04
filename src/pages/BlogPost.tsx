import { useLoaderData } from "react-router-dom";
import BlogArticle from "@/components/blog/BlogArticle";
import ReadingProgress from "@/components/blog/ReadingProgress";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { adjacentBlog, blogEntries } from "@/content/loader";
import type { BlogEntry } from "@/content/types";

export default function BlogPost() {
  const entry = useLoaderData() as BlogEntry | null;
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
        noteNumber={blogEntries.length - blogEntries.findIndex(({ slug }) => slug === entry.slug)}
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
