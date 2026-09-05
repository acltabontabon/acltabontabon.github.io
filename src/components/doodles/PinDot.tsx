import styles from "./PinDot.module.css";

/** A tiny pushpin dot, marking a card as "pinned to the wall" of the Garage. */
export default function PinDot() {
  return (
    <svg className={styles.pin} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="5" fill="currentColor" />
      <circle cx="5.5" cy="5.5" r="1.4" fill="#fff" opacity="0.6" />
    </svg>
  );
}
