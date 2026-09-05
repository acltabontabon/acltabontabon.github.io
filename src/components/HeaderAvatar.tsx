import { Link } from "react-router-dom";
import { site } from "@/site";
import { useEyeTrack } from "@/lib/useEyeTrack";
import SocialLinks from "./SocialLinks";
import Nav from "./Nav";
import styles from "./HeaderAvatar.module.css";

/**
 * `nameAs` exists so a page whose own subject deserves the <h1> (an article's
 * title, say) can demote this to a <p> without changing a pixel — the site
 * name is identity, not the heading of the document it sits above.
 */
export default function HeaderAvatar({
  compact = false,
  nameAs: Name = "h1",
}: {
  compact?: boolean;
  nameAs?: "h1" | "p";
}) {
  // Only the homepage's large avatar watches the pointer; the 48px one in an
  // interior page header is far too small for the drift to read as anything.
  const frameRef = useEyeTrack<HTMLAnchorElement>(!compact);

  return (
    <header
      className={
        compact
          ? `${styles.header} ${styles.headerCompact} animate-in`
          : `${styles.header} ${styles.headerHome}`
      }
    >
      <Link to="/" ref={frameRef} className={styles.avatarLink}>
        <img className={styles.avatar} src="/images/profile.jpg" alt={site.name} width={96} height={96} />
      </Link>
      <Name className={styles.name}>{site.name}</Name>
      <p className={styles.tagline}>{site.tagline}</p>
      {!compact && <SocialLinks />}
      <Nav compact={compact} />
    </header>
  );
}
