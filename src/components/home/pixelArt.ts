/* Hand-drawn 1-bit title cards for the homepage display.
 *
 * A card is a bitmap-font title on the left and a small illustration on the
 * right, authored in logical pixels. Every card sits on the same scaffold so
 * the five read as one series:
 *
 *   margin │ title column (sized for the longest title) │ gap │ art column │ margin
 *
 * The title is left-aligned in its column; each illustration is measured and
 * centred in its column, and both are centred on the card's vertical middle.
 * The display picks one whole-number pixel size for every card at a given
 * viewport (from CARD_W×CARD_H, the scaffold's minimum footprint), so titles
 * and art never change scale from one project to the next. Versions live in
 * the figure caption, not here. Keyed by a garage entry's `art` value. */

const TITLE_SCALE = 2;
const LINE_GAP = 4;
/** The widest title the scaffold makes room for: nine characters at 2×. */
const TITLE_COL = 9 * 6 * TITLE_SCALE - TITLE_SCALE;
const GAP = 18;
const ART_COL = 58;
const MIN_MARGIN = 6;

export const CARD_W = MIN_MARGIN * 2 + TITLE_COL + GAP + ART_COL;
export const CARD_H = 46;

/** Cell values in a drawn card. */
export const INK = 1;
export const DOT = 2;
/** The idle dot grid's pitch, in logical pixels. */
const DOT_PITCH = 4;

// ---------------------------------------------------------------- bitmap font

const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "10001", "11001", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "-": ["00000", "00000", "00000", "01110", "00000", "00000", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

// -------------------------------------------------------------------- bitmap

class Bitmap {
  readonly w: number;
  readonly h: number;
  readonly data: Uint8Array;
  ox = 0;
  oy = 0;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w * h);
  }

  set(x: number, y: number, on = true) {
    x += this.ox;
    y += this.oy;
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.data[y * this.w + x] = on ? 1 : 0;
  }
  hline(x0: number, x1: number, y: number, dash = 0) {
    for (let x = x0; x <= x1; x++) if (!dash || Math.floor((x - x0) / dash) % 2 === 0) this.set(x, y);
  }
  vline(x: number, y0: number, y1: number, dash = 0) {
    for (let y = y0; y <= y1; y++) if (!dash || Math.floor((y - y0) / dash) % 2 === 0) this.set(x, y);
  }
  rect(x: number, y: number, w: number, h: number, dash = 0) {
    this.hline(x, x + w - 1, y, dash);
    this.hline(x, x + w - 1, y + h - 1, dash);
    this.vline(x, y, y + h - 1, dash);
    this.vline(x + w - 1, y, y + h - 1, dash);
  }
  fill(x: number, y: number, w: number, h: number) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j);
  }
  /** 50% checkerboard — 1-bit "grey", for shading */
  shade(x: number, y: number, w: number, h: number) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if ((x + i + y + j) % 2 === 0) this.set(x + i, y + j);
  }
  sprite(x: number, y: number, rows: string[]) {
    rows.forEach((row, j) => [...row].forEach((c, i) => c === "#" && this.set(x + i, y + j)));
  }
  text(x: number, y: number, s: string, scale = 1) {
    let cx = x;
    for (const ch of s.toUpperCase()) {
      const g = FONT[ch] ?? FONT[" "];
      g.forEach((row, j) =>
        [...row].forEach((c, i) => c === "1" && this.fill(cx + i * scale, y + j * scale, scale, scale)),
      );
      cx += 6 * scale;
    }
  }
  arrowRight(x0: number, x1: number, y: number) {
    this.hline(x0, x1 - 1, y);
    this.sprite(x1 - 2, y - 2, ["#..", "##.", "###", "##.", "#.."]);
  }
  arrowDown(x: number, y0: number, y1: number, dash = 0) {
    this.vline(x, y0, y1 - 1, dash);
    this.sprite(x - 2, y1 - 2, ["#####", ".###.", "..#.."]);
  }
}

// ------------------------------------------------------------- illustrations
// Each draws inside a 52×38 box, offset to the right half of the card.

const CURSOR = [
  "#......",
  "##.....",
  "###....",
  "####...",
  "#####..",
  "######.",
  "#######",
  "####...",
  "##.##..",
  "#...##.",
  "....##.",
];

