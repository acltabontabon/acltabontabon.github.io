import { Link } from "react-router-dom";
import type { CSSProperties, ReactNode } from "react";
import PageHead from "@/components/PageHead";
import Seo from "@/components/Seo";
import PixelMark from "@/components/home/PixelMark";
import { hasCard } from "@/components/home/pixelArt";
import { actionsFor } from "@/components/garage/actions";
import { garageEntries } from "@/content/loader";
import type { GarageEntry } from "@/content/types";
import { statusLabel } from "@/lib/garageStatus";
import styles from "./Garage.module.css";

const INTRO = "Things I've built, things I'm building, and a few things I should probably clean up.";

/** An external destination opens in a new tab, as it always has here. */
function Destination({
  href,
  external,
  className,
  label,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  label?: string;
  children: ReactNode;
}) {
  return external ? (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  ) : (
    <Link className={className} to={href} aria-label={label}>
      {children}
    </Link>
  );
}

function Project({ entry, number }: { entry: GarageEntry; number: number }) {
  const { meta, slug, screenshotSize } = entry;
  const { primary, source } = actionsFor(entry);
  const num = String(number).padStart(2, "0");

  return (
    <li className={styles.project}>
      <article className={styles.projectInner} aria-labelledby={`p-${slug}`}>
        <div className={styles.text}>
          <p className={styles.meta}>
            <span>{num}</span>
            <span>{statusLabel[meta.status]}</span>
            {meta.version && <span>v{meta.version}</span>}
          </p>

          <div className={styles.nameRow}>
            <h2 id={`p-${slug}`} className={styles.name}>
              {meta.title}
            </h2>
            {hasCard(meta.art) && <PixelMark id={meta.art} scale={1} className={styles.mark} />}
          </div>

          {meta.hook && <p className={styles.hook}>{meta.hook}</p>}
          <p className={styles.description}>{meta.description}</p>

          {meta.tech.length > 0 && (
            <ul className={styles.tech} aria-label="Built with">
              {meta.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          {(primary || source) && (
            <div className={styles.actions}>
              {primary && (
                <Destination
                  href={primary.href}
                  external={primary.external}
                  className={styles.primary}
                  label={`${primary.label}: ${meta.title}`}
                >
                  {primary.label} <span aria-hidden="true">{primary.external ? "↗" : "→"}</span>
                </Destination>
              )}
              {source && (
                <a
                  className={styles.secondary}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={source.label}
                >
                  {source.name} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>

        {meta.screenshot && (
          <figure
            className={styles.shot}
            style={
              screenshotSize
                ? ({ "--ar": screenshotSize.width / screenshotSize.height } as CSSProperties)
                : undefined
            }
          >
            <img
              src={meta.screenshot}
              alt={`Screenshot of the ${meta.title} interface`}
              width={screenshotSize?.width}
              height={screenshotSize?.height}
              loading={number === 1 ? "eager" : "lazy"}
              decoding="async"
            />
            <figcaption className={styles.caption}>
              Fig. {num} — {meta.title}
            </figcaption>
          </figure>
        )}
      </article>
    </li>
  );
}

export default function Garage() {
  // Visual weight follows the content: `featured` entries get a full section,
  // everything else drops to the index. Nothing is hand-placed, so a new
  // markdown file lands in the right tier on its own.
  const featured = garageEntries.filter((e) => e.meta.featured);
  const rest = garageEntries.filter((e) => !e.meta.featured);

  const years = garageEntries.map((e) => e.meta.date.slice(0, 4)).sort();
  const span =
    years.length > 0
      ? years[0] === years[years.length - 1]
        ? years[0]
        : `${years[0]} – ${years[years.length - 1]}`
      : "";

  return (
    <>
      <Seo title="Garage" path="/garage" description={INTRO} />
      <PageHead
        title="Garage"
        lead={
          <>
            Things I&apos;ve built, things I&apos;m building,{" "}
            <PageHead.Soft>and a few things I should probably clean up.</PageHead.Soft>
          </>
        }
        aside={
          <>
            mostly software.
            <br />
            occasionally overengineered.
          </>
        }
        meta={
          <>
            {String(garageEntries.length).padStart(2, "0")}{" "}
            {garageEntries.length === 1 ? "project" : "projects"}
            {span && ` · ${span}`}
          </>
        }
      />

      <ol className={styles.projects}>
        {featured.map((entry, i) => (
          <Project key={entry.slug} entry={entry} number={i + 1} />
        ))}
      </ol>

      {rest.length > 0 && (
        <section className={styles.others} aria-labelledby="garage-others">
          <h2 id="garage-others" className={styles.othersLabel}>
            Other things
          </h2>
          <ol className={styles.index}>
            {rest.map((entry, i) => {
              const { meta, slug } = entry;
              const { primary } = actionsFor(entry);
              const row = (
                <>
                  <span className={styles.num}>{String(featured.length + i + 1).padStart(2, "0")}</span>
                  <span className={styles.rowTitle}>{meta.title}</span>
                  <span className={styles.rowHook}>{meta.hook ?? meta.description}</span>
                  <span className={styles.rowTech}>{meta.tech.join(" / ")}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    {primary?.external ? "↗" : "→"}
                  </span>
                </>
              );
              return (
                <li key={slug}>
                  {primary ? (
                    <Destination href={primary.href} external={primary.external} className={styles.row}>
                      {row}
                    </Destination>
                  ) : (
                    <span className={styles.row}>{row}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </>
  );
}
