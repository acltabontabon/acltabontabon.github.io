import { useEffect, useRef, useState } from "react";

/**
 * Starts visible (so no-JS / pre-hydration renders show real content), then —
 * only if the element is below the fold and the visitor hasn't asked for
 * reduced motion — hides it and reveals it once it scrolls into view.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const alreadyVisible = el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (alreadyVisible) return;

    setRevealed(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
