import { Link, useLocation } from "react-router-dom";
import { site } from "@/site";
import styles from "./SiteHeader.module.css";

// Visible labels only — the URLs stay what they've always been.
const sections = [
  { to: "/garage", label: "Garage" },
  { to: "/blog", label: "Writing" },
  { to: "/about", label: "About" },
];

/**
 * "act." home on the left, the three sections on the right. The section
 * you're in is marked with a persistent underline rather than a colour; on
 * the section's own index it's also aria-current="page", and inside it (an
 * article under /blog, say) aria-current="true".
 */
export default function SiteHeader() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/" className={styles.mark} aria-label={`${site.name} — home`} aria-current={path === "/" ? "page" : undefined}>
          act.
        </Link>
        <span className={styles.tagline}>Software &amp; side quests</span>
      </div>
      <nav aria-label="Main">
        <ul className={styles.nav}>
          {sections.map(({ to, label }) => {
            const current = path === to ? "page" : path.startsWith(`${to}/`) ? "true" : undefined;
            return (
              <li key={to}>
                <Link to={to} className={styles.link} aria-current={current}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
