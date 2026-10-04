import { Link } from "react-router-dom";
import ArticleLayout from "@/components/ArticleLayout";
import type { BlogSummary } from "@/content/types";
import PostNav from "./PostNav";
import styles from "./BlogArticle.module.css";
import textLink from "@/components/TextLink.module.css";

export interface BlogArticleProps {
  noteNumber: number;
  title: string;
  date: string;
  readingTime: string;
  description: string;
  html: string;
  newer?: BlogSummary;
  older?: BlogSummary;
}

export default function BlogArticle({
  noteNumber,
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
      notebook
      title={title}
      date={date}
      readingTime={readingTime}
      description={description}
      html={html}
      back={{ to: "/blog", label: "Writing" }}
      rail={
        <div className={styles.marginNote}>
          <p className={styles.noteNumber}>Note {String(noteNumber).padStart(2, "0")}</p>
          <p className={styles.handwritten}>From the <br />notebook.</p>
          <span className={styles.scribble} aria-hidden="true" />
        </div>
      }
      footer={
        <>
          <p className={styles.closing}>A thought worth keeping.</p>
          <PostNav newer={newer} older={older} />
          <Link className={`${styles.all} ${textLink.link}`} to="/blog">
            All writing
          </Link>
        </>
      }
    />
  );
}
