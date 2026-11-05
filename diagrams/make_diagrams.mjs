// Regenerates the SVG figures for laneway-grilles_diy-build_plan.md.
// Run:  node diagrams/make_diagrams.mjs
// Every coordinate is derived from the plan's millimetre positions, so a change
// to the geometry is a change here, then a re-run.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));

const INK = '#222';
const DIM = '#555';
const TIMBER = '#e6cfa3';
const TIMBER_EDGE = '#8a6a3a';
const STEEL = '#9aa0a6';
const STEEL_EDGE = '#3c4146';
const ACCENT = '#c8102e';
const FONT = 'Helvetica, Arial, sans-serif';

const r = n => Math.round(n * 100) / 100;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const rect = (x, y, w, h, { fill = 'none', stroke = INK, sw = 1, dash = '' } = {}) =>
  `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const line = (x1, y1, x2, y2, { stroke = INK, sw = 1, dash = '', marker = '' } = {}) =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}${marker ? ` marker-end="url(#${marker})"` : ''}/>`;
const circle = (cx, cy, rad, { fill = 'none', stroke = INK, sw = 1 } = {}) =>
  `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text = (x, y, s, { size = 11, anchor = 'start', fill = INK, weight = 'normal', rotate = 0, italic = false } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-family="${FONT}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''}${rotate ? ` transform="rotate(${rotate} ${r(x)} ${r(y)})"` : ''}>${esc(s)}</text>`;
const tri = (x, y, size, dir, fill = INK) => {
  // small filled triangle pointing in dir: 'r' | 'l' | 'u' | 'd'
  const p = { r: [[x, y - size], [x, y + size], [x + size, y]], l: [[x, y - size], [x, y + size], [x - size, y]],
              u: [[x - size, y], [x + size, y], [x, y - size]], d: [[x - size, y], [x + size, y], [x, y + size]] }[dir];
  return `<polygon points="${p.map(q => q.map(r).join(',')).join(' ')}" fill="${fill}"/>`;
};

function dimH(x1, x2, y, label, { ext1 = null, ext2 = null, size = 10 } = {}) {
  const o = [];
  if (ext1 !== null) o.push(line(x1, ext1, x1, y + (ext1 < y ? 4 : -4), { stroke: DIM, sw: 0.6 }));
  if (ext2 !== null) o.push(line(x2, ext2, x2, y + (ext2 < y ? 4 : -4), { stroke: DIM, sw: 0.6 }));
  o.push(line(x1, y, x2, y, { stroke: DIM, sw: 0.7 }));
  for (const x of [x1, x2]) o.push(line(x - 3, y + 3, x + 3, y - 3, { stroke: DIM, sw: 0.9 }));
  o.push(text((x1 + x2) / 2, y - 3, label, { size, anchor: 'middle', fill: DIM }));
  return o.join('');
}
function dimV(y1, y2, x, label, { ext1 = null, ext2 = null, size = 10 } = {}) {
  const o = [];
  if (ext1 !== null) o.push(line(ext1, y1, x + (ext1 < x ? 4 : -4), y1, { stroke: DIM, sw: 0.6 }));
  if (ext2 !== null) o.push(line(ext2, y2, x + (ext2 < x ? 4 : -4), y2, { stroke: DIM, sw: 0.6 }));
  o.push(line(x, y1, x, y2, { stroke: DIM, sw: 0.7 }));
  for (const y of [y1, y2]) o.push(line(x - 3, y + 3, x + 3, y - 3, { stroke: DIM, sw: 0.9 }));
  o.push(text(x - 3, (y1 + y2) / 2, label, { size, anchor: 'middle', fill: DIM, rotate: -90 }));
  return o.join('');
}

