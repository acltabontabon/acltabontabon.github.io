import { useId, useState, type CSSProperties, type FormEvent } from "react";
import styles from "./Demo.module.css";

/**
 * A small, self-contained walk through Muni's first two moments, with made-up
 * data. Everything lives in component state: nothing is sent anywhere,
 * nothing is stored, and a reload starts it over.
 *
 *   1. capture  — write a thought, tag it, save it to "My thoughts"
 *   2. discover — collection closes; a fictional batch is revealed, already
 *                 grouped into themes; the viewer spends three private votes
 *   3. results  — voting closes and the totals are revealed
 */

const CATEGORIES = ["Proud of", "Keep", "Improve", "Stop", "Try"] as const;
type Category = (typeof CATEGORIES)[number];

interface Entry {
  text: string;
  category?: Category;
}

interface Theme {
  id: string;
  title: string;
  entries: Entry[];
  /** votes from the fictional teammates, revealed when voting closes */
  teammates: number;
}

type Phase = "capture" | "discover" | "results";

const VOTES_PER_VIEWER = 3;
const TEAMMATES = 5;

const THEMES: Theme[] = [
  {
    id: "pr",
    title: "PR review turnaround",
    teammates: 5,
    entries: [
      { text: "PRs sat for two days waiting on a first review more than once this sprint.", category: "Improve" },
      { text: "Splitting the billing refactor into three small PRs got it reviewed the same day.", category: "Keep" },
      { text: "Opening a PR on Friday afternoon and expecting it merged by Monday standup.", category: "Stop" },
    ],
  },
  {
    id: "goal",
    title: "Planning and sprint goal clarity",
    teammates: 3,
    entries: [
      { text: "Halfway through the sprint I couldn't have told you what the sprint goal was.", category: "Improve" },
      {
        text: "Two of the tickets we pulled in weren't ready — no acceptance criteria, one design still in flux.",
        category: "Improve",
      },
      { text: "Write the sprint goal at the top of the board and read it out at standup.", category: "Try" },
    ],
  },
  {
    id: "staging",
    title: "Staging environment ownership",
    teammates: 5,
    entries: [
      {
        text: "Staging was broken for a day and a half and nobody was sure whose job it was to fix it.",
        category: "Stop",
      },
      { text: "We shipped the export feature without a single run on staging, because staging was down." },
      { text: "A rotating staging owner for the sprint, with the name on the board.", category: "Try" },
    ],
  },
  {
    id: "tone",
    title: "Review comment tone",
    teammates: 2,
    entries: [
      {
        text: "How the team handled Tuesday's incident — calm, no blame, fixed in under an hour.",
        category: "Proud of",
      },
      { text: "Some review comments this sprint read as terse. A bare “why?” with no context doesn't help." },
      { text: "Prefixing comments with nit: / question: / blocking: made reviews easier to read.", category: "Keep" },
    ],
  },
];

const ENTRY_COUNT = THEMES.reduce((n, t) => n + t.entries.length, 0);
const TEAMMATE_VOTES = THEMES.reduce((n, t) => n + t.teammates, 0);

const STEPS: { phase: Phase; label: string }[] = [
  { phase: "capture", label: "Capture" },
  { phase: "discover", label: "Discover" },
  { phase: "results", label: "Results" },
];

