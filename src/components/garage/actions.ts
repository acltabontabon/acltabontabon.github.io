import type { GarageSummary } from "@/content/types";

export type SourceProvider = "github" | "gitlab" | "generic";

export interface PrimaryAction {
  href: string;
  label: string;
  external: boolean;
}

export interface SourceAction {
  href: string;
  provider: SourceProvider;
  /** What the link says — the host's name reads cleaner here than its logo. */
  name: string;
  /** Fuller phrasing for screen readers, since "GitHub" alone is ambiguous
   *  in a list of links across several projects. Contains the visible text. */
  label: string;
}

const providerName: Record<SourceProvider, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  generic: "Source",
};

/** Derived from the URL so a project never has to declare its own icon. */
function providerOf(url: string): SourceProvider {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "github.com") return "github";
    if (host === "gitlab.com") return "gitlab";
  } catch {
    // a malformed URL just falls through to the generic mark
  }
  return "generic";
}

/**
 * Where a cover's two actions point. The primary is whatever the best
 * destination for this entry is — a live product, else its story, else the
 * repository — and the source link is only offered when it isn't already
 * where the primary action goes.
 */
export function actionsFor(entry: GarageSummary): {
  primary: PrimaryAction | undefined;
  source: SourceAction | undefined;
} {
  const { meta, slug, hasBody } = entry;
  const sourceHref = meta.sourceUrl ?? meta.github;

  let primary: PrimaryAction | undefined;
  if (meta.liveUrl) {
    primary = { href: meta.liveUrl, label: meta.actionLabel ?? "Visit project", external: true };
  } else if (hasBody) {
    primary = { href: `/garage/${slug}`, label: meta.actionLabel ?? "Read more", external: false };
  } else if (sourceHref) {
    const provider = providerOf(sourceHref);
    primary = {
      href: sourceHref,
      label: meta.actionLabel ?? (provider === "generic" ? "View source" : `View on ${providerName[provider]}`),
      external: true,
    };
  }

  let source: SourceAction | undefined;
  if (sourceHref && sourceHref !== primary?.href) {
    const provider = providerOf(sourceHref);
    const name = providerName[provider];
    source = { href: sourceHref, provider, name, label: `${meta.title} on ${name}` };
  }

  return { primary, source };
}
