import { site } from "@/site";
import { GitHubIcon, LinkedInIcon, FacebookIcon, EmailIcon, RssIcon } from "./icons";
import styles from "./SocialLinks.module.css";

export default function SocialLinks() {
  return (
    <ul className={styles.list}>
      <li>
        <a className={styles.link} href={site.social.github} aria-label="GitHub">
          <GitHubIcon />
        </a>
      </li>
      <li>
        <a className={styles.link} href={site.social.linkedin} aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
      </li>
      <li>
        <a className={styles.link} href={site.social.facebook} aria-label="Facebook">
          <FacebookIcon />
        </a>
      </li>
      <li>
        <a className={styles.link} href={`mailto:${site.email}`} aria-label="Email">
          <EmailIcon />
        </a>
      </li>
      <li>
        <a className={styles.link} href="/feed.xml" aria-label="RSS feed">
          <RssIcon />
        </a>
      </li>
    </ul>
  );
}