const art: Record<string, (b: Bitmap) => void> = {
  // an architecture sketch mid-edit: service → queue → worker, service → db
  "draft-canvas": (b) => {
    b.rect(0, 2, 18, 10);
    b.hline(3, 12, 5);
    b.hline(3, 9, 8);

    b.rect(34, 2, 18, 10);
    for (const x of [38, 42, 46]) b.vline(x, 4, 9);

    b.arrowRight(18, 33, 7);
    b.arrowDown(9, 12, 23);
    b.arrowDown(43, 12, 25, 2);

    // database cylinder, body shaded
    b.hline(4, 14, 24);
    b.hline(2, 3, 25);
    b.hline(15, 16, 25);
    b.hline(2, 3, 27);
    b.hline(15, 16, 27);
    b.hline(4, 14, 28);
    b.vline(1, 26, 35);
    b.vline(17, 26, 35);
    b.shade(2, 29, 15, 7);
    b.hline(2, 3, 36);
    b.hline(15, 16, 36);
    b.hline(4, 14, 37);

    // the selected box: dashed marquee with square handles
    b.rect(34, 27, 18, 9);
    b.hline(37, 44, 31);
    b.rect(31, 24, 24, 15, 1);
    for (const [x, y] of [
      [30, 23],
      [53, 23],
      [30, 37],
      [53, 37],
    ])
      b.fill(x, y, 2, 2);

    b.sprite(22, 27, CURSOR);
  },

  // a load ramp that stays under the threshold — the verdict, not the noise
  vortex: (b) => {
    b.vline(2, 8, 35);
    b.hline(2, 51, 35);
    for (let y = 10; y <= 34; y += 6) b.set(1, y);

    b.hline(3, 51, 12, 2);

    const heights = [4, 7, 10, 13, 16, 18, 19, 19];
    heights.forEach((ht, i) => {
      const x = 6 + i * 6;
      b.fill(x, 34 - ht + 1, 3, ht);
    });

    // ✓ PASS
    b.sprite(24, 1, ["......#", ".....#.", "#...#..", ".#.#...", "..#...."]);
    b.text(34, 0, "PASS");
  },

  // an open book, a chapter heading, and a bookmark
  katha: (b) => {
    b.sprite(0, 3, ["..###################......................###################"]);
    b.hline(2, 23, 4);
    b.hline(28, 49, 4);
    b.set(1, 5);
    b.set(24, 5);
    b.set(27, 5);
    b.set(50, 5);
    b.vline(0, 6, 34);
    b.vline(51, 6, 34);
    b.vline(25, 5, 35);
    b.vline(26, 5, 35);
    b.hline(0, 24, 35);
    b.hline(27, 51, 35);

    for (const [y, len] of [
      [9, 16],
      [12, 18],
      [15, 14],
      [18, 18],
      [21, 17],
      [24, 11],
      [27, 18],
    ])
      b.hline(4, 4 + len, y);

    b.fill(30, 9, 11, 2);
    for (const [y, len] of [
      [14, 17],
      [17, 18],
      [20, 13],
      [23, 18],
      [26, 16],
      [29, 9],
    ])
      b.hline(30, 30 + len, y);

    // ribbon, notched at the tail
    b.fill(44, 1, 3, 11);
    b.set(45, 11, false);
  },

  // the critter, mid-scuttle, past two of the piles it turned up
  scuttle: (b) => {
    // a pile of installer boxes, drawn with a hint of depth
    for (const [x, y] of [
      [0, 26],
      [10, 26],
      [5, 17],
    ]) {
      b.rect(x, y, 10, 9);
      b.hline(x + 2, x + 11, y - 2);
      b.set(x + 1, y - 1);
      b.vline(x + 11, y - 1, y + 6);
      b.set(x + 10, y + 7);
    }
    b.shade(1, 27, 8, 7);
    b.shade(11, 27, 8, 7);
    b.shade(6, 18, 8, 7);

    // a ghost: files from an app that's gone
    b.sprite(24, 9, [
      "...#####...",
      ".##.....##.",
      "#.........#",
      "#..##.##..#",
      "#..##.##..#",
      "#.........#",
      "#.........#",
      "#.........#",
      "#..#...#..#",
      "#.#.#.#.#.#",
      ".#...#...#.",
    ]);

    // Scuttle itself, with speed lines
    b.sprite(38, 27, [
      "....#####....",
      "..#########..",
      ".##..###..##.",
      ".###########.",
      "#############",
      "..#.#...#.#..",
      ".#..#...#..#.",
    ]);
    b.hline(28, 34, 29, 2);
    b.hline(30, 35, 31);

    b.hline(0, 51, 36);
  },

  // a rocket on the pad beside its tower, and the pre-flight checklist
  launchpad: (b) => {
    // checklist: two done, one to go
    for (const [y, done, len] of [
      [8, true, 9],
      [15, true, 7],
      [22, false, 9],
    ] as const) {
      b.rect(0, y, 5, 5);
      if (done) b.fill(1, y + 1, 3, 3);
      b.hline(7, 7 + len, y + 2);
    }

    b.sprite(22, 5, [
      ".....#.....",
      "....###....",
      "...#####...",
      "..#######..",
      "..###.###..",
      "..##...##..",
      "..###.###..",
      "..#######..",
      "..#######..",
      "..#######..",
      ".#########.",
      "##.#####.##",
      "#..#####..#",
      "#..#.#.#..#",
    ]);
    b.shade(24, 19, 7, 4);

    b.fill(16, 25, 25, 2);
    b.vline(18, 27, 33);
    b.vline(38, 27, 33);
    b.hline(0, 51, 34);

    // service tower with cross bracing
    b.vline(43, 4, 33);
    b.vline(47, 4, 33);
    for (let y = 4; y < 32; y += 6) {
      for (let i = 0; i <= 4; i++) {
        b.set(43 + i, y + Math.round((i * 6) / 4));
        b.set(47 - i, y + Math.round((i * 6) / 4));
      }
    }
    b.hline(33, 43, 12);
  },
};

