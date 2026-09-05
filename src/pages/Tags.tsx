import HeaderAvatar from "@/components/HeaderAvatar";
import TagPill from "@/components/TagPill";
import Seo from "@/components/Seo";
import { allTags } from "@/content/loader";
import styles from "./ListPage.module.css";

export default function Tags() {
  const tags = allTags();

  return (
    <>
      <Seo title="Tags" path="/tags" description="Everything on this site, grouped by topic." />
      <HeaderAvatar compact />
      <section className={styles.section}>
        <p className={styles.intro}>Everything on the site, sliced by topic instead of section.</p>
        <ul className={styles.tagCloud}>
          {tags.map((tag) => (
            <li key={tag}>
              <TagPill tag={tag} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
