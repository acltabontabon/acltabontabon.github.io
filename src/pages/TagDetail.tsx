import { useParams } from "react-router-dom";
import PageHead from "@/components/PageHead";
import PostListItem from "@/components/PostListItem";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { allTaggedEntries } from "@/content/loader";
import styles from "./ListPage.module.css";

export default function TagDetail() {
  const { tag } = useParams();
  const decoded = tag ? decodeURIComponent(tag) : "";
  const entries = allTaggedEntries().filter((e) => e.tags.includes(decoded));
  if (entries.length === 0) return <NotFound />;

  return (
    <>
      <Seo title={`#${decoded}`} path={`/tags/${tag}`} description={`Everything tagged "${decoded}".`} />
      <PageHead
        title={`#${decoded}`}
        meta={
          <>
            Tagged “{decoded}” · {String(entries.length).padStart(2, "0")} {entries.length === 1 ? "entry" : "entries"}
          </>
        }
      />
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={`${entry.type}-${entry.slug}`}>
            <PostListItem to={`/${entry.type}/${entry.slug}`} title={entry.title} date={entry.date} />
          </li>
        ))}
      </ul>
    </>
  );
}
