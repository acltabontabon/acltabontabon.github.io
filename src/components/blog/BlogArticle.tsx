import { Link } from "react-router-dom";
import ArticleLayout from "@/components/ArticleLayout";
import type { BlogEntry } from "@/content/types";
import PostNav from "./PostNav";
import styles from "./BlogArticle.module.css";

export interface BlogArticleProps {
  title: string;
  date: string;
  readingTime: string;
  description: string;
  html: string;
  newer?: BlogEntry;
  older?: BlogEntry;
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
          <Link className={styles.all} to="/blog">
            All writing <span aria-hidden="true">→</span>
          </Link>
        </>
      }
    />
  );
}
