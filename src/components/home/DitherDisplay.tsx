import { useEffect, useRef } from "react";
import { CARD_H, CARD_W, DOT, INK, drawCard } from "./pixelArt";
import styles from "./DitherDisplay.module.css";

export interface DisplaySource {
  /** An image to dither… */
  src?: string;
  /** …or a hand-drawn pixel card (see pixelArt.ts), drawn as-is. */
  card?: { id: string; lines: string[] };
  /** Vertical point of interest in the source, 0–1; the crop centres on it. */
  focusY?: number;
  /** Let the crop drift toward the pointer (the portrait's eyes follow you). */
  follow?: boolean;
  /** Photographic S-curve (true) or a flatter lift that keeps UI detail (false). */
  punchy?: boolean;
}

const DRIFT = 16; // source px the crop shifts toward the pointer
const LENS = 88; // css px radius of the enhance lens
const PRINT_MS = 1100; // the portrait prints in once, on first load
const SWAP_MS = 160; // every later change is a short crossfade

// 8×8 Bayer matrix, normalised to 0–1 thresholds
const BAYER = (() => {
  const m = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  return m.map((row) => row.map((v) => (v + 0.5) / 64));
})();

function rgbOf(value: string, fallback: [number, number, number]): [number, number, number] {
  const hex = /^#?([0-9a-f]{6})$/i.exec(value.trim());
  if (!hex) return fallback;
  const n = parseInt(hex[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const cache = new Map<string, Promise<HTMLImageElement>>();
function load(src: string): Promise<HTMLImageElement> {
  let p = cache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    cache.set(src, p);
  }
  return p;
}

function makeCanvas(w = 0, h = 0) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/**
 * A 1-bit "screen". An image source is cropped to the canvas's shape and
 * rendered with an ordered (Bayer) dither — the look of an old handheld
 * display or a dot-matrix print — and under a mouse pointer a lens
 * re-renders it at double resolution. A card source is authored pixel art on
 * a faint idle dot grid.
 *
 * Everything is laid out in whole *device* pixels: the backing store matches
 * the element's device-pixel size, and every art pixel is an integer number
 * of device pixels wide, so the grid stays perfectly even at any display
 * density. The canvas only repaints on a change (a new source, a resize, the
 * portrait's drift while the pointer moves, the lens); nothing runs while
 * the page is idle.
 *
 * Ordered dithering, not error diffusion, on purpose: the pattern is stable
 * frame to frame, so the portrait's drift reads as movement, not shimmer.
 *
 * Decorative: the surrounding <figure> carries the accessible name.
 */
export default function DitherDisplay({ source, preload = [] }: { source: DisplaySource; preload?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showRef = useRef<((s: DisplaySource) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ink = rgbOf(getComputedStyle(document.documentElement).getPropertyValue("--color-heading"), [237, 237, 237]);
    const inkCss = `rgb(${ink[0]}, ${ink[1]}, ${ink[2]})`;

    const sample = makeCanvas();
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;
    const coarse = makeCanvas(); // portrait, one texel per dot
    const detail = makeCanvas(); // portrait at 2×, for the lens
    const layer = makeCanvas(); // the current source, fully rendered
    const prev = makeCanvas(); // what was on screen when the source changed

    let img: HTMLImageElement | null = null;
    let current: DisplaySource | null = null;
    let invert = false;
    let punchy = true;
    let dpr = 1;
    let W = 0; // device px
    let H = 0;
    let cell = 4; // portrait dot size, device px (even, so the lens halves it cleanly)
    let grid = { cols: 0, rows: 0, ox: 0, oy: 0 };
    let frame = 0;
    let printStart = -1; // first reveal only
    let swapStart = -1;
    let token = 0;
    let disposed = false;
    const pointer = { nx: 0, ny: 0, x: 0, y: 0, inside: false };
    const drift = { x: 0, y: 0 };

    const meanLuminance = (image: HTMLImageElement) => {
      sample.width = 32;
      sample.height = 32;
      sctx.drawImage(image, 0, 0, 32, 32);
      const d = sctx.getImageData(0, 0, 32, 32).data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      return sum / (255 * 1024);
    };

    /** Dither the current crop into `target` at `cols`×`rows` texels. */
    const dither = (target: HTMLCanvasElement, cols: number, rows: number) => {
      if (!img || !current) return;
      // work inside a 5% inset: photo borders (a wall, a frame edge) dither
      // into stray columns of dots along the display's sides
      const inset = 0.05;
      const bx = img.naturalWidth * inset;
      const by = img.naturalHeight * inset;
      const iw = img.naturalWidth - bx * 2;
      const ih = img.naturalHeight - by * 2;
      const aspect = cols / rows;
      let sw = iw;
      let sh = iw / aspect;
      if (sh > ih) {
        sh = ih;
        sw = ih * aspect;
      }
      const dx = current.follow ? drift.x * DRIFT : 0;
      const dy = current.follow ? drift.y * DRIFT * 0.6 : 0;
      const sx = bx + Math.min(Math.max(iw / 2 - sw / 2 - dx, 0), iw - sw);
      const sy = by + Math.min(Math.max(ih * (current.focusY ?? 0.5) - sh / 2 - dy, 0), ih - sh);

      sample.width = cols;
      sample.height = rows;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows);
      const px = data.data;

      for (let y = 0; y < rows; y++) {
        const brow = BAYER[y & 7];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          let l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          if (invert) l = 1 - l;
          // Photos get an S-curve (holds skin, drops the shadows). UI gets a
          // black point, so near-black backgrounds stay empty instead of
          // dithering into a grey mesh, then a lift for text and thin rules.
          l = punchy ? l * l * (3 - 2 * l) : Math.pow(Math.max(0, (l - 0.22) / 0.78), 0.75);
          px[i] = ink[0];
          px[i + 1] = ink[1];
          px[i + 2] = ink[2];
          px[i + 3] = l > brow[x & 7] ? 235 : 0;
        }
      }
      target.width = cols;
      target.height = rows;
      target.getContext("2d")!.putImageData(data, 0, 0);
    };

    /** Render the current card into `layer`, in whole device pixels. */
    const renderCard = () => {
      const card = current!.card!;
      // one pixel size per viewport for every card, so the series never
      // changes scale from project to project
      const p = Math.max(1, Math.floor(Math.min((W * 0.9) / CARD_W, (H * 0.76) / CARD_H)));
      const lw = Math.max(CARD_W, Math.floor(W / p));
      const lh = Math.max(CARD_H, Math.floor(H / p));
      const ox = Math.floor((W - lw * p) / 2);
      const oy = Math.floor((H - lh * p) / 2);
      const bits = drawCard(card.id, card.lines, lw, lh);

      const lctx = layer.getContext("2d")!;
      lctx.clearRect(0, 0, W, H);
      lctx.fillStyle = inkCss;
      lctx.globalAlpha = 0.92;
      for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) if (bits[y * lw + x] === INK) lctx.fillRect(ox + x * p, oy + y * p, p, p);

      // the idle grid: small, dim, and square — a texture, not a pattern
      const d = Math.max(1, Math.round(p * 0.34));
      const inner = Math.floor((p - d) / 2);
      lctx.globalAlpha = 0.18;
      for (let y = 0; y < lh; y++)
        for (let x = 0; x < lw; x++) if (bits[y * lw + x] === DOT) lctx.fillRect(ox + x * p + inner, oy + y * p + inner, d, d);
      lctx.globalAlpha = 1;
    };

    /** Render the portrait into `layer` (and its lens texture into `detail`). */
    const renderPortrait = (withDetail: boolean) => {
      const { cols, rows, ox, oy } = grid;
      dither(coarse, cols, rows);
      if (withDetail) dither(detail, cols * 2, rows * 2);
      const lctx = layer.getContext("2d")!;
      lctx.imageSmoothingEnabled = false;
      lctx.clearRect(0, 0, W, H);
      lctx.drawImage(coarse, ox, oy, cols * cell, rows * cell);
    };

    const rebuild = (withDetail = true) => {
      if (!current || !W || !H) return;
      if (current.card) renderCard();
      else if (img) renderPortrait(withDetail && fine && !still);
    };

    const paint = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      if (!current) return false;

      if (printStart >= 0) {
        // first load: the portrait prints in top to bottom, snapped to dots
        const t = Math.min(1, (now - printStart) / PRINT_MS);
        const rows = Math.round((1 - (1 - t) ** 3) * grid.rows);
        const edge = grid.oy + rows * cell;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, edge);
        ctx.clip();
        ctx.drawImage(layer, 0, 0);
        ctx.restore();
        if (t < 1) {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = inkCss;
          ctx.fillRect(0, edge, W, Math.max(1, Math.round(dpr)));
          ctx.globalAlpha = 1;
          return true;
        }
        printStart = -1;
      } else if (swapStart >= 0) {
        const t = Math.min(1, (now - swapStart) / SWAP_MS);
        ctx.globalAlpha = 1 - t;
        ctx.drawImage(prev, 0, 0);
        ctx.globalAlpha = t;
        ctx.drawImage(layer, 0, 0);
        ctx.globalAlpha = 1;
        if (t < 1) return true;
        swapStart = -1;
      } else {
        ctx.drawImage(layer, 0, 0);
      }

      if (!current.card && pointer.inside && detail.width) {
        const px = pointer.x * dpr;
        const py = pointer.y * dpr;
        const r = LENS * dpr;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.clearRect(px - r, py - r, r * 2, r * 2);
        ctx.drawImage(detail, grid.ox, grid.oy, grid.cols * cell, grid.rows * cell);
        ctx.restore();

        ctx.strokeStyle = `rgba(${ink[0]}, ${ink[1]}, ${ink[2]}, 0.45)`;
        ctx.lineWidth = dpr;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        for (const [ux, uy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          ctx.moveTo(px + ux * (r - 6 * dpr), py + uy * (r - 6 * dpr));
          ctx.lineTo(px + ux * (r + 6 * dpr), py + uy * (r + 6 * dpr));
        }
        ctx.stroke();
      }
      return false;
    };

    const tick = (now: number) => {
      frame = 0;
      const follow = !!current?.follow && !current.card && !still;
      const tx = follow ? pointer.nx : 0;
      const ty = follow ? pointer.ny : 0;
      const moving = follow && (Math.abs(tx - drift.x) > 0.002 || Math.abs(ty - drift.y) > 0.002);
      if (moving) {
        drift.x += (tx - drift.x) * 0.12;
        drift.y += (ty - drift.y) * 0.12;
        rebuild(true);
      }
      const animating = paint(now);
      if (animating || moving) frame = requestAnimationFrame(tick);
    };
    const request = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(tick);
    };

    const present = (s: DisplaySource) => {
      const first = current === null;
      if (!first && !still) {
        // Crossfade from exactly what's on screen now — mid-fade included —
        // so rapid changes never queue up or flash back through the portrait.
        const pctx = prev.getContext("2d")!;
        pctx.clearRect(0, 0, W, H);
        pctx.drawImage(canvas, 0, 0);
        swapStart = performance.now();
      }
      current = s;
      rebuild(true);
      if (first) printStart = still ? -1 : performance.now();
      // a crossfade in progress keeps running; no new timer or queue
      if (still) paint(performance.now());
      else request();
    };

    showRef.current = (s: DisplaySource) => {
      const mine = ++token;
      if (s.card) {
        present(s);
        return;
      }
      if (!s.src) return;
      const apply = (image: HTMLImageElement) => {
        if (disposed || mine !== token) return;
        img = image;
        invert = meanLuminance(image) > 0.55;
        punchy = s.punchy ?? false;
        present(s);
      };
      // the portrait is decoded after first load, so returning to it is
      // synchronous and the crossfade starts on the same frame
      if (img && img.src.endsWith(s.src)) apply(img);
      else load(s.src).then(apply).catch(() => {});
    };

    // Measured from the parent: the canvas itself is then sized to a whole
    // number of device pixels (a fraction of a css px under the box, at most),
    // so the browser never resamples the backing store.
    const box = canvas.parentElement!;
    const setup = () => {
      const r = box.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      W = Math.max(1, Math.floor(r.width * dpr));
      H = Math.max(1, Math.floor(r.height * dpr));
      for (const c of [canvas, layer, prev]) {
        c.width = W;
        c.height = H;
      }
      canvas.style.width = `${W / dpr}px`;
      canvas.style.height = `${H / dpr}px`;
      // ~300 dots across at any width, never finer than 2 css px (it stops
      // reading as 1-bit), always an even number of device px
      cell = Math.max(2 * Math.ceil(dpr), 2 * Math.round(W / 600));
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      grid = { cols, rows, ox: Math.floor((W - cols * cell) / 2), oy: Math.floor((H - rows * cell) / 2) };
      swapStart = -1; // a resize mid-fade just lands on the new frame
      rebuild(true);
      paint(performance.now());
      if (printStart >= 0) request();
    };
    setup();

    const resize = new ResizeObserver(setup);
    resize.observe(box);
    // A page zoom or a move to another screen changes the ratio without
    // changing the box's css size. The query is tied to one ratio, so it
    // re-arms itself for the new one each time it fires.
    let densityQuery: MediaQueryList | null = null;
    const onDensity = () => {
      setup();
      watchDensity();
    };
    const watchDensity = () => {
      densityQuery?.removeEventListener("change", onDensity);
      densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      densityQuery.addEventListener("change", onDensity);
    };
    watchDensity();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = pointer.x >= 0 && pointer.x <= r.width && pointer.y >= 0 && pointer.y <= r.height;
      pointer.nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      pointer.ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      request();
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.nx = 0;
      pointer.ny = 0;
      request();
    };

    if (fine && !still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    return () => {
      disposed = true;
      showRef.current = null;
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      densityQuery?.removeEventListener("change", onDensity);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  useEffect(() => {
    showRef.current?.(source);
  }, [source]);

  useEffect(() => {
    if (!preload.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const id = window.setTimeout(() => preload.forEach((src) => void load(src).catch(() => {})), 400);
    return () => window.clearTimeout(id);
  }, [preload]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
