// Markdown -> HTML rendering, used only by the Node prebuild script
// (build-content.mjs). This pulls in unified/remark/rehype/shiki, which is
// a lot of code — keeping it out of src/ means the client bundle never sees
// any of it, since pages only ever import the pre-rendered HTML string.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const PUBLIC_DIR = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "public");

// Keep in sync with src/components/doodles/paths.ts — this is the only
// place outside that component the squiggle shape needs to be known, so a
// literal duplicate is simpler than wiring a shared module across the
// app/build-tooling boundary for one string.
const SQUIGGLE_PATH =
  "M2 10 C 14 2, 26 18, 38 10 S 62 2, 74 10 S 98 18, 110 10 S 134 2, 146 10 S 170 18, 182 10 S 206 2, 218 10";
const SQUIGGLE_VIEWBOX = "0 0 220 20";

/** Replaces markdown thematic breaks (rendered as <hr>) with the hand-drawn divider doodle. */
function rehypeDivider() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "hr" || !parent || index == null) return;
      parent.children[index] = {
        type: "element",
        tagName: "svg",
        properties: { className: ["prose-divider"], viewBox: SQUIGGLE_VIEWBOX, "aria-hidden": "true" },
        children: [{ type: "element", tagName: "path", properties: { d: SQUIGGLE_PATH }, children: [] }],
      };
    });
  };
}

/** The node's single element child, ignoring whitespace-only text. Null if there isn't exactly one. */
function onlyElement(node) {
  const kids = (node.children ?? []).filter((c) => c.type !== "text" || c.value.trim() !== "");
  return kids.length === 1 && kids[0].type === "element" ? kids[0] : null;
}

/* Media scale is decided by the file itself, not by the author:

     inset     narrower than the reading column — shown at its true size
     wide      landscape enough to earn a breakout past the text
     portrait  taller than wide — bounded by height, so it can't run away
     column    everything else: squarish, held to the text width

   A tall photograph blown up to a landscape photograph's width would dominate
   the page, so aspect ratio gates the breakout, not size alone. */
const PROSE_MIN_WIDTH = 680;
const LANDSCAPE_MIN_ASPECT = 1.3;

const PORTRAIT_MAX_ASPECT = 0.95;

function mediaScale(size) {
  if (!size) return "column";
  if (size.width < PROSE_MIN_WIDTH) return "inset";
  const aspect = size.width / size.height;
  if (aspect < PORTRAIT_MAX_ASPECT) return "portrait";
  return aspect >= LANDSCAPE_MIN_ASPECT ? "wide" : "column";
}

/* An author can steer a single image with a hash on its URL:

     ![The team](/images/blog/afpfw.jpg#ambient)
     ![A diverse team](/images/blog/diverse-team.png#ambient+mono)

   A *scale* overrides the automatic sizing. `ambient` is the one that changes
   kind rather than size — the photograph stops being a block in the article and
   becomes a background the section passes through. It's opt-in precisely
   because it suits narrative photographs and almost nothing else: screenshots,
   diagrams and GIFs stay as they are.

   A *tone* modifies how it's rendered. `soft` holds it further back for
   artwork loud enough to tint a whole section from behind the prose; `mono`
   drains the colour out entirely. Combine any of them with `+`; order doesn't
   matter and tones stack. */
const MEDIA_SCALES = new Set(["ambient", "wide", "column", "inset", "portrait"]);
const MEDIA_TONES = new Set(["soft", "mono"]);

function readDirective(src) {
  const hash = src.indexOf("#");
  if (hash === -1) return { src, scale: null, tone: null };

  const tokens = src.slice(hash + 1).split("+").filter(Boolean);
  // Only claim the hash if every token is one we understand — otherwise it's
  // someone's fragment identifier and the URL is left exactly as written.
  if (!tokens.every((t) => MEDIA_SCALES.has(t) || MEDIA_TONES.has(t))) {
    return { src, scale: null, tone: null };
  }

  return {
    src: src.slice(0, hash),
    scale: tokens.find((t) => MEDIA_SCALES.has(t)) ?? null,
    tone: tokens.filter((t) => MEDIA_TONES.has(t)).join(" ") || null,
  };
}

// The media mark reuses the long divider squiggle, stretched under the image so
// the photo reads as resting on a drawn line rather than floating in a box.
const MARK_PATH = SQUIGGLE_PATH;
const MARK_VIEWBOX = SQUIGGLE_VIEWBOX;

/**
 * Markdown wraps a lone image in its own paragraph. Promoting it to a <figure>
 * gives the layout a hook for the media column (see Prose.module.css) and
 * somewhere honest to hang a caption. Deliberately conservative: a paragraph
 * holding anything besides the image is left alone, so no existing post gets
 * restructured by accident.
 *
 * Each figure carries its intrinsic width and a scale, and closes with the
 * site's small hand-drawn mark — the one signature the media system gets.
 *
 * Captions come only from markdown's title syntax — ![alt](src "caption") — so
 * nothing in content/ gains a caption it didn't already ask for.
 */
