// Plain-JS mirror of the content shape, used only by the Node prebuild
// script (scripts/build-content.mjs). Kept separate from src/ so the app
// bundle never has a reason to import zod — see that script for why.
import { z } from "zod";

// YAML auto-parses an unquoted `date: 2025-05-13` into a JS Date, so accept
// both that and a plain string, and normalize to "YYYY-MM-DD" either way.
const isoDate = z
  .union([z.string(), z.date()])
  .transform((value) => (typeof value === "string" ? value : value.toISOString().slice(0, 10)))
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), "date must be YYYY-MM-DD");

export const blogFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  date: isoDate,
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  image: z.string().optional(),
});

export const garageStatus = z.enum(["stable", "alpha", "wip", "archived"]);

export const garageFrontmatter = z.object({
  title: z.string(),
  description: z.string(),
  status: garageStatus,
  date: isoDate,
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  github: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  // Overrides the label on a cover's primary action ("Explore", "Read more",
  // "Source" are derived from what the entry has, but a project can say it
  // better itself).
  actionLabel: z.string().optional(),
  // Generic repository link. `github` stays the shorthand most entries use;
  // this exists so a project hosted anywhere else doesn't need new markup —
  // the provider (and so the icon) is resolved from the URL.
  sourceUrl: z.string().url().optional(),
  screenshot: z.string().optional(),
  // The 4-10 word positioning line that carries the cover. Falls back to
  // `description` if absent, but every featured project should set one.
  hook: z.string().optional(),
  // Current release, shown as the catalogue's release slug. Plain string so
  // it can carry a prerelease suffix ("0.1.0-alpha.23").
  version: z.string().optional(),
  // Display-cased tech list for the cover footer ("Java", "Spring Boot").
  // Distinct from `tags`, which are lowercase slugs feeding /tags/:tag.
  tech: z.array(z.string()).default([]),
  // A project may bring its own restrained secondary accent (the site's
  // purple is the fallback). Two values so a dark-on-light brand colour can
  // be swapped for a legible one under prefers-color-scheme: dark.
  accent: z.string().optional(),
  accentDark: z.string().optional(),
  // Which bespoke cover artwork to render, keyed into the registry in
  // src/components/garage/covers. Unknown/absent falls back to a generic
  // composition built from the screenshot.
  art: z.string().optional(),
});

export const schemaFor = {
  blog: blogFrontmatter,
  garage: garageFrontmatter,
};
