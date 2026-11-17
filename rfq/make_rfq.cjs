// Builds ../laneway-grilles_rfq.docx: a summary page, then one drawing idea per page.
// Run:  cd rfq && npm ci && node make_rfq.cjs   (then export the PDF, see ../CLAUDE.md)
// Needs rsvg-convert (Homebrew librsvg) to turn the SVG figures into PNGs for Word.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  WidthType, BorderStyle, ShadingType, AlignmentType,
} = require("docx");

const ROOT = path.join(__dirname, "..");
const DIAGRAMS = path.join(ROOT, "diagrams");
const BUILD = path.join(__dirname, "build");
fs.mkdirSync(BUILD, { recursive: true });

// SVG figure -> PNG at 2x, returned with its natural size in CSS px.
function figure(name) {
  if (name.endsWith(".png")) {
    const file = path.join(DIAGRAMS, name);
    const [w, h] = execFileSync("magick", ["identify", "-format", "%w %h", file]).toString().split(" ").map(Number);
    return { data: fs.readFileSync(file), w, h };
  }
  const svgFile = path.join(DIAGRAMS, name);
  const pngFile = path.join(BUILD, name.replace(/\.svg$/, ".png"));
  execFileSync("rsvg-convert", ["-z", "2", svgFile, "-o", pngFile]);
  const m = fs.readFileSync(svgFile, "utf8").match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  return { data: fs.readFileSync(pngFile), w: Number(m[1]), h: Number(m[2]) };
}

const FONT = "Arial";
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 794;   // A4, 14 mm margins
const TEXT_W = PAGE_W - 2 * MARGIN;                   // 10318 DXA
const MAX_W_PX = Math.floor(TEXT_W / 15);             // DXA -> px at 96 dpi
const COL1 = 2000, COL2 = TEXT_W - COL1;

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: 19, ...opts });
const para = (children, opts = {}) => new Paragraph({ children, spacing: { before: 0, after: 80 }, ...opts });

// An image scaled to a target width (px), or to a max height, whichever is smaller.
function image(fig, { width = MAX_W_PX, maxHeight = 1e9, pageBreak = false, before = 120 } = {}) {
  let w = Math.min(width, MAX_W_PX), h = Math.round(w * fig.h / fig.w);
  if (h > maxHeight) { h = maxHeight; w = Math.round(h * fig.w / fig.h); }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    pageBreakBefore: pageBreak,
    spacing: { before, after: 0 },
    children: [new ImageRun({ type: "png", data: fig.data, transformation: { width: w, height: h } })],
  });
}

const rows = [
  ["Quantity", "2: left-hand and right-hand, mirror images (drawing 2)"],
  ["Size, outside", "465 wide × 1171 high (left), 465 × 1178 (right)"],
  ["Frame", "Two bar sizes (drawing 1). 25 × 5 flat bar on three sides: wall-side stile, top rail, bottom rail. 50 × 5 flat bar on the fourth side only: the free stile next to the mullion, orange in every drawing. All bars stand on edge, flush on the window side"],
  ["Bars", "12 mm, round or square, whatever you have. 2 vertical, 3 horizontal; horizontals in front, verticals behind, welded at every crossing and end (drawings 4 to 6)"],
  ["Holes", "6 mm countersunk fixing holes (wall-side stile 4, each rail 3), and 4 × M5 tapped holes (or rivnuts) in the free stile. Positions on drawing 3"],
  ["Finish", "Matte black powder coat, or primed (I'll paint them). Either is fine"],
  ["Accuracy", "Outside size +0 / −2 mm: they fit inside the window opening, so never oversize. Square, flat and positions within 2 mm"],
  ["Not included", "Site visit, installation, the window opener. I collect and fit them"],
];

const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (text, width, bold) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
    shading: bold ? { type: ShadingType.CLEAR, color: "auto", fill: "F2F2F2" } : undefined,
    children: [new Paragraph({ children: [run(text, { bold })], spacing: { before: 0, after: 0 } })],
  });
const table = new Table({
  width: { size: TEXT_W, type: WidthType.DXA },
  columnWidths: [COL1, COL2],
  rows: rows.map(([k, v]) => new TableRow({ children: [cell(k, COL1, true), cell(v, COL2, false)] })),
});

const fig = {
  window: figure("rfq-2_in-window.svg"),
  bars: figure("rfq-1_bar-sizes.svg"),
  above: figure("rfq-4_from-above.svg"),
  side: figure("rfq-6_side-views.svg"),
  corner: figure("rfq-5_corner-3d.svg"),
  elevation: figure("rfq-3_elevation.png"),
};
const caption = (s, pageBreak = false) =>
  para([run(s, { bold: true, size: 22 })], { pageBreakBefore: pageBreak, spacing: { before: 0, after: 60 } });

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 19 } } } },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    children: [
      // Page 1: what is wanted, and the two bar sizes
      para([run("Two small steel window grilles: quote request", { bold: true, size: 30 })], { spacing: { after: 40 } }),
      para([run("Dennis Wollersheim · 0414 529 454 · 18 Nov 2026", { color: "595959" })], { spacing: { after: 140 } }),
      para([run("Two welded mild-steel grilles for the inside of a window. A rough price and lead time is all I need to start. Page 1 is the summary; the drawings after it show the same thing from different sides.")], { spacing: { after: 140 } }),
      table,
      image(fig.bars, { width: 640, before: 200 }),
      // Page 2: in the window
      image(fig.window, { maxHeight: 960, pageBreak: true, before: 0 }),
      // Page 3: dimensions
      caption("3. Dimensions: left-hand grille from inside", true),
      image(fig.elevation, { width: 660, before: 60 }),
      // Page 4: from above, and the 3D corner
      image(fig.above, { pageBreak: true, before: 0 }),
      image(fig.corner, { maxHeight: 600, before: 200 }),
      // Page 5: side views
      image(fig.side, { maxHeight: 960, pageBreak: true, before: 0 }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(ROOT, "laneway-grilles_rfq.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote " + path.relative(process.cwd(), out));
});