function rehypeFigures() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent || index == null) return;
      const img = onlyElement(node);
      if (!img || img.tagName !== "img") return;

      const { src, scale: override, tone } = readDirective(String(img.properties?.src ?? ""));
      img.properties.src = src;
      const size = src.startsWith("/") ? intrinsicSize(src) : null;
      const scale = override ?? mediaScale(size);

      // Ambient media has no frame, no mark and no caption of its own — it is
      // a layer the surrounding prose reads on top of.
      if (scale === "ambient") {
        parent.children[index] = {
          type: "element",
          tagName: "figure",
          properties: { className: ["media"], "data-media": "ambient", ...(tone && { "data-tone": tone }) },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { className: ["ambient"] },
              children: [img],
            },
          ],
        };
        return;
      }

      const children = [
        img,
        {
          type: "element",
          tagName: "svg",
          properties: {
            className: ["media-mark"],
            viewBox: MARK_VIEWBOX,
            preserveAspectRatio: "none",
            "aria-hidden": "true",
          },
          children: [{ type: "element", tagName: "path", properties: { d: MARK_PATH }, children: [] }],
        },
      ];

      const caption = img.properties?.title;
      if (typeof caption === "string" && caption.trim() !== "") {
        delete img.properties.title;
        children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: caption }],
        });
      }

      const properties = { className: ["media"], "data-media": scale, ...(tone && { "data-tone": tone }) };
      // lets the CSS hold an image to its own width without ever scaling it up
      if (size) properties.style = `--iw:${size.width}`;

      parent.children[index] = { type: "element", tagName: "figure", properties, children };
    });
  };
}

/** Reads just enough of a file to cover its header, without slurping an 8MB JPEG. */
function readHead(file, bytes = 131072) {
  const fd = fs.openSync(file, "r");
  try {
    const buf = Buffer.alloc(bytes);
    return buf.subarray(0, fs.readSync(fd, buf, 0, bytes, 0));
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Intrinsic size from a PNG / GIF / WebP / JPEG header, or null if unrecognised.
 * Hand-rolled rather than pulled from a package for the same reason the other
 * plugins here are: it's a few dozen lines against a handful of byte offsets,
 * and every asset in public/ reports EXIF orientation 1 (or none), so there's
 * no rotation case to get wrong.
 */
function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }; // PNG IHDR
  }
  if (buf.length > 10 && buf.toString("latin1", 0, 4) === "GIF8") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }; // GIF logical screen
  }
  if (buf.length > 30 && buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP") {
    const fmt = buf.toString("latin1", 12, 16);
    if (fmt === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (fmt === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (fmt === "VP8X") {
      return { width: (buf.readUIntLE(24, 3) & 0xffffff) + 1, height: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
    }
  }
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0-SOF15, minus DHT / JPG / DAC, which aren't frame headers
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const sizeCache = new Map();

function intrinsicSize(src) {
  if (!sizeCache.has(src)) {
    let size = null;
    try {
      size = imageSize(readHead(path.join(PUBLIC_DIR, src.slice(1).split("?")[0])));
    } catch {
      size = null;
    }
    if (!size) console.warn(`[markdown] no intrinsic size for ${src} — expect layout shift`);
    sizeCache.set(src, size);
  }
  return sizeCache.get(src);
}

/**
 * Stamps intrinsic width/height on every body image so the browser reserves the
 * box before the bytes land — these files run to 8MB, so the shift used to last
 * seconds on a cold cache. The first image is loaded eagerly: two posts open
 * with one, and lazy-loading the LCP element only delays it.
 */
function rehypeImageAttrs() {
  return (tree) => {
    let first = true;
    visit(tree, "element", (node) => {
      if (node.tagName !== "img") return;

      node.properties.decoding = "async";
      node.properties.loading = first ? "eager" : "lazy";
      first = false;

      const src = String(node.properties.src ?? "");
      if (!src.startsWith("/")) return;

      const size = intrinsicSize(src);
      if (size) {
        node.properties.width = size.width;
        node.properties.height = size.height;
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  // Dual themes emit both colours as --shiki-light / --shiki-dark custom
  // properties per token, so Prose.module.css can pick one per colour scheme.
  // The old single-theme setup needed a `filter: invert()` on the whole block
  // in dark mode, which also inverted the border, background and anything else
  // that happened to be inside it.
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: false,
  })
  .use(rehypeFigures)
  .use(rehypeDivider)
  .use(rehypeImageAttrs)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function renderMarkdown(markdown) {
  const file = await processor.process(markdown);
  return file.toString();
}
