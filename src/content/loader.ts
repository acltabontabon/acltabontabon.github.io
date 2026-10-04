import blogIndex from "../../generated/blog-index.json";
import garageIndex from "../../generated/garage-index.json";
import type { BlogSummary, GarageSummary } from "./types";

// Reads the JSON produced by scripts/build-content.mjs (run before `vite`/
// `vite-react-ssg build` — see package.json). Deliberately dumb: no
// frontmatter parsing or markdown rendering here, so none of that tooling
// ends up in the client bundle.
function byDateDesc<T extends { meta: { date: string } }>(a: T, b: T): number {
  return b.meta.date.localeCompare(a.meta.date);
}

export const blogEntries = (blogIndex as BlogSummary[]).sort(byDateDesc);
export const garageEntries = (garageIndex as GarageSummary[]).sort(byDateDesc);

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
  href: string;
  external: boolean;
}

export function allTaggedEntries(): TaggedEntry[] {
  return [
    ...blogEntries.map((e) => ({
      type: "blog" as const,
      slug: e.slug,
      title: e.meta.title,
      date: e.meta.date,
      tags: e.meta.tags,
      href: `/blog/${e.slug}`,
      external: false,
    })),
    ...garageEntries.map((e) => ({
      type: "garage" as const,
      slug: e.slug,
      title: e.meta.title,
      date: e.meta.date,
      tags: e.meta.tags,
      // A project without a write-up has no generated detail page.
      href: e.hasBody ? `/garage/${e.slug}` : (e.meta.liveUrl ?? e.meta.sourceUrl ?? e.meta.github ?? "/garage"),
      external: !e.hasBody && Boolean(e.meta.liveUrl ?? e.meta.sourceUrl ?? e.meta.github),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
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
export function adjacentBlog(slug: string | undefined): { newer?: BlogSummary; older?: BlogSummary } {
  const i = blogEntries.findIndex((e) => e.slug === slug);
  if (i === -1) return {};
  return { newer: blogEntries[i - 1], older: blogEntries[i + 1] };
}
