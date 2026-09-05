// Prebuild step: reads content/{blog,garage}/*.md, validates
// frontmatter, and renders each body to HTML once — writing the result as
// plain JSON under generated/. The app (src/content/loader.ts) only ever
// reads that JSON, so none of gray-matter/zod/unified/remark/rehype/shiki
// end up in the client bundle. Run before `vite-react-ssg build` (and
// before `vite` in dev) — see package.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { schemaFor } from "./schema.mjs";
import { renderMarkdown } from "./markdown.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "generated");

function readingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 360) return "1 min read";
  return `${Math.floor(words / 180)} min read`;
}

async function buildType(type) {
  const schema = schemaFor[type];
  const dir = path.join(CONTENT_DIR, type);
  const outDir = path.join(OUT_DIR, type);
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
  let count = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Invalid frontmatter in content/${type}/${file}: ${result.error.message}`);
    }
    const meta = result.data;
    if (meta.draft) continue;

    const html = content.trim() ? await renderMarkdown(content) : "";
    const entry = { slug, meta, html, readingTime: readingTime(content) };
    fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(entry));
    count++;
  }

  console.log(`Built ${count} ${type} entries`);
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
for (const type of Object.keys(schemaFor)) {
  await buildType(type);
}
