// Keeps garage versions in step with each project's GitHub releases, so a new
// release shows up on the site without editing its markdown.
//
// Rules, chosen from what the repos actually publish:
//   - opt-in: only entries that already declare a `version` are refreshed
//   - only real version tags count ("1.2.3" / "v1.2.3", prereleases included),
//     so side channels like "extension-v0.1.6" or "updater-channels" are ignored
//   - drafts never count; only published releases do
//   - never a downgrade: the site shows the newer of the frontmatter version
//     and the latest release, so a version set by hand ahead of its release
//     (a project mid-way to its next tag) stays until a newer release lands
//   - offline-safe: any failure leaves the frontmatter version in place
//
// When it updates: every build, and the deploy workflow also runs daily. For
// an immediate update, a project repo can trigger the site's rebuild when it
// publishes a release — add a step to its release workflow like:
//
//   - run: gh api repos/acltabontabon/acltabontabon.github.io/dispatches -f event_type=project-released
//     env:
//       GH_TOKEN: ${{ secrets.SITE_DISPATCH_TOKEN }}
//
// where SITE_DISPATCH_TOKEN is a fine-grained token with Contents: read & write
// on this repo only (a repo's built-in token can't trigger another repo).
//
// In CI the workflow passes GITHUB_TOKEN for a higher rate limit; locally the
// unauthenticated limit (60/hour) is plenty for a handful of repos. Set
// GARAGE_RELEASES=off to skip the lookup entirely (e.g. working offline).

const VERSION_TAG = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

/** "v1.9.4" → { core: [1, 9, 4], pre: [], text: "1.9.4" }; null if not a version. */
export function parseVersion(tag) {
  const m = VERSION_TAG.exec(String(tag).trim());
  if (!m) return null;
  return {
    core: [Number(m[1]), Number(m[2]), Number(m[3])],
    pre: m[4] ? m[4].split(".") : [],
    text: String(tag).trim().replace(/^v/, ""),
  };
}

/** Semver precedence: core first; a prerelease sorts below its release. */
export function compareVersions(a, b) {
  for (let i = 0; i < 3; i++) if (a.core[i] !== b.core[i]) return a.core[i] - b.core[i];
  if (!a.pre.length || !b.pre.length) return b.pre.length - a.pre.length;
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i++) {
    const x = a.pre[i];
    const y = b.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const nx = /^\d+$/.test(x);
    const ny = /^\d+$/.test(y);
    if (nx && ny && Number(x) !== Number(y)) return Number(x) - Number(y);
    if (nx !== ny) return nx ? -1 : 1;
    const c = x.toLowerCase().localeCompare(y.toLowerCase());
    if (c) return c;
  }
  return 0;
}

function repoOf(url) {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/.exec(url ?? "");
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : null;
}

/** The highest published version-tagged release of a repo, or null. */
async function latestRelease(repo) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "acltabontabon.com build" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=50`, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const releases = await res.json();
  return releases
    .filter((r) => !r.draft)
    .map((r) => parseVersion(r.tag_name))
    .filter(Boolean)
    .sort(compareVersions)
    .at(-1) ?? null;
}

const cache = new Map();

/**
 * Returns the version the site should show for a garage entry: its
 * frontmatter version, raised to the latest GitHub release when that's newer.
 */
export async function resolveVersion(meta) {
  if (!meta.version || process.env.GARAGE_RELEASES === "off") return meta.version;
  const repo = repoOf(meta.github);
  const current = parseVersion(meta.version);
  if (!repo || !current) return meta.version;

  try {
    if (!cache.has(repo)) cache.set(repo, latestRelease(repo));
    const latest = await cache.get(repo);
    if (latest && compareVersions(latest, current) > 0) {
      console.log(`[releases] ${meta.title}: ${meta.version} → ${latest.text} (from ${repo})`);
      return latest.text;
    }
  } catch (err) {
    console.warn(`[releases] ${meta.title}: kept ${meta.version} — couldn't reach ${repo} (${err.message})`);
  }
  return meta.version;
}
