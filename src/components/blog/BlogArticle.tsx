import { Link } from "react-router-dom";
import ArticleLayout from "@/components/ArticleLayout";
import type { BlogSummary } from "@/content/types";
import PostNav from "./PostNav";
import styles from "./BlogArticle.module.css";
import textLink from "@/components/TextLink.module.css";

export interface BlogArticleProps {
  title: string;
  date: string;
  readingTime: string;
  description: string;
  html: string;
  newer?: BlogSummary;
  older?: BlogSummary;
}

export default function BlogArticle({
  title,
  date,
  readingTime,
  description,
  html,
  newer,
  older,
}: BlogArticleProps) {
  return (
    <ArticleLayout
      title={title}
      date={date}
      readingTime={readingTime}
      description={description}
      html={html}
      back={{ to: "/blog", label: "Writing" }}
      footer={
        <>
          <PostNav newer={newer} older={older} />
          <Link className={`${styles.all} ${textLink.link}`} to="/blog">
            All writing
          </Link>
        </>
      }
    />
  );
}
