// Node-only helper for reading the already-validated JSON that
// build-content.mjs writes to generated/. Used by the postbuild scripts
// (RSS/sitemap generation) — run `npm run content` first if generated/
// doesn't exist yet (the `build` script always does).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const GENERATED_DIR = path.join(ROOT, "generated");

export const CONTENT_TYPES = ["blog", "garage"];

function readDir(type) {
  const dir = path.join(GENERATED_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")))
    .map((entry) => ({ type, slug: entry.slug, data: entry.meta, content: entry.html }));
}

export function allEntries() {
  return CONTENT_TYPES.flatMap(readDir);
}

export function entriesOfType(type) {
  return readDir(type);
}

/** Garage entries only get a detail route when they have a non-empty story. */
export function garageDetailSlugs() {
  return entriesOfType("garage")
    .filter((e) => e.content.length > 0)
    .map((e) => e.slug);
}

export function allTags() {
  const tags = new Set();
  for (const entry of allEntries()) {
    for (const tag of entry.data.tags ?? []) tags.add(tag);
  }
  return [...tags].sort();
}
