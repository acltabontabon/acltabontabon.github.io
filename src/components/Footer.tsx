import { site } from "@/site";
import styles from "./Footer.module.css";

const elsewhere = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "Facebook", href: site.social.facebook },
];

/** The same quiet footer line on every page. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        {/* the full name is already the homepage heading; the mark echoes the header */}
        © {new Date().getFullYear()} act.
      </span>
      <ul className={styles.links}>
        <li>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        {elsewhere.map((s) => (
          <li key={s.label}>
            <a href={s.href}>{s.label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
