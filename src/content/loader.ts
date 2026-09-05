import type { BlogEntry, GarageEntry } from "./types";

// Reads the JSON produced by scripts/build-content.mjs (run before `vite`/
// `vite-react-ssg build` — see package.json). Deliberately dumb: no
// frontmatter parsing or markdown rendering here, so none of that tooling
// ends up in the client bundle.
const blogFiles = import.meta.glob("/generated/blog/*.json", { import: "default", eager: true }) as Record<
  string,
  BlogEntry
>;
const garageFiles = import.meta.glob("/generated/garage/*.json", {
  import: "default",
  eager: true,
}) as Record<string, GarageEntry>;

function byDateDesc<T extends { meta: { date: string } }>(a: T, b: T): number {
  return a.meta.date < b.meta.date ? 1 : -1;
}

export const blogEntries: BlogEntry[] = Object.values(blogFiles).sort(byDateDesc);
export const garageEntries: GarageEntry[] = Object.values(garageFiles).sort(byDateDesc);

export function findBySlug<T extends { slug: string }>(
  entries: T[],
  slug: string | undefined,
): T | undefined {
  return entries.find((e) => e.slug === slug);
}

export interface TaggedEntry {
  type: "blog" | "garage";
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

export function allTaggedEntries(): TaggedEntry[] {
  return [
    ...blogEntries.map((e) => ({
      type: "blog" as const,
      slug: e.slug,
      title: e.meta.title,
      date: e.meta.date,
      tags: e.meta.tags,
    })),
    ...garageEntries.map((e) => ({
      type: "garage" as const,
      slug: e.slug,
      title: e.meta.title,
      date: e.meta.date,
      tags: e.meta.tags,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function allTags(): string[] {
  const tags = new Set<string>();
  for (const entry of allTaggedEntries()) {
    for (const tag of entry.tags) tags.add(tag);
  }
  return [...tags].sort();
}

/**
 * The posts either side of `slug` in reading order. blogEntries is sorted
 * date-descending, so the entry before it in the array is the newer one.
 */
export function adjacentBlog(slug: string | undefined): { newer?: BlogEntry; older?: BlogEntry } {
  const i = blogEntries.findIndex((e) => e.slug === slug);
  if (i === -1) return {};
  return { newer: blogEntries[i - 1], older: blogEntries[i + 1] };
}
