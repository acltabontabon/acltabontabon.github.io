// GitHub Pages looks for a literal /404.html at the site root. Our SSG build
// (dirStyle: "nested") emits it as dist/404/index.html like any other route,
// so copy it up and drop the now-redundant folder.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(ROOT, "dist", "404", "index.html");
const dest = path.join(ROOT, "dist", "404.html");

if (!fs.existsSync(src)) {
  throw new Error(`Expected ${src} to exist after build — check the "404" route in src/routes.tsx`);
}

fs.copyFileSync(src, dest);
fs.rmSync(path.join(ROOT, "dist", "404"), { recursive: true, force: true });
console.log("Wrote dist/404.html");
