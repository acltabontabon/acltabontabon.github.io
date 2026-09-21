import { useParams } from "react-router-dom";
import ArticleLayout from "@/components/ArticleLayout";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import { garageEntries, findBySlug } from "@/content/loader";
import { statusLabel } from "@/lib/garageStatus";
import styles from "./GarageDetail.module.css";

export default function GarageDetail() {
  const { slug } = useParams();
  const entry = findBySlug(garageEntries, slug);
  if (!entry || !entry.html) return <NotFound />;
  const { meta } = entry;

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        path={`/garage/${entry.slug}`}
        image={meta.screenshot}
        type="article"
      />
      <ArticleLayout
        title={meta.title}
        date={meta.date}
        readingTime={entry.readingTime}
        description={meta.hook}
        html={entry.html}
        back={{ to: "/garage", label: "Garage" }}
        rail={
          <>
            <p className={styles.status}>
              {[meta.status && statusLabel[meta.status], meta.version && `v${meta.version}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {(meta.liveUrl || meta.github) && (
              <ul className={styles.links}>
                {meta.liveUrl && (
                  <li>
                    <a href={meta.liveUrl} target="_blank" rel="noreferrer">
                      {meta.actionLabel ?? "Live"} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )}
                {meta.github && (
                  <li>
                    <a
                      href={meta.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${meta.title} on GitHub`}
                    >
                      Source <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                )}
              </ul>
            )}
          </>
        }
      />
    </>
  );
}
