import type { BlogEntry, GarageEntry } from "./types";

// Read full entries only in development and during prerendering. Production
// navigation uses SSG's per-route data files instead of bundled article HTML.
const blogFiles = import.meta.glob<BlogEntry>("/generated/blog/*.json", { import: "default" });
const garageFiles = import.meta.glob<GarageEntry>("/generated/garage/*.json", { import: "default" });

export async function loadBlogEntry(slug: string | undefined): Promise<BlogEntry | null> {
  const load = blogFiles[`/generated/blog/${slug}.json`];
  return load ? load() : null;
}

export async function loadGarageEntry(slug: string | undefined): Promise<GarageEntry | null> {
  const load = garageFiles[`/generated/garage/${slug}.json`];
  return load ? load() : null;
}
