import { NavLink } from "react-router-dom";
import Squiggle from "./doodles/Squiggle";
import styles from "./Nav.module.css";

const links = [
  { to: "/garage", label: "Garage" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
];

export default function Nav({ compact = false }: { compact?: boolean }) {
  return (
    <nav aria-label="Main">
      <ul className={compact ? `${styles.nav} ${styles.navCompact}` : styles.nav}>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.linkActive}` : styles.link)}
            >
              {link.label}
              <Squiggle className={styles.underline} />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