export default function Demo() {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("capture");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [mine, setMine] = useState<Entry[]>([]);
  const [status, setStatus] = useState("");
  const [votes, setVotes] = useState<Record<string, number>>({});

  const used = Object.values(votes).reduce((n, v) => n + v, 0);
  const left = VOTES_PER_VIEWER - used;

  function save(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus("Write a thought first.");
      return;
    }
    setMine((m) => [...m, { text: trimmed, category: category ?? undefined }]);
    setText("");
    setCategory(null);
    setStatus("Saved for your retro.");
  }

  function vote(themeId: string, delta: 1 | -1) {
    setVotes((v) => {
      const current = v[themeId] ?? 0;
      const next = current + delta;
      if (next < 0 || (delta > 0 && left <= 0)) return v;
      return { ...v, [themeId]: next };
    });
  }

  function reset() {
    setPhase("capture");
    setText("");
    setCategory(null);
    setMine([]);
    setStatus("");
    setVotes({});
  }

  const stepIndex = STEPS.findIndex((s) => s.phase === phase);

  return (
    <div className={styles.demo}>
      <ol className={styles.steps} aria-label="Demo steps">
        {STEPS.map((s, i) => (
          <li
            key={s.phase}
            className={styles.step}
            aria-current={s.phase === phase ? "step" : undefined}
            data-done={i < stepIndex ? "" : undefined}
          >
            <span className={styles.stepNum}>{i + 1}</span> {s.label}
          </li>
        ))}
      </ol>

      {phase === "capture" && (
        <div className={styles.stage}>
          <form className={styles.composer} onSubmit={save} aria-labelledby={`${id}-capture`}>
            <h3 id={`${id}-capture`} className={styles.stageTitle}>
              Capture
            </h3>
            <p className={styles.stageNote}>Something from this sprint, before you forget it.</p>

            <label htmlFor={`${id}-text`} className="visually-hidden">
              Your thought
            </label>
            <textarea
              id={`${id}-text`}
              className={styles.field}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (status) setStatus("");
              }}
              rows={3}
              placeholder="e.g. The release checklist saved us on Thursday."
              autoComplete="off"
            />

            <div className={styles.chips} role="group" aria-label="Category (optional)">
              {CATEGORIES.map((c) => {
                const on = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    className={styles.chip}
                    aria-pressed={on}
                    onClick={() => setCategory(on ? null : c)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className={styles.row}>
              <button type="submit" className={styles.primary}>
                Save the thought
              </button>
              <p className={styles.status} role="status">
                {status}
              </p>
            </div>
          </form>

          <div className={styles.mineBox} aria-labelledby={`${id}-mine`}>
            <h3 id={`${id}-mine`} className={styles.stageTitle}>
              My thoughts
            </h3>
            {mine.length === 0 ? (
              <p className={styles.stageNote}>Nothing yet. Only you can see this list.</p>
            ) : (
              <ul className={styles.mine}>
                {mine.map((m, i) => (
                  <li key={i} className={styles.mineItem}>
                    {m.category && <span className={styles.tag}>{m.category}</span>}
                    <span>{m.text}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.stageNote}>
              Private until the facilitator closes collection. Then everyone's entries are revealed together, as
              one anonymous batch.
            </p>
            <button type="button" className={styles.secondary} onClick={() => setPhase("discover")}>
              Close collection <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {phase === "discover" && (
        <div className={styles.stage}>
          <div className={styles.stageHead}>
            <div>
              <h3 className={styles.stageTitle}>Discover</h3>
              <p className={styles.stageNote}>
                {ENTRY_COUNT} entries from {TEAMMATES} fictional teammates{mine.length > 0 && `, plus your ${mine.length}`},
                grouped into {THEMES.length} themes by the facilitator. Spend up to {VOTES_PER_VIEWER} votes; nobody
                sees them until voting closes.
              </p>
            </div>
            <p className={styles.votesLeft} role="status">
              <strong>{left}</strong> {left === 1 ? "vote" : "votes"} left
            </p>
          </div>

          <ul className={styles.themes}>
            {THEMES.map((t) => {
              const n = votes[t.id] ?? 0;
              return (
                <li key={t.id} className={styles.theme} data-voted={n > 0 ? "" : undefined}>
                  <h4 className={styles.themeTitle}>{t.title}</h4>
                  <ul className={styles.entries}>
                    {t.entries.map((e, i) => (
                      <li key={i} className={styles.entry}>
                        {e.category && <span className={styles.tag}>{e.category}</span>}
                        <span>{e.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.voteRow}>
                    <span className={styles.dots} aria-hidden="true">
                      {Array.from({ length: VOTES_PER_VIEWER }, (_, i) => (
                        <i key={i} data-on={i < n ? "" : undefined} />
                      ))}
                    </span>
                    <span className="visually-hidden">
                      {n} of your votes on {t.title}
                    </span>
                    <button
                      type="button"
                      className={styles.voteBtn}
                      onClick={() => vote(t.id, -1)}
                      disabled={n === 0}
                      aria-label={`Remove a vote from ${t.title}`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className={styles.voteBtn}
                      onClick={() => vote(t.id, 1)}
                      disabled={left === 0}
                      aria-label={`Vote for ${t.title}`}
                    >
                      Vote
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {mine.length > 0 && (
            <div className={styles.ungrouped}>
              <h4 className={styles.themeTitle}>Not yet grouped</h4>
              <p className={styles.stageNote}>
                Yours landed in the batch too, without your name on them. In Muni the facilitator would place them
                into a theme.
              </p>
              <ul className={styles.entries}>
                {mine.map((m, i) => (
                  <li key={i} className={styles.entry}>
                    {m.category && <span className={styles.tag}>{m.category}</span>}
                    <span>{m.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.row}>
            <button type="button" className={styles.primary} onClick={() => setPhase("results")}>
              Close voting
            </button>
            <button type="button" className={styles.secondary} onClick={() => setPhase("capture")}>
              <span aria-hidden="true">←</span> Back
            </button>
          </div>
        </div>
      )}

      {phase === "results" && (
        <div className={styles.stage}>
          <div className={styles.stageHead}>
            <div>
              <h3 className={styles.stageTitle}>Voting closed</h3>
              <p className={styles.stageNote}>
                Your {used} {used === 1 ? "vote" : "votes"} plus {TEAMMATE_VOTES} from {TEAMMATES} fictional
                teammates. Discussion starts at the top and takes one theme at a time.
              </p>
            </div>
          </div>

          <ol className={styles.results}>
            {[...THEMES]
              .map((t) => ({ ...t, total: t.teammates + (votes[t.id] ?? 0) }))
              .sort((a, b) => b.total - a.total)
              .map((t, i, all) => (
                <li key={t.id} className={styles.result}>
                  <span className={styles.resultNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.resultTitle}>{t.title}</span>
                  <span className={styles.resultCount}>
                    {t.total} {t.total === 1 ? "vote" : "votes"}
                    {(votes[t.id] ?? 0) > 0 && <span className={styles.yours}> · {votes[t.id]} yours</span>}
                  </span>
                  <span
                    className={styles.bar}
                    aria-hidden="true"
                    style={{ "--w": `${(t.total / all[0].total) * 100}%` } as CSSProperties}
                  />
                </li>
              ))}
          </ol>

          <div className={styles.row}>
            <button type="button" className={styles.secondary} onClick={reset}>
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
