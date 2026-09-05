import type { CSSProperties } from "react";
import styles from "./TapeStrip.module.css";

interface TapeStripProps {
  corner?: "top" | "topLeft" | "topRight";
  rotate?: number;
}

/** A little strip of "tape" pinning something to the page. */
export default function TapeStrip({ corner = "top", rotate = -3 }: TapeStripProps) {
  const style = { transform: `rotate(${rotate}deg)` } as CSSProperties;
  return <span className={`${styles.tape} ${styles[corner]}`} style={style} aria-hidden="true" />;
}
