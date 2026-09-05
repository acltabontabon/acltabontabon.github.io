import { useEffect } from "react";

/**
 * Fallback reveal for ambient article media (see Prose.module.css).
 *
 * Where the browser supports scroll-driven animations the whole effect is CSS
 * and this does nothing at all — no listener, no work per scroll. Only older
 * browsers get an IntersectionObserver, which fires on threshold crossings
 * rather than on every scroll event, so scrolling stays cheap either way.
 */
export function useAmbientMedia(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.CSS?.supports?.("animation-timeline: view()")) return;

    const layers = document.querySelectorAll<HTMLElement>("figure[data-media='ambient'] .ambient");
    if (layers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-present", entry.isIntersecting);
        }
      },
      // a generous middle band, so it surfaces before the section arrives and
      // sinks once it's behind the reader
      { rootMargin: "-20% 0px -20% 0px" },
    );

    for (const layer of layers) observer.observe(layer);
    return () => observer.disconnect();
  }, [enabled]);
}
