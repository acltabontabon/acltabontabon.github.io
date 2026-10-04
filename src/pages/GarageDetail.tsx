import { useLoaderData } from "react-router-dom";
import ArticleLayout from "@/components/ArticleLayout";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import type { GarageEntry } from "@/content/types";
import { statusLabel } from "@/lib/garageStatus";
import styles from "./GarageDetail.module.css";
import textLink from "@/components/TextLink.module.css";

export default function GarageDetail() {
  const entry = useLoaderData() as GarageEntry | null;
  if (!entry || !entry.html) return <NotFound />;
  const { meta } = entry;
  const sourceUrl = meta.sourceUrl ?? meta.github;

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
            {(meta.liveUrl || sourceUrl) && (
              <ul className={styles.links}>
                {meta.liveUrl && (
                  <li>
                    <a className={textLink.link} href={meta.liveUrl} target="_blank" rel="noreferrer">
                      {meta.actionLabel ?? "Visit project"}
                    </a>
                  </li>
                )}
                {sourceUrl && (
                  <li>
                    <a
                      className={textLink.link}
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Source code for ${meta.title}`}
                    >
                      Source code
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
