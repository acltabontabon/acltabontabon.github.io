import type { CSSProperties, ReactNode } from "react";
import Seo from "@/components/Seo";
import MuniMark from "@/components/muni/Mark";
import Demo from "@/components/muni/Demo";
import styles from "./Muni.module.css";

/**
 * /muni — the product page for Muni, a sprint-retrospective tool.
 *
 * Screenshots
 * -----------
 * The three figures below point at PNGs that are not in the repo yet. Drop
 * them into public/images/muni/ with these names and sizes:
 *
 *   public/images/muni/capture.png   375 × 812   (the /capture page, on a phone)
 *   public/images/muni/discover.png  1440 × 900  (themes and private votes)
 *   public/images/muni/discuss.png   1440 × 900  (one theme at a time)
 *
 * Until they exist, each figure renders as a box of the right proportions
 * with a quiet placeholder background and its caption — nothing breaks, and
 * the layout doesn't shift when the files land.
 *
 * Links
 * -----
 * `MUNI` below holds the app, source and docs URLs. All three are empty
 * while Muni is being prepared for its pilot: the primary action renders as
 * an accessible "coming soon" button, and the source/docs links are simply
 * not rendered. Set a URL and the real link appears.
 */
const MUNI = { appUrl: "", sourceUrl: "", docsUrl: "" };

const TAGLINE = "Good retros start before the meeting.";
const DESCRIPTION = "Capture thoughts throughout the sprint. Reflect together. Turn insights into action.";
const STATUS = "Early pilot — being prepared for a small public pilot on Cloudflare's free tier. Not yet open.";

const ANONYMITY =
  "Your identity is verified to access this sprint. Your entries and votes are shown without your identity to " +
  "teammates and facilitators. The service operator may technically be able to associate activity with " +
  "accounts. Your wording can still reveal who you are.";

const SHOTS = [
  {
    src: "/images/muni/capture.png",
    width: 375,
    height: 812,
    caption: "Capture",
    alt: "The Muni capture page on a phone: a text field, five category chips and a save button.",
  },
  {
    src: "/images/muni/discover.png",
    width: 1440,
    height: 900,
    caption: "Discover",
    alt: "Muni's discover stage: the sprint's entries grouped into themes, with private votes.",
  },
  {
    src: "/images/muni/discuss.png",
    width: 1440,
    height: 900,
    caption: "Discuss",
    alt: "Muni's discuss stage: one theme at a time, with its source observations and written context.",
  },
];

/** The name lockup: the mark beside the wordmark. */
function Lockup({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <span className={`${styles.lockup} ${className}`}>
      <MuniMark className={styles.mark} size={size} />
      <span className={styles.wordmark}>muni</span>
    </span>
  );
}

/** The primary action: a real link once there's somewhere to go; until then,
 *  a button that says so — focusable and announced, just not actionable. */
function OpenMuni() {
  if (MUNI.appUrl) {
    return (
      <a className={styles.cta} href={MUNI.appUrl}>
        Open Muni <span aria-hidden="true">→</span>
      </a>
    );
  }
  return (
    <button type="button" className={`${styles.cta} ${styles.ctaSoon}`} aria-disabled="true">
      Open Muni — coming soon
    </button>
  );
}

