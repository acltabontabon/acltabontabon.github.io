import { useEffect, useRef } from "react";
import styles from "./ReadingProgress.module.css";

/**
 * A 2px line that tracks scroll position. The server renders the element with
 * no inline style and the client's first render is identical — the value is
 * only ever written from an effect — so there's no hydration mismatch. It's
 * `position: fixed`, so it can't shift the layout, and it declares no
 * transition, so it needs no reduced-motion guard: this is a 1:1 mapping of
 * scroll position, not an animation.
 */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--progress", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div ref={ref} className={styles.bar} aria-hidden="true" />;
}
