import { site } from "@/site";
import styles from "./Footer.module.css";

const elsewhere = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "Facebook", href: site.social.facebook },
  { label: "RSS", href: "/feed.xml" },
];

/** The same quiet footer line on every page. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} {site.name}
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