export function hasCard(id: string | undefined): id is string {
  return !!id && id in art;
}

/**
 * Draw a card as a `w`×`h` bitmap (w ≥ CARD_W, h ≥ CARD_H) of 0 (empty),
 * INK, or DOT (the faint idle grid, kept clear of the title and art). `lines`
 * is the title, at most nine characters a line.
 */
export function drawCard(id: string, lines: string[], w: number, h: number): Uint8Array {
  const b = new Bitmap(w, h);
  // spare width goes to the outer margins, so the title and art columns keep
  // their relationship at every size
  const margin = Math.max(MIN_MARGIN, Math.floor((w - (CARD_W - MIN_MARGIN * 2)) / 2 / 1.6));

  const titleH = lines.length * 7 * TITLE_SCALE + (lines.length - 1) * LINE_GAP;
  const titleTop = Math.round((h - titleH) / 2);
  lines.forEach((line, i) => b.text(margin, titleTop + i * (7 * TITLE_SCALE + LINE_GAP), line, TITLE_SCALE));
  const titleW = Math.max(...lines.map((l) => l.length * 6 * TITLE_SCALE - TITLE_SCALE));

  // The art is placed by its real ink bounds — the sketches don't all start
  // at their box's origin.
  const { scratch, x0, y0, x1, y1 } = measuredArt(id);

  const artLeft = margin + TITLE_COL + GAP;
  const artRight = w - margin;
  let ax = 0;
  let ay = 0;
  if (x1 >= 0) {
    ax = Math.round((artLeft + artRight) / 2 - (x1 - x0 + 1) / 2);
    ay = Math.round(h / 2 - (y1 - y0 + 1) / 2);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) if (scratch.data[y * scratch.w + x]) b.set(ax + x - x0, ay + y - y0);
  }

  // The idle grid, everywhere except a clear zone around the title and art.
  const clear = (x: number, y: number) =>
    (x >= margin - 4 && x <= margin + titleW + 4 && y >= titleTop - 4 && y <= titleTop + titleH + 4) ||
    (x1 >= 0 && x >= ax - 4 && x <= ax + (x1 - x0) + 4 && y >= ay - 4 && y <= ay + (y1 - y0) + 4);
  const off = Math.floor(DOT_PITCH / 2);
  for (let y = off; y < h; y += DOT_PITCH)
    for (let x = off; x < w; x += DOT_PITCH) if (!b.data[y * w + x] && !clear(x, y)) b.data[y * w + x] = DOT;

  return b.data;
}

/** Draw an illustration off to the side and find its ink's bounding box. */
function measuredArt(id: string) {
  const scratch = new Bitmap(ART_COL + 16, CARD_H + 8);
  scratch.ox = 8;
  scratch.oy = 4;
  art[id]?.(scratch);
  let x0 = scratch.w;
  let y0 = scratch.h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < scratch.h; y++)
    for (let x = 0; x < scratch.w; x++)
      if (scratch.data[y * scratch.w + x]) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  return { scratch, x0, y0, x1, y1 };
}

/** Just the illustration, cropped to its ink — for use outside the display. */
export function drawArt(id: string): { w: number; h: number; data: Uint8Array } | null {
  const { scratch, x0, y0, x1, y1 } = measuredArt(id);
  if (x1 < 0) return null;
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const data = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data[y * w + x] = scratch.data[(y + y0) * scratch.w + x + x0];
  return { w, h, data };
}

/** How many ink pixels an illustration uses — for balancing the series. */
export function artWeight(id: string): number {
  const scratch = new Bitmap(ART_COL + 16, CARD_H + 8);
  scratch.ox = 8;
  scratch.oy = 4;
  art[id]?.(scratch);
  return scratch.data.reduce((n, v) => n + v, 0);
}
