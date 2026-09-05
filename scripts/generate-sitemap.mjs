import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entriesOfType, garageDetailSlugs, allTags } from "./content.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_URL = "https://acltabontabon.com";

const staticRoutes = ["/", "/blog", "/garage", "/about", "/tags"];

const routes = [
  ...staticRoutes,
  ...entriesOfType("blog").map((e) => `/blog/${e.slug}`),
  ...garageDetailSlugs().map((s) => `/garage/${s}`),
  ...allTags().map((t) => `/tags/${encodeURIComponent(t)}`),
];

const urlsXml = routes
  .map((route) => {
    const path = route === "/" ? "/" : `${route}/`;
    return `  <url><loc>${SITE_URL}${path}</loc></url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "dist", "sitemap.xml"), sitemap);
console.log(`Generated sitemap.xml with ${routes.length} routes`);
