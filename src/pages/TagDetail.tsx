import { useParams } from "react-router-dom";
import HeaderAvatar from "@/components/HeaderAvatar";
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
      <HeaderAvatar compact />
      <section className={styles.section}>
        <p className={styles.intro}>Tagged “{decoded}”</p>
        <div className={styles.list}>
          {entries.map((entry) => (
            <PostListItem
              key={`${entry.type}-${entry.slug}`}
              to={`/${entry.type}/${entry.slug}`}
              title={entry.title}
              date={entry.date}
            />
          ))}
        </div>
      </section>
    </>
  );
}
