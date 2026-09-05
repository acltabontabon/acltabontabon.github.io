import styles from "./Squiggle.module.css";

/** A short hand-drawn underline, used as a hover accent under links/nav items. */
export default function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      className={[styles.squiggle, className].filter(Boolean).join(" ")}
      viewBox="0 0 60 6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M1 3 C 10 0.5, 15 5.5, 22 3 S 34 0.5, 41 3 S 53 5.5, 59 3" />
    </svg>
  );
}