const svg = (w, h, label, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/>
  </marker>
  <marker id="arrowAccent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${ACCENT}"/>
  </marker>
  <marker id="arrowInk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${INK}"/>
  </marker>
</defs>
<rect width="100%" height="100%" fill="#fff"/>
${body}
</svg>
`;

// Geometry shared by the figures, straight from the plan.
const W = 465, H = 1171;               // left-hand grille outside
const T = 12, TF = 19;                 // rail / wall-stile thickness, free-stile thickness
const D = 42;                          // member depth in Z
const ROD = 12;
const XV = [155, 310];                 // verticals, from the wall-side outer face
const YH = [290, 585, 880];            // horizontals, from the bottom outer face
const ZH = 14, ZV = 26;                // rod layer centres from the window-side face
const BLIND = 12;                      // blind hole depth in the free stile; the other holes are through
const HL = W - TF + BLIND;             // horizontal rod length as drawn (cut 457: 1 mm play, like the verticals)
const FIX_STILE = [145, 437, 732, 1026];
const FIX_RAIL = [77, 232, 388];
const INSERTS = [624, 659, 1080, 1150];
const GAP = 27;                        // frame face to sash

// ---------------------------------------------------------------- elevation
function elevation() {
  const s = 0.5, ox = 130, oy = 44;
  const X = x => ox + x * s, Y = y => oy + (H - y) * s;
  const b = [];
  b.push(text(ox, 16, 'Left-hand grille, viewed from the room', { size: 13, weight: 'bold' }));
  b.push(text(ox, 31, 'wall at left, mullion at right. Right-hand grille is the mirror image at 1178 high', { size: 10, fill: DIM }));

  // members
  const tim = { fill: TIMBER, stroke: TIMBER_EDGE };
  b.push(rect(X(0), Y(H), W * s, T * s, tim));                      // top rail
  b.push(rect(X(0), Y(T), W * s, T * s, tim));                      // bottom rail
  b.push(rect(X(0), Y(H - T), T * s, (H - 2 * T) * s, tim));        // wall stile
  b.push(rect(X(W - TF), Y(H - T), TF * s, (H - 2 * T) * s, tim));  // free stile

  // horizontals (front layer, toward the glass, so drawn first)
  const st = { fill: STEEL, stroke: STEEL_EDGE, sw: 0.8 };
  for (const y of YH) {
    b.push(rect(X(T), Y(y + ROD / 2), (W - T - TF) * s, ROD * s, st));
    b.push(rect(X(0), Y(y + ROD / 2), T * s, ROD * s, { stroke: STEEL_EDGE, sw: 0.6, dash: '2 2' }));
    b.push(rect(X(W - TF), Y(y + ROD / 2), BLIND * s, ROD * s, { stroke: STEEL_EDGE, sw: 0.6, dash: '2 2' }));
  }
  // verticals (rear layer, nearer the room, drawn over)
  for (const x of XV) {
    b.push(rect(X(x - ROD / 2), Y(H - T), ROD * s, (H - 2 * T) * s, st));
    b.push(rect(X(x - ROD / 2), Y(H), ROD * s, T * s, { stroke: STEEL_EDGE, sw: 0.6, dash: '2 2' }));
    b.push(rect(X(x - ROD / 2), Y(T), ROD * s, T * s, { stroke: STEEL_EDGE, sw: 0.6, dash: '2 2' }));
  }
  // pins
  for (const x of XV) for (const y of YH) b.push(circle(X(x), Y(y), 2.6, { fill: ACCENT, stroke: '#fff', sw: 0.8 }));
  // fixing holes
  for (const y of FIX_STILE) b.push(circle(X(T / 2), Y(y), 2.4, { fill: '#fff', stroke: INK, sw: 0.8 }));
  for (const x of FIX_RAIL) { b.push(circle(X(x), Y(H - T / 2), 2.4, { fill: '#fff', stroke: INK, sw: 0.8 })); b.push(circle(X(x), Y(T / 2), 2.4, { fill: '#fff', stroke: INK, sw: 0.8 })); }
  // inserts on the free stile inner face
  for (const y of INSERTS) { b.push(tri(X(W - TF) + 0.5, Y(y), 3.5, 'r', ACCENT)); b.push(text(X(W) + 4, Y(y) + 3, String(y), { size: 8.5, fill: ACCENT })); }

  // member labels
  b.push(text(X(W / 2), Y(H) - 4, 'top rail 42 × 12, full width', { size: 9, anchor: 'middle' }));
  b.push(text(X(W / 2), Y(0) + 11, 'bottom rail 42 × 12', { size: 9, anchor: 'middle' }));
  b.push(text(X(T) - 8, Y(H / 2 + 40), 'wall-side stile 42 × 12', { size: 9, anchor: 'middle', rotate: -90 }));
  b.push(text(X(W - TF) - 6, Y(H / 2 - 130), 'free stile 42 × 19', { size: 9, anchor: 'middle', rotate: -90 }));
  b.push(text(X(W) + 4, Y(1080) + 14, 'M5 inserts, Z 30', { size: 8.5, fill: ACCENT }));
  b.push(text(X(XV[1]) + 9, Y(YH[2] + 40), 'roll pin at every crossing', { size: 8.5, fill: ACCENT }));
  b.push(text(X(XV[1]) + 9, Y(YH[2] + 20), 'rods dashed where inside timber', { size: 8.5, fill: DIM }));

  // dimensions: bottom
  const yb = Y(0);
  b.push(dimH(X(0), X(XV[0]), yb + 26, '155', { ext1: yb, ext2: yb }));
  b.push(dimH(X(0), X(XV[1]), yb + 44, '310', { ext2: yb }));
  b.push(dimH(X(0), X(W), yb + 62, '465', { ext2: yb }));
  b.push(text(X(0), yb + 76, 'rod centres from the wall-side outer face', { size: 8.5, fill: DIM }));
  // right: rod heights and overall
  const xr = X(W);
  b.push(dimV(Y(0), Y(YH[0]), xr + 34, '290', { ext1: xr, ext2: xr }));
  b.push(dimV(Y(0), Y(YH[1]), xr + 52, '585', { ext2: xr }));
  b.push(dimV(Y(0), Y(YH[2]), xr + 70, '880', { ext2: xr }));
  b.push(dimV(Y(0), Y(H), xr + 88, '1171', { ext2: xr }));
  // left: fixing holes
  const xl = X(0);
  b.push(dimV(Y(0), Y(FIX_STILE[0]), xl - 26, '145', { ext1: xl, ext2: xl }));
  b.push(dimV(Y(0), Y(FIX_STILE[1]), xl - 44, '437', { ext2: xl }));
  b.push(dimV(Y(0), Y(FIX_STILE[2]), xl - 62, '732', { ext2: xl }));
  b.push(dimV(Y(0), Y(FIX_STILE[3]), xl - 80, '1026', { ext2: xl }));
  b.push(text(xl - 84, Y(H) - 2, 'fixing holes, 5 mm csk', { size: 8.5, fill: DIM }));
  b.push(text(xl - 84, Y(H) + 9, 'rails at 77, 232, 388', { size: 8.5, fill: DIM }));

  return svg(ox + W * s + 112, oy + H * s + 86, 'Elevation of the left-hand grille from the room side, with rod, fixing and insert positions dimensioned', b.join('\n'));
}

// ------------------------------------------------------------- plan section
function planSection() {
  const ox = 100, oz = 118;
  const X = x => ox + x, Z = z => oz + z;
  const b = [];
  b.push(text(X(-45), 16, 'Plan section at Y 585, looking down. Glass at the top, room at the bottom', { size: 13, weight: 'bold' }));
  b.push(text(X(-45), 31, 'left-hand grille: wall-side stile at left, free stile beside the mullion at right. Scale 1 px = 1 mm', { size: 10, fill: DIM }));

  const tim = { fill: TIMBER, stroke: TIMBER_EDGE };
  // outside: glass line, sash, mullion
  b.push(line(X(-45), Z(-74), X(510), Z(-74), { stroke: '#4a90c2', sw: 2 }));
  b.push(text(X(230), Z(-62), 'glass, outside', { size: 9, anchor: 'middle', fill: '#4a90c2' }));
  b.push(rect(X(-4), Z(-GAP - 25), W - 4, 25, { fill: '#d8dbde', stroke: STEEL_EDGE }));
  b.push(text(X(230), Z(-GAP - 9), 'steel sash, hinged at the wall side, opens outward', { size: 9, anchor: 'middle' }));
  b.push(rect(X(W + 2), Z(-62), 26, 44, { fill: '#d8dbde', stroke: STEEL_EDGE }));
  b.push(text(X(W + 15), Z(-66), 'mullion', { size: 9, anchor: 'middle' }));

  // reveal
  b.push(rect(X(-45), Z(-74), 45, 192, tim));
  for (let z = -70; z < 107; z += 12) b.push(line(X(-42), Z(z), X(-3), Z(z + 6), { stroke: TIMBER_EDGE, sw: 0.4 }));
  b.push(text(X(-22), Z(130), 'timber reveal', { size: 9, anchor: 'middle' }));

  // frame members
  b.push(rect(X(0), Z(0), T, D, tim));
  b.push(rect(X(W - TF), Z(0), TF, D, tim));
  // horizontal rod, cut lengthwise
  b.push(rect(X(0), Z(ZH - ROD / 2), HL, ROD, { fill: STEEL, stroke: STEEL_EDGE, sw: 0.8 }));
  b.push(text(X(30), Z(ZH + 3.5), 'horizontal rod 12, through the wall-side stile, 12 into a blind hole in the free stile', { size: 8.5, fill: '#fff' }));
  // verticals cut
  for (const x of XV) {
    b.push(circle(X(x), Z(ZV), ROD / 2, { fill: '#6c7378', stroke: STEEL_EDGE, sw: 0.8 }));
    b.push(rect(X(x - 2), Z(ZH - ROD / 2), 4, 24, { fill: ACCENT, stroke: '#fff', sw: 0.5 }));
  }
  b.push(text(X(XV[0]) - 9, Z(ZV + 4), 'vertical rod, cut', { size: 8.5, anchor: 'end' }));
  b.push(text(X(XV[0]) + 10, Z(ZV + 4), 'roll pin 4 × 24', { size: 8.5, fill: ACCENT }));

  // fixing screw through the wall stile, head sunk 2 below the opening-side face and filled
  b.push(line(X(T - 2), Z(D / 2), X(-55), Z(D / 2), { stroke: INK, sw: 1.6 }));
  b.push(tri(X(T - 2), Z(D / 2), 3, 'l', INK));
  b.push(text(X(24), Z(D + 14), 'fixing screw 10 g × 75 through the wall-side stile into the reveal,', { size: 8.5 }));
  b.push(text(X(24), Z(D + 26), 'head sunk 2 below the opening-side face, filled and painted over', { size: 8.5 }));
  // insert, dashed because it is at another Y
  b.push(rect(X(W - TF), Z(30 - 4), 10, 8, { stroke: ACCENT, sw: 0.8, dash: '2 1.5' }));
  b.push(text(X(W), Z(D + 44), 'M5 insert into the free stile, Z 30, at Y 624, 659, 1080, 1150', { size: 8.5, anchor: 'end', fill: ACCENT }));

  // push arrow and what resists it
  b.push(line(X(120), Z(-24), X(120), Z(5), { stroke: ACCENT, sw: 2, marker: 'arrowAccent' }));
  b.push(text(X(126), Z(-14), 'push from the glass side goes through the pinned grid', { size: 8.5, fill: ACCENT, weight: 'bold' }));
  b.push(text(X(126), Z(-4), 'into stiles and rails, then the fixing screws sideways, in shear.', { size: 8.5, fill: DIM }));

  b.push(text(X(230), Z(118), 'room', { size: 10, anchor: 'middle', fill: DIM, italic: true }));

  // dimensions
  b.push(dimV(Z(-GAP), Z(0), X(400), '27', { ext1: X(W - 4), ext2: X(W - TF) }));
  b.push(dimV(Z(0), Z(ZH), X(380), '14', { ext1: X(W - TF), ext2: X(W - TF) }));
  b.push(dimV(Z(0), Z(ZV), X(345), '26', { ext2: X(XV[1]) + 6 }));
  b.push(dimV(Z(0), Z(D), X(W + 24), '42', { ext1: X(W), ext2: X(W) }));
  b.push(dimH(X(0), X(T), Z(-8), '12', { ext1: Z(0), ext2: Z(0) }));
  b.push(dimH(X(W - TF), X(W), Z(-8), '19', { ext1: Z(0), ext2: Z(0) }));
  b.push(dimH(X(0), X(W), Z(104), '465', { ext1: Z(D), ext2: Z(D) }));

  return svg(ox + 540, oz + 148, 'Plan section through the grille showing the two rod layers inside the 42 mm member depth, the 27 mm gap to the sash, and the filled fixing screw', b.join('\n'));
}

// ---------------------------------------------------------- crossing detail
function crossing() {
  const s = 4;
  const b = [];
  b.push(text(20, 16, 'Crossing detail: one roll pin through both rods, perpendicular to the grid', { size: 13, weight: 'bold' }));
  b.push(text(20, 31, 'left: looking along the horizontal rod. right: looking from the room. Scale 4 px = 1 mm', { size: 10, fill: DIM }));

  // --- view A: along X. horizontal axis = Y, vertical axis = Z (down = into room)
  const ax = 40, az = 60;  // svg origin for Y=-35, Z=-8
  const A = (y, z) => [ax + (y + 35) * s, az + (z + 8) * s];
  // frame face reference
  { const [x1, y1] = A(-35, 0), [x2] = A(35, 0);
    b.push(line(x1, y1, x2, y1, { stroke: DIM, sw: 0.7, dash: '4 3' }));
    b.push(text(x1, y1 - 4, 'frame window-side face, Z 0', { size: 9, fill: DIM })); }
  // vertical rod as a bar along Y at Z 20..32
  { const [x1, y1] = A(-35, ZV - ROD / 2);
    b.push(rect(x1, y1, 70 * s, ROD * s, { fill: STEEL, stroke: STEEL_EDGE }));
    b.push(text(A(6, 0)[0], y1 + ROD * s - 10, 'vertical rod, Z 26, runs along Y', { size: 9 })); }
  // horizontal rod as a circle at Z 14
  { const [cx, cy] = A(0, ZH);
    b.push(circle(cx, cy, ROD / 2 * s, { fill: '#6c7378', stroke: STEEL_EDGE }));
    b.push(text(cx + ROD / 2 * s + 6, cy - 6, 'horizontal rod, Z 14,', { size: 9 }));
    b.push(text(cx + ROD / 2 * s + 6, cy + 6, 'runs toward you', { size: 9 })); }
  // pin Z 8..32
  { const [x1, y1] = A(-2, ZH - ROD / 2);
    b.push(rect(x1, y1, 4 * s, 24 * s, { fill: ACCENT, stroke: '#fff', sw: 0.8 }));
    const [tx, ty] = A(-33, 40);
    b.push(text(tx, ty + 8, 'pin 4 × 24, flush both ends, drilled from the room side', { size: 9, fill: ACCENT })); }
  // dims
  { const [xa, z0] = A(33, 0); const [, z14] = A(33, ZH); const [, z26] = A(33, ZV);
    b.push(dimV(z0, z14, xa + 14, '14', { ext1: xa, ext2: A(6, 0)[0] }));
    b.push(dimV(z0, z26, xa + 30, '26')); }
  { const [xp, zp1] = A(-30, ZH - ROD / 2); const [, zp2] = A(-30, ZV + ROD / 2);
    b.push(dimV(zp1, zp2, xp - 2, '24', { ext1: A(-2, 0)[0], ext2: A(-2, 0)[0] })); }
  // glass / room arrows
  { const [x1, y1] = A(-33, 4); b.push(text(x1, y1, 'glass side ↑', { size: 9, fill: DIM })); }
  { const [x1, y1] = A(-33, 36); b.push(text(x1, y1 - 6, 'room side ↓', { size: 9, fill: DIM })); }

  // --- view B: from the room. horizontal = X, vertical = Y (up)
  const bx = 420, by = 60;
  const B = (x, y) => [bx + (x + 35) * s, by + (35 - y) * s];
  { const [x1, y1] = B(-35, ROD / 2);
    b.push(rect(x1, y1, 70 * s, ROD * s, { fill: STEEL, stroke: STEEL_EDGE }));
    b.push(text(x1 + 70 * s - 4, y1 + ROD * s + 12, 'horizontal, behind', { size: 9, anchor: 'end' })); }
  { const [x1, y1] = B(-ROD / 2, 35);
    b.push(rect(x1, y1, ROD * s, 70 * s, { fill: '#b4b9be', stroke: STEEL_EDGE }));
    b.push(text(x1 + ROD * s + 4, y1 + 12, 'vertical, nearer the room', { size: 9 })); }
  { const [cx, cy] = B(0, 0);
    b.push(circle(cx, cy, 2 * s, { fill: ACCENT, stroke: '#fff', sw: 0.8 }));
    b.push(line(cx + 2 * s, cy, cx + 6 * s + 50, cy - 40, { stroke: ACCENT, sw: 0.6 }));
    b.push(text(cx + 6 * s + 52, cy - 42, 'pin end, 4 mm', { size: 9, fill: ACCENT })); }
  { const [x1, y1] = B(-35, -37); b.push(text(x1, y1 + 10, 'six of these per grille, at X 155 and 310 by Y 290, 585 and 880', { size: 9, fill: DIM })); }

  return svg(740, 360, 'Crossing detail: the horizontal and vertical rods touch, and a 4 by 24 mm roll pin passes through both perpendicular to the grid', b.join('\n'));
}

// ------------------------------------------------------------ corner detail
function corner() {
  const s = 3;
  const x0 = 290, y0 = 1055, yTop = 1200;   // window in mm
  const ox = 70, oy = 50;
  const X = x => ox + (x - x0) * s, Y = y => oy + (yTop - y) * s;
  const b = [];
  b.push(text(20, 16, 'Free-stile top corner, viewed from the room', { size: 13, weight: 'bold' }));
  b.push(text(20, 31, 'rail runs full width over the stile; vertical rod ends flush against the reveal head. Scale 3 px = 1 mm', { size: 10, fill: DIM }));

  const tim = { fill: TIMBER, stroke: TIMBER_EDGE };
  // reveal head above the frame
  b.push(rect(X(x0), Y(yTop), (W + 30 - x0) * s, (yTop - H) * s, tim));
  for (let x = x0 + 4; x < W + 28; x += 14) b.push(line(X(x), Y(yTop) + 3, X(x + 8), Y(H) - 3, { stroke: TIMBER_EDGE, sw: 0.4 }));
  b.push(text(X(x0 + 6), Y(H) - 8, 'reveal head', { size: 9 }));
  // reveal side beyond the free stile is open: the mullion. show a dashed line
  b.push(line(X(W), Y(H), X(W), Y(y0), { stroke: DIM, sw: 0.7, dash: '4 3' }));
  b.push(text(X(W) + 14, Y(1100), 'mullion side, open', { size: 9, fill: DIM, rotate: -90, anchor: 'middle' }));

  // top rail, free stile
  b.push(rect(X(x0), Y(H), (W - x0) * s, T * s, tim));
  b.push(rect(X(W - TF), Y(H - T), TF * s, (H - T - y0) * s, tim));
  b.push(text(X(x0 + 40), Y(H - T / 2) + 3.5, 'top rail 42 × 12, full width', { size: 9 }));
  b.push(text(X(W - TF) - 6, Y(1095), 'free stile 42 × 19, between the rails', { size: 9, rotate: -90, anchor: 'middle' }));

  // vertical rod at X 310, through the rail, flush with its top
  b.push(rect(X(XV[1] - ROD / 2), Y(H - T), ROD * s, (H - T - y0) * s, { fill: STEEL, stroke: STEEL_EDGE }));
  b.push(rect(X(XV[1] - ROD / 2), Y(H), ROD * s, T * s, { stroke: STEEL_EDGE, sw: 0.7, dash: '3 2' }));
  b.push(text(X(XV[1]) + 8 * s, Y(1075), 'vertical rod, through the rail, cut flush', { size: 9 }));
  b.push(text(X(XV[1]) + 8 * s, Y(1065), 'captive: the head of the reveal is right there', { size: 9, fill: DIM }));

  // corner screws through the rail into the stile end grain
  for (const x of [W - TF + 5, W - 5]) {
    b.push(line(X(x), Y(H), X(x), Y(H - 40), { stroke: INK, sw: 1.4, dash: '3 2' }));
    b.push(line(X(x) - 5, Y(H), X(x) + 5, Y(H), { stroke: INK, sw: 2 }));
  }
  b.push(text(X(W - TF) - 10, Y(1138), '2 × 8 g × 40 screws through the rail into the stile end grain, glued.', { size: 9, anchor: 'end' }));
  b.push(text(X(W - TF) - 10, Y(1128), 'Opener load on the stile is toward the room, so they work in shear.', { size: 9, anchor: 'end', fill: DIM }));
  b.push(text(X(W - TF) - 10, Y(1112), 'No bracket here: the opener foot plate at 1150 owns this face,', { size: 9, anchor: 'end', fill: DIM }));
  b.push(text(X(W - TF) - 10, Y(1102), 'and the rail is screwed to the reveal head 77 mm from this end.', { size: 9, anchor: 'end', fill: DIM }));

  // inserts at 1080 and 1150
  for (const y of [1080, 1150]) { b.push(tri(X(W - TF) + 0.5, Y(y), 5, 'r', ACCENT)); b.push(text(X(W - TF) - 10, Y(y) + 3.5, `M5 insert, ${y}`, { size: 9, anchor: 'end', fill: ACCENT })); }
  b.push(dimV(Y(H - T), Y(1150), X(W) + 30, '9', { ext1: X(W), ext2: X(W) }));
  b.push(text(X(W) + 36, Y(1156), 'plate must fit', { size: 8.5, fill: DIM, rotate: -90, anchor: 'middle' }));

  // dims
  b.push(dimH(X(W - TF), X(W), Y(y0) + 14, '19', { ext1: Y(y0), ext2: Y(y0) }));
  b.push(dimV(Y(H), Y(H - T), X(x0) - 10, '12', { ext1: X(x0), ext2: X(x0) }));

  return svg(ox + (W + 40 - x0) * s + 60, oy + (yTop - y0) * s + 36, 'Free-stile top corner: the rail runs over the stile with two screws into its end grain; the vertical rod passes through the rail and ends flush against the reveal head; the top opener insert sits 9 mm below the rail', b.join('\n'));
}

// ------------------------------------------------------- exploded assembly
function exploded() {
  const s = 0.3, ox = 120, oy = 90;
  const X = x => ox + x * s, Y = y => oy + (H - y) * s;
  const off = 110; // exploded offset in mm
  const b = [];
  b.push(text(20, 16, 'Dry-fit order: the frame closes around a pinned grid', { size: 13, weight: 'bold' }));
  b.push(text(20, 31, 'each member engages only its own rods, so the rails drop on first and the stiles slide in sideways', { size: 10, fill: DIM }));

  const st = { fill: STEEL, stroke: STEEL_EDGE, sw: 0.7 };
  const tim = { fill: TIMBER, stroke: TIMBER_EDGE };
  // grid
  for (const y of YH) b.push(rect(X(0), Y(y + ROD / 2), HL * s, ROD * s, st));
  for (const x of XV) b.push(rect(X(x - ROD / 2), Y(H), ROD * s, H * s, st));
  for (const x of XV) for (const y of YH) b.push(circle(X(x), Y(y), 2, { fill: ACCENT, stroke: '#fff', sw: 0.6 }));
  // rails, exploded up and down, with their rod holes
  for (const [yEdge, dir] of [[H + off, 'd'], [-off, 'u']]) {
    const ytop = dir === 'd' ? Y(yEdge) : Y(yEdge + T);
    b.push(rect(X(0), ytop, W * s, T * s, tim));
    for (const x of XV) b.push(circle(X(x), ytop + T * s / 2, 1.8, { fill: '#fff', stroke: TIMBER_EDGE, sw: 0.7 }));
    for (const x of XV) {
      const y1 = dir === 'd' ? ytop + T * s + 4 : ytop - 4, y2 = dir === 'd' ? Y(H) - 6 : Y(0) + 6;
      b.push(line(X(x) + 14, y1, X(x) + 14, y2, { stroke: INK, sw: 1, marker: 'arrowInk' }));
    }
  }
  b.push(text(X(W) + 8, Y(H + off) + 8, '1  rails onto the verticals', { size: 10, weight: 'bold' }));
  b.push(text(X(W) + 8, Y(-off) - 2, '1  rails onto the verticals', { size: 10, weight: 'bold' }));
  // stiles, exploded left and right
  const stileH = H - 2 * T;
  b.push(rect(X(-off - T), Y(H - T), T * s, stileH * s, tim));
  b.push(rect(X(W + off), Y(H - T), TF * s, stileH * s, tim));
  for (const y of YH) { b.push(circle(X(-off - T / 2), Y(y), 1.8, { fill: '#fff', stroke: TIMBER_EDGE, sw: 0.7 })); b.push(circle(X(W + off + TF / 2), Y(y), 1.8, { fill: '#fff', stroke: TIMBER_EDGE, sw: 0.7 })); }
  for (const y of YH) {
    b.push(line(X(-off) + 4, Y(y) - 10, X(0) - 6, Y(y) - 10, { stroke: INK, sw: 1, marker: 'arrowInk' }));
    b.push(line(X(W + off) - 4, Y(y) - 10, X(W) + 6, Y(y) - 10, { stroke: INK, sw: 1, marker: 'arrowInk' }));
  }
  b.push(text(20, Y(H - T) - 6, '2  stiles onto the horizontals', { size: 10, weight: 'bold' }));
  b.push(text(X(-off - T / 2), Y(H / 2), 'wall-side stile, 12', { size: 8.5, anchor: 'middle', rotate: -90 }));
  b.push(text(X(W + off + TF / 2) + 1, Y(H / 2), 'free stile, 19', { size: 8.5, anchor: 'middle', rotate: -90 }));
  b.push(text(X(XV[1]) + 24, Y(0) + 16, 'grid pinned at six crossings first, so it is one piece', { size: 9, fill: ACCENT }));
  b.push(text(X(0), Y(-off) + 26, 'holes shown as circles; all through except the free stile, whose three are blind, 12 deep', { size: 8.5, fill: DIM }));

  return svg(ox + (W + off + TF) * s + 170, oy + (H + 2 * off + 2 * T) * s + 50, 'Exploded view of the dry fit: the pinned rod grid in the middle, rails above and below dropping onto the verticals, stiles left and right sliding onto the horizontals', b.join('\n'));
}

const figures = {
  'elevation.svg': elevation(),
  'plan-section.svg': planSection(),
  'crossing-detail.svg': crossing(),
  'corner-detail.svg': corner(),
  'dry-fit_exploded.svg': exploded(),
};
for (const [name, body] of Object.entries(figures)) {
  writeFileSync(join(OUT, name), body);
  console.log(`wrote ${name} (${body.length} bytes)`);
}
