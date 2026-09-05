export type GarageStatus = "stable" | "alpha" | "wip" | "archived";

export interface BlogMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  image?: string;
}

export interface GarageMeta {
  title: string;
  description: string;
  status: GarageStatus;
  date: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  github?: string;
  liveUrl?: string;
  actionLabel?: string;
  sourceUrl?: string;
  screenshot?: string;
  hook?: string;
  version?: string;
  tech: string[];
  accent?: string;
  accentDark?: string;
  art?: string;
}

export interface Entry<Meta> {
  slug: string;
  meta: Meta;
  /** Pre-rendered HTML of the markdown body, empty string if the post has no body. */
  html: string;
  readingTime: string;
}

export type BlogEntry = Entry<BlogMeta>;
export type GarageEntry = Entry<GarageMeta>;