function Actions() {
  return (
    <div className={styles.actions}>
      <OpenMuni />
      {MUNI.sourceUrl && (
        <a className={styles.quietLink} href={MUNI.sourceUrl} target="_blank" rel="noreferrer">
          Source <span aria-hidden="true">↗</span>
        </a>
      )}
      {MUNI.docsUrl && (
        <a className={styles.quietLink} href={MUNI.docsUrl} target="_blank" rel="noreferrer">
          Docs <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}

function Moment({
  number,
  title,
  art,
  children,
}: {
  number: string;
  title: string;
  art: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className={styles.moment} aria-labelledby={`moment-${number}`}>
      <div className={styles.momentText}>
        <p className={styles.eyebrow}>{number}</p>
        <h3 id={`moment-${number}`} className={styles.momentTitle}>
          {title}
        </h3>
        <div className={styles.momentBody}>{children}</div>
      </div>
      <div className={styles.momentArt} aria-hidden="true">
        {art}
      </div>
    </article>
  );
}

/* Three small line drawings, one per moment, in the text colour with the
   accent for the one thing that matters in each. Decorative. */

function CaptureArt() {
  return (
    <svg viewBox="0 0 240 180" className={styles.art}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="32" y="24" width="176" height="132" rx="12" />
        <path d="M52 56h96M52 74h120M52 92h64" opacity="0.6" />
        <rect x="52" y="112" width="34" height="18" rx="9" />
        <rect x="92" y="112" width="30" height="18" rx="9" />
        <rect x="128" y="112" width="42" height="18" rx="9" />
        <path d="M176 36a6 6 0 0 1 12 0v6h-12z" opacity="0.6" />
        <rect x="173" y="42" width="18" height="12" rx="2" opacity="0.6" />
      </g>
      <rect x="128" y="112" width="42" height="18" rx="9" fill="var(--muni-accent-soft)" stroke="var(--muni-accent)" strokeWidth="1.5" />
      <circle cx="120" cy="92" r="3" fill="var(--muni-accent)" />
    </svg>
  );
}

function ReflectArt() {
  return (
    <svg viewBox="0 0 240 180" className={styles.art}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="24" y="28" width="88" height="56" rx="8" />
        <rect x="128" y="28" width="88" height="56" rx="8" />
        <rect x="24" y="100" width="88" height="56" rx="8" />
        <rect x="128" y="100" width="88" height="56" rx="8" />
        <path d="M38 46h44M38 58h56M38 70h32" opacity="0.5" />
        <path d="M142 46h52M142 58h36M142 70h48" opacity="0.5" />
        <path d="M38 118h40M38 130h58M38 142h28" opacity="0.5" />
        <path d="M142 118h44M142 130h56M142 142h36" opacity="0.5" />
      </g>
      <g fill="var(--muni-accent)">
        <circle cx="98" cy="42" r="3" />
        <circle cx="202" cy="42" r="3" />
        <circle cx="194" cy="42" r="3" />
        <circle cx="98" cy="114" r="3" />
        <circle cx="90" cy="114" r="3" />
        <circle cx="82" cy="114" r="3" />
      </g>
    </svg>
  );
}

function DecideArt() {
  return (
    <svg viewBox="0 0 240 180" className={styles.art}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="32" y="32" width="176" height="116" rx="12" />
        <path d="M56 62h88" />
        <path d="M56 84h64M56 102h96" opacity="0.5" />
        <circle cx="180" cy="62" r="10" opacity="0.6" />
        <path d="M174 84h12M172 102h16" opacity="0.5" />
        <path d="M56 124h40" opacity="0.5" />
      </g>
      <circle cx="180" cy="62" r="10" fill="var(--muni-accent-soft)" stroke="var(--muni-accent)" strokeWidth="1.5" />
      <path d="M175 62l3.5 3.5L186 58" fill="none" stroke="var(--muni-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="150" y="118" width="40" height="12" rx="6" fill="none" stroke="var(--muni-accent)" strokeWidth="1.5" />
    </svg>
  );
}

export default function Muni() {
  return (
    <>
      <Seo title={`Muni — ${TAGLINE}`} description={DESCRIPTION} path="/muni" />
      <div className={styles.page}>
        {/* ---- hero */}
        <header className={styles.hero}>
          <div className={styles.heroMain}>
            <Lockup size={44} />
            <p className={styles.eyebrow}>Sprint retrospectives · Early pilot</p>
            <h1 className={styles.tagline}>{TAGLINE}</h1>
            <p className={styles.support}>A moment to reflect. A chance to improve.</p>
          </div>
          <div className={styles.heroSide}>
            <p className={styles.description}>{DESCRIPTION}</p>
            <Actions />
            <p className={styles.status}>{STATUS}</p>
          </div>
        </header>

        {/* ---- screenshots */}
        <section className={styles.shots} aria-label="Screenshots">
          {SHOTS.map((s, i) => (
            <figure
              key={s.src}
              className={styles.shot}
              style={{ "--ar": `${s.width} / ${s.height}` } as CSSProperties}
            >
              <div className={styles.shotBox}>
                <img
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.dataset.missing = "";
                  }}
                />
              </div>
              <figcaption className={styles.caption}>
                <span>Fig. {String(i + 1).padStart(2, "0")}</span> {s.caption}
              </figcaption>
            </figure>
          ))}
        </section>

        {/* ---- three moments */}
        <section className={styles.moments} aria-labelledby="moments">
          <h2 id="moments" className={styles.sectionTitle}>
            Three moments
          </h2>
          <Moment number="01" title="Capture something before you forget." art={<CaptureArt />}>
            <p>
              During the sprint, open Muni — the <code>/capture</code> page is made to be bookmarked — write the
              thought down in a few seconds, tag it <em>Proud of</em>, <em>Keep</em>, <em>Improve</em>,{" "}
              <em>Stop</em> or <em>Try</em> if you like, and save. It stays private to you until the facilitator
              closes collection.
            </p>
          </Moment>
          <Moment number="02" title="Reflect together in a focused, engaging retro." art={<ReflectArt />}>
            <p>
              When collection closes, everyone&apos;s entries are revealed at once, as one anonymous batch, and the
              facilitator groups them into themes — by hand, or from an optional AI draft the facilitator edits.
              The meeting then runs through six plain stages: arrive, remember (last time we said…), discover
              (themes and private votes), discuss (one theme at a time, with the source observations readable by
              everyone, a gentle invitation to speak that you can always pass, and anonymous written context),
              decide, leave.
            </p>
          </Moment>
          <Moment number="03" title="Leave with a small change to try." art={<DecideArt />}>
            <p>
              The retro ends with one to three experiments, each with a named owner who accepts it explicitly, a
              success signal and a review date. They come back first at the next retro — where &ldquo;didn&apos;t
              help&rdquo;, &ldquo;inconclusive&rdquo; and &ldquo;not tried yet&rdquo; are all valid outcomes.
            </p>
          </Moment>
        </section>

        {/* ---- demo */}
        <section className={styles.demoSection} aria-labelledby="demo">
          <div className={styles.demoHead}>
            <h2 id="demo" className={styles.sectionTitle}>
              Try the first two moments
            </h2>
            <p className={styles.demoLabel}>Interactive demo · fictional data · nothing is sent anywhere</p>
          </div>
          <Demo />
        </section>

        {/* ---- details */}
        <section className={styles.details} aria-labelledby="details">
          <h2 id="details" className="visually-hidden">
            Details
          </h2>

          <div className={styles.detail}>
            <h3 className={styles.detailTitle}>Who it&apos;s for</h3>
            <p>Software teams of roughly 3–20 people who run sprint retrospectives.</p>
          </div>

          <div className={styles.detail}>
            <h3 className={styles.detailTitle}>Anonymity, exactly as Muni promises it</h3>
            <blockquote className={styles.promise}>
              <p>{ANONYMITY}</p>
            </blockquote>
            <p>
              This is application-level anonymity, not cryptography: small teams and distinctive prose can still
              identify an author.
            </p>
          </div>

          <div className={styles.detail}>
            <h3 className={styles.detailTitle}>AI is optional</h3>
            <p>
              Everything works without it. When a team turns AI on for a sprint — before collection starts — only
              the entry text and opaque ids go to the provider, to draft themes the facilitator edits.
            </p>
          </div>

          <div className={styles.detail}>
            <h3 className={styles.detailTitle}>Why &ldquo;Muni&rdquo;</h3>
            <p>
              Muni takes its name from the Filipino <em lang="fil">muni-muni</em>: to reflect, to turn something
              over in your mind.
            </p>
          </div>
        </section>

        {/* ---- closing */}
        <footer className={styles.closing}>
          <Lockup size={32} className={styles.closingLockup} />
          <p className={styles.closingLine}>{TAGLINE}</p>
          <Actions />
          <p className={styles.status}>{STATUS}</p>
        </footer>
      </div>
    </>
  );
}
