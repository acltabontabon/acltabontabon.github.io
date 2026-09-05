// Hand-rolled RSS 2.0 feed for Blog. Small, fixed output — not worth a
// dependency for a handful of items.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entriesOfType } from "./content.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_URL = "https://acltabontabon.com";
const SITE_NAME = "Alvin Cris Tabontabon";
const SITE_DESCRIPTION = "The home of the stuff Cris builds — projects and the occasional long-form ramble.";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toUTCString();
}

const items = entriesOfType("blog")
  .map((e) => ({ ...e, section: "blog" }))
  .sort((a, b) => (a.data.date < b.data.date ? 1 : -1));

const itemsXml = items
  .map((entry) => {
    const url = `${SITE_URL}/${entry.section}/${entry.slug}/`;
    return `  <item>
    <title>${escapeXml(entry.data.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${toRfc822(entry.data.date)}</pubDate>
    <description>${escapeXml(entry.data.description ?? "")}</description>
  </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_NAME)}</title>
  <link>${SITE_URL}/</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
${itemsXml}
</channel>
</rss>
`;

fs.writeFileSync(path.join(ROOT, "dist", "feed.xml"), rss);
console.log(`Generated feed.xml with ${items.length} items`);
