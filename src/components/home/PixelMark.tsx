import { useEffect, useMemo, useRef } from "react";
import { drawArt } from "./pixelArt";
import styles from "./PixelMark.module.css";

/**
 * A project's homepage illustration as a small static mark: drawn once, in
 * whole device pixels, in the element's own text colour (so the stylesheet
 * decides how loud it is). The box is sized in the markup, so nothing shifts
 * when it paints. Decorative.
 */
export default function PixelMark({ id, scale = 2, className = "" }: { id: string; scale?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const art = useMemo(() => drawArt(id), [id]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !art) return;

    const paint = () => {
      const p = Math.max(1, Math.round(scale * (window.devicePixelRatio || 1)));
      canvas.width = art.w * p;
      canvas.height = art.h * p;
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (let y = 0; y < art.h; y++) for (let x = 0; x < art.w; x++) if (art.data[y * art.w + x]) ctx.fillRect(x * p, y * p, p, p);
    };
    paint();

    // repaint for a new pixel ratio (zoom, another screen); the query is tied
    // to one ratio, so it re-arms itself each time
    let query: MediaQueryList | null = null;
    const watch = () => {
      query?.removeEventListener("change", onChange);
      query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      query.addEventListener("change", onChange);
    };
    const onChange = () => {
      paint();
      watch();
    };
    watch();
    return () => query?.removeEventListener("change", onChange);
  }, [art, scale]);

  if (!art) return null;
  return (
    <canvas
      ref={ref}
      className={`${styles.mark} ${className}`.trim()}
      style={{ width: art.w * scale, height: art.h * scale }}
      aria-hidden="true"
    />
  );
}
