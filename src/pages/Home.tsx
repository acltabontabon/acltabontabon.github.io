import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import DitherDisplay, { type DisplaySource } from "@/components/home/DitherDisplay";
import { hasCard } from "@/components/home/pixelArt";
import { actionsFor } from "@/components/garage/actions";
import { garageEntries } from "@/content/loader";
import { statusLabel } from "@/lib/garageStatus";
import { site } from "@/site";
import styles from "./Home.module.css";

const featured = garageEntries.filter((e) => e.meta.featured);

// Module-level so their identity is stable — the display reprints whenever
// the source object changes.
const PORTRAIT: DisplaySource = { src: "/images/profile.jpg", focusY: 0.86, follow: true, punchy: true };

/** One word a line, "Draft Canvas" → ["DRAFT", "CANVAS"]; the card sets its
 *  title at 2×, and nine characters is the most a line has room for. */
function cardLines(title: string): string[] {
  return title
    .toUpperCase()
    .split(/\s+/)
    .flatMap((word) => word.match(/.{1,9}/g) ?? [])
    .slice(0, 2);
}

// Each featured project shows its pixel card if it has one, else a dithered
// screenshot; with neither, the display just stays on the portrait.
const screens: Record<string, DisplaySource> = Object.fromEntries(
  featured.flatMap((e): [string, DisplaySource][] => {
    if (hasCard(e.meta.art)) return [[e.slug, { card: { id: e.meta.art, lines: cardLines(e.meta.title) } }]];
    if (e.meta.screenshot) return [[e.slug, { src: e.meta.screenshot, focusY: 0.3 }]];
    return [];
  }),
);
const PRELOAD = Object.values(screens).flatMap((s) => (s.src ? [s.src] : []));

/**
 * Which project the display shows. Pointer hover and keyboard focus are
 * tracked separately and the most recent one wins; when one of them leaves
 * the list, the display falls back to the other, then to the portrait.
 * Moving between adjacent rows goes straight from project to project — the
 * pointer only "leaves" when it leaves the whole list. Touch never previews:
 * a tap is just a tap, and navigates on the first one.
 */
function useActiveProject() {
  const hover = useRef<string | null>(null);
  const focus = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const onRowPointerEnter = useCallback((slug: string, e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hover.current = slug;
    setActive(slug);
  }, []);
  const onListPointerLeave = useCallback((e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hover.current = null;
    setActive(focus.current);
  }, []);
  const onRowFocus = useCallback((slug: string, e: FocusEvent<HTMLElement>) => {
    // A mouse click also focuses the link; only keyboard-style focus
    // previews, so a clicked row doesn't pin the display after the pointer
    // moves away.
    if (!e.currentTarget.matches(":focus-visible")) return;
    focus.current = slug;
    setActive(slug);
  }, []);
  const onListBlur = useCallback((e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    focus.current = null;
    setActive(hover.current);
  }, []);

  return { active, onRowPointerEnter, onListPointerLeave, onRowFocus, onListBlur };
}

/**
 * The homepage: a 1-bit display, the name, and an index of the work. Each
 * project row is a single ordinary link; previewing it never gets in the way
 * of navigating it.
 */
export default function Home() {
  const { active, onRowPointerEnter, onListPointerLeave, onRowFocus, onListBlur } = useActiveProject();

  useEffect(() => {
    console.log("$ ./mvnw spring-boot:run");
    console.log("Started AlvinApplication in 0.420 seconds");
  }, []);

  const index = active ? featured.findIndex((e) => e.slug === active) : -1;
  const shown = index >= 0 ? featured[index] : null;
  const source = (active && screens[active]) || PORTRAIT;

  return (
    <>
      <Seo />
      <div className={styles.page}>
        {/* One stable accessible name for the figure; the previews are a
            visual echo of the rows below (which carry the same information),
            so they're not announced as they change. */}
        <figure className={styles.display} role="img" aria-label={`${site.name}, a dithered self-portrait`}>
          <div className={styles.screen}>
            <DitherDisplay source={source} preload={PRELOAD} />
          </div>
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.tr}`} />
          <span className={`${styles.corner} ${styles.bl}`} />
          <span className={`${styles.corner} ${styles.br}`} />
          <figcaption className={styles.caption} aria-hidden="true">
            <span>
              Fig. {String(index + 2).padStart(2, "0")} — {shown ? shown.meta.title : "Self-portrait"}
            </span>
            <span>
              {shown
                ? [
                    shown.meta.status && statusLabel[shown.meta.status],
                    shown.meta.version && `v${shown.meta.version}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : "1-bit · 8×8 ordered dither"}
            </span>
          </figcaption>
        </figure>

        <div className={styles.lower}>
          {/* Identity on the left, index on the right. Each column opens with
              the same small label, so their tops share a line. */}
          <div className={styles.identity}>
            <p className={styles.label}>Can be trusted with a computer</p>
            <h1 className={styles.name}>
              Alvin Cris
              <br />
              Tabontabon
            </h1>
            <div className={styles.about}>
              <p className={styles.tagline}>{site.tagline}.</p>
            </div>
          </div>

          <div className={styles.work}>
            <p className={styles.label}>Things I&apos;ve built</p>
            <ol
              className={styles.index}
              data-engaged={active ? "" : undefined}
              onPointerLeave={onListPointerLeave}
              onBlur={onListBlur}
            >
              {featured.map((entry, i) => {
                const { meta, slug } = entry;
                const action = actionsFor(entry).primary;
                const row = (
                  <>
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.title}>{meta.title}</span>
                    <span className={styles.hook}>{meta.hook ?? meta.description}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      {action?.external ? "↗" : "→"}
                    </span>
                  </>
                );
                const props = {
                  className: styles.row,
                  "data-active": active === slug ? "" : undefined,
                  onPointerEnter: (e: PointerEvent) => onRowPointerEnter(slug, e),
                  onFocus: (e: FocusEvent<HTMLElement>) => onRowFocus(slug, e),
                };
                return (
                  <li key={slug}>
                    {!action ? (
                      <span {...props}>{row}</span>
                    ) : action.external ? (
                      <a href={action.href} {...props}>
                        {row}
                      </a>
                    ) : (
                      <Link to={action.href} {...props}>
                        {row}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
            <Link to="/garage" className={styles.all}>
              Everything in the garage <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
