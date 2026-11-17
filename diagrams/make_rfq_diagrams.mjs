// Regenerates the SVG figures for the welded-steel RFQ (laneway-grilles_rfq.docx).
// Run:  node diagrams/make_rfq_diagrams.mjs
// Every coordinate comes from the RFQ's millimetre positions. The 50 × 5 free stile is
// orange in every figure, so a fabricator can see at a glance which bar is the wide one.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));

const INK = '#222';
const DIM = '#555';
const BAR25 = '#8f979e';      // 25 × 5 bar: wall-side stile, top rail, bottom rail
const BAR25_EDGE = '#3c4146';
const BAR50 = '#e8772e';      // 50 × 5 bar: free stile only
const BAR50_EDGE = '#9a4512';
const ROD = '#2f5f9e';
const ROD_EDGE = '#1c3a63';
const GLASS = '#dceaf6';
const WALL = '#e4ddd2';
const WALL_EDGE = '#8a7f70';
const FONT = 'Helvetica, Arial, sans-serif';

const r = n => Math.round(n * 100) / 100;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const rect = (x, y, w, h, { fill = 'none', stroke = INK, sw = 1, dash = '' } = {}) =>
  `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const line = (x1, y1, x2, y2, { stroke = INK, sw = 1, dash = '', marker = '' } = {}) =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}${marker ? ` marker-end="url(#${marker})"` : ''}/>`;
const circle = (cx, cy, rad, { fill = 'none', stroke = INK, sw = 1 } = {}) =>
  `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const poly = (pts, { fill = 'none', stroke = INK, sw = 1 } = {}) =>
  `<polygon points="${pts.map(p => p.map(r).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const text = (x, y, s, { size = 13, anchor = 'start', fill = INK, weight = 'normal', rotate = 0 } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-family="${FONT}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-weight="${weight}"${rotate ? ` transform="rotate(${rotate} ${r(x)} ${r(y)})"` : ''}>${esc(s)}</text>`;
// Several lines of text, top line at y.
const lines = (x, y, arr, opts = {}) => arr.map((s, i) => text(x, y + i * ((opts.size || 13) + 4), s, opts)).join('');
// A leader: line from the label to the thing, with an arrowhead at the thing.
const leader = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { stroke: INK, sw: 0.9, marker: 'arrowInk' });

function dimH(x1, x2, y, label, { size = 12 } = {}) {
  const o = [line(x1, y, x2, y, { stroke: DIM, sw: 0.8 })];
  for (const x of [x1, x2]) o.push(line(x - 3, y + 3, x + 3, y - 3, { stroke: DIM, sw: 1 }), line(x, y - 6, x, y + 6, { stroke: DIM, sw: 0.6 }));
  o.push(text((x1 + x2) / 2, y - 5, label, { size, anchor: 'middle', fill: DIM }));
  return o.join('');
}
function dimV(y1, y2, x, label, { size = 12, side = 'left' } = {}) {
  const o = [line(x, y1, x, y2, { stroke: DIM, sw: 0.8 })];
  for (const y of [y1, y2]) o.push(line(x - 3, y + 3, x + 3, y - 3, { stroke: DIM, sw: 1 }), line(x - 6, y, x + 6, y, { stroke: DIM, sw: 0.6 }));
  const tx = side === 'left' ? x - 6 : x + 6;
  o.push(text(tx, (y1 + y2) / 2 + 4, label, { size, anchor: side === 'left' ? 'end' : 'start', fill: DIM }));
  return o.join('');
}

const svg = (w, h, label, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">
<defs>
  <marker id="arrowInk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${INK}"/>
  </marker>
  <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="8" height="8" fill="${WALL}"/><line x1="0" y1="0" x2="0" y2="8" stroke="${WALL_EDGE}" stroke-width="1"/>
  </pattern>
</defs>
<rect width="100%" height="100%" fill="#fff"/>
${body}
</svg>
`;
const title = (s, sub) => text(20, 32, s, { size: 20, weight: 'bold' }) + (sub ? text(20, 54, sub, { size: 13, fill: DIM }) : '');

// Geometry from the RFQ (left-hand grille; the right-hand one is its mirror at 1178 high).
const W = 465, HL = 1171, HR = 1178;
const T = 5;                    // every bar is 5 thick
const D25 = 25, D50 = 50;       // bar depths into the room: 25 for three sides, 50 for the free stile
const ROD_D = 12;
const XV = [155, 310];          // vertical rods, centres from the wall-side outer face
const YH = [290, 585, 880];     // horizontal rods, centres from the bottom outer face
const Z_H = 6.5, Z_V = 18.5;    // rod centres in from the window-side edge: horizontals front, verticals behind
const GAP = 27;                 // sash face to the grilles' window-side edge
const M5_Y = [624, 659, 1080, 1150], M5_Z = 30;

const files = {};

// ---------------------------------------------------------------- 1. In the window
{
  const s = 0.55, top = 112, base = top + HR * s;
  const o = [title('2. Where the two grilles go', 'Seen from inside the room. The grilles sit in the window opening, in front of the glass.')];
  const bay = (x0, H, mirrored, name) => {
    const g = [], X = v => mirrored ? x0 + (W - v) * s : x0 + v * s, y = v => base - v * s;
    g.push(rect(x0, y(H), W * s, H * s, { fill: GLASS, stroke: 'none' }));
    const bw = 7;  // bars drawn wider than scale so they read
    // rails and wall-side stile: 25 × 5 grey; free stile: 50 × 5 orange
    g.push(rect(x0, y(H), W * s, bw, { fill: BAR25, stroke: BAR25_EDGE }));
    g.push(rect(x0, y(0) - bw, W * s, bw, { fill: BAR25, stroke: BAR25_EDGE }));
    const wallX = mirrored ? x0 + W * s - bw : x0, freeX = mirrored ? x0 : x0 + W * s - bw;
    g.push(rect(wallX, y(H), bw, H * s, { fill: BAR25, stroke: BAR25_EDGE }));
    for (const xv of XV) g.push(line(X(xv), y(H) + bw, X(xv), y(0) - bw, { stroke: ROD, sw: 4 }));
    for (const yh of YH) g.push(line(x0 + bw, y(yh), x0 + W * s - bw, y(yh), { stroke: ROD, sw: 4 }));
    g.push(rect(freeX, y(H), bw, H * s, { fill: BAR50, stroke: BAR50_EDGE }));
    g.push(text(x0 + W * s / 2, base + 26, name, { size: 14, anchor: 'middle', weight: 'bold' }));
    g.push(text(x0 + W * s / 2, base + 44, `465 wide × ${H} high`, { size: 13, anchor: 'middle', fill: DIM }));
    return g.join('');
  };
  const xL = 90, mull = 14, mid = 250;
  const xM1 = xL + W * s, xMid = xM1 + mull, xM2 = xMid + mid, xR = xM2 + mull, xEnd = xR + W * s;
  o.push(rect(30, top - 20, xL - 30, base - top + 40, { fill: 'url(#hatch)', stroke: WALL_EDGE }));
  o.push(rect(xEnd, top - 20, 60, base - top + 40, { fill: 'url(#hatch)', stroke: WALL_EDGE }));
  o.push(text(60, base + 70, 'wall', { anchor: 'middle', fill: DIM }), text(xEnd + 30, base + 70, 'wall', { anchor: 'middle', fill: DIM }));
  o.push(rect(xM1, top - 20, mull, base - top + 40, { fill: '#555', stroke: INK }));
  o.push(rect(xM2, top - 20, mull, base - top + 40, { fill: '#555', stroke: INK }));
  o.push(rect(xMid, top - 20, mid, base - top + 40, { fill: GLASS, stroke: '#9bb7d0' }));
  o.push(lines(xMid + mid / 2, top + 250, ['rest of the window', 'not part of this job'], { anchor: 'middle', fill: DIM }));
  o.push(text(xM1 + mull / 2, top - 28, 'mullion', { anchor: 'middle', fill: DIM }), text(xM2 + mull / 2, top - 28, 'mullion', { anchor: 'middle', fill: DIM }));
  o.push(bay(xL, HL, false, 'LEFT-HAND grille'));
  o.push(bay(xR, HR, true, 'RIGHT-HAND grille (mirror)'));
  // Key, below
  const ky = base + 100;
  o.push(rect(30, ky, 34, 12, { fill: BAR25, stroke: BAR25_EDGE }), text(74, ky + 11, '25 × 5 flat bar: wall-side stile, top rail, bottom rail. Screwed to the timber reveal.'));
  o.push(rect(30, ky + 26, 34, 12, { fill: BAR50, stroke: BAR50_EDGE }), text(74, ky + 37, '50 × 5 flat bar: the free stile only, beside the mullion. No screws on this side.'));
  o.push(line(30, ky + 58, 64, ky + 58, { stroke: ROD, sw: 4 }), text(74, ky + 63, '12 mm bar (round or square): 2 vertical, 3 horizontal.'));
  files['rfq-2_in-window.svg'] = svg(xEnd + 120, ky + 85, 'Where the two grilles go', o.join(''));
}

// ---------------------------------------------------------------- 2. The two bar sizes
{
  const k = 6, top = 130;
  const o = [title('1. The two bar sizes, and which bar is which', 'Every frame bar is 5 thick and stands on edge. Only the depth differs: 25 or 50.')];
  const xa = 140, xb = 420;
  o.push(line(60, top, 640, top, { stroke: ROD_EDGE, sw: 1.2, dash: '6 4' }));
  o.push(text(60, top - 10, 'WINDOW SIDE (glass): every bar is flush on this line', { size: 13, weight: 'bold', fill: ROD_EDGE }));
  o.push(rect(xa, top, T * k, D25 * k, { fill: BAR25, stroke: BAR25_EDGE, sw: 1.5 }));
  o.push(rect(xb, top, T * k, D50 * k, { fill: BAR50, stroke: BAR50_EDGE, sw: 1.5 }));
  o.push(dimV(top, top + D25 * k, xa - 14, '25'), dimH(xa, xa + T * k, top + D25 * k + 22, '5'));
  o.push(dimV(top, top + D50 * k, xb - 14, '50'), dimH(xb, xb + T * k, top + D50 * k + 22, '5'));
  o.push(lines(xa + 50, top + 40, ['25 × 5', 'wall-side stile', 'top rail', 'bottom rail', '(3 sides)'], { size: 14 }));
  o.push(lines(xb + 50, top + 40, ['50 × 5', 'free stile ONLY', '(the side next to', 'the mullion)'], { size: 14 }));
  o.push(text(xb + 50, top + 40 + 5 * 18 + 30, 'Sticks 25 further', { size: 13, fill: BAR50_EDGE }));
  o.push(text(xb + 50, top + 40 + 6 * 18 + 30, 'into the room.', { size: 13, fill: BAR50_EDGE }));
  o.push(line(80, top + 30, 80, top + 260, { stroke: INK, sw: 1, marker: 'arrowInk' }), text(72, top + 150, 'into the room', { size: 13, rotate: -90, anchor: 'middle' }));
  o.push(text(xa - 70, top + D50 * k + 70, 'Cross-sections, drawn 6 × full size.', { size: 12, fill: DIM }));
  // Colour-coded front view
  const s = 0.36, fx = 700, fy = 90, bw = 6;
  o.push(rect(fx, fy, W * s, HL * s, { fill: GLASS, stroke: 'none' }));
  for (const xv of XV) o.push(line(fx + xv * s, fy, fx + xv * s, fy + HL * s, { stroke: ROD, sw: 3 }));
  for (const yh of YH) o.push(line(fx, fy + (HL - yh) * s, fx + W * s, fy + (HL - yh) * s, { stroke: ROD, sw: 3 }));
  o.push(rect(fx, fy, W * s, bw, { fill: BAR25, stroke: BAR25_EDGE }), rect(fx, fy + HL * s - bw, W * s, bw, { fill: BAR25, stroke: BAR25_EDGE }));
  o.push(rect(fx, fy, bw, HL * s, { fill: BAR25, stroke: BAR25_EDGE }), rect(fx + W * s - bw, fy, bw, HL * s, { fill: BAR50, stroke: BAR50_EDGE }));
  o.push(text(fx - 8, fy + HL * s / 2, 'wall side', { anchor: 'middle', rotate: -90, fill: DIM }));
  o.push(text(fx + W * s + 18, fy + HL * s / 2, 'mullion side', { anchor: 'middle', rotate: 90, fill: DIM }));
  o.push(lines(fx - 20, fy + HL * s + 30, ['Left-hand grille from inside.', 'On the right-hand grille the', 'orange 50 × 5 stile is on the left.'], { size: 12, fill: DIM }));
  files['rfq-1_bar-sizes.svg'] = svg(920, 640, 'The two bar sizes', o.join(''));
}

// ---------------------------------------------------------------- 3. Seen from above
{
  const s = 1.7, ox = 130, oz = 200;                 // X = 0 at ox; Z = 0 (window-side edge) at oz
  const X = v => ox + v * s, Z = v => oz + v * s;
  const o = [title('4. Seen from above: a cut across the left-hand grille', 'Looking down. The window glass is at the top, the room at the bottom.')];
  // window band: sash and glass behind the 27 gap, with the mullion past the free stile
  o.push(rect(X(-40), Z(-GAP - 22), X(W + 60) - X(-40), 22 * s, { fill: GLASS, stroke: '#9bb7d0' }));
  o.push(text(X(200), Z(-GAP - 8), 'window: sash and glass', { anchor: 'middle', fill: DIM }));
  o.push(rect(X(W + 6), Z(-GAP - 22), 30 * s, 22 * s, { fill: '#555', stroke: INK }));
  o.push(text(X(W + 21), Z(-GAP - 28), 'mullion', { anchor: 'middle', fill: DIM }));
  // wall reveal on the wall side
  o.push(rect(X(-55), Z(-GAP - 22), 55 * s, 120 * s, { fill: 'url(#hatch)', stroke: WALL_EDGE }));
  o.push(lines(X(-52), Z(110), ['wall', '(timber', 'reveal)'], { size: 12, fill: DIM }));
  // horizontal rod below the cut (front layer), vertical rods cut (back layer)
  o.push(rect(X(T), Z(Z_H - ROD_D / 2), X(W - T) - X(T), ROD_D * s, { fill: '#9fbbe0', stroke: ROD_EDGE }));
  for (const xv of XV) o.push(circle(X(xv), Z(Z_V), ROD_D / 2 * s, { fill: ROD, stroke: ROD_EDGE }));
  // frame bars
  o.push(rect(X(0), Z(0), T * s, D25 * s, { fill: BAR25, stroke: BAR25_EDGE, sw: 1.2 }));
  o.push(rect(X(W - T), Z(0), T * s, D50 * s, { fill: BAR50, stroke: BAR50_EDGE, sw: 1.2 }));
  // dimensions
  o.push(dimH(X(0), X(W), Z(D50) + 34, '465'));
  o.push(dimV(Z(-GAP), Z(0), X(70), '27 gap to the glass', { side: 'right' }));
  o.push(dimV(Z(0), Z(D25), X(-8), '25'));
  o.push(dimV(Z(0), Z(D50), X(W + 14), '50', { side: 'right' }));
  // labels
  const ly = Z(D50) + 80;
  o.push(leader(X(30), ly - 14, X(3), Z(D25) + 3), text(X(30), ly, 'wall-side stile 25 × 5, screwed to the reveal', { size: 13 }));
  o.push(leader(X(400), ly + 8, X(W - 3), Z(D50) + 3), text(X(400), ly + 22, 'free stile 50 × 5 (orange): same window-side line,', { size: 13, anchor: 'end' }));
  o.push(text(X(400), ly + 40, 'sticks 25 further into the room', { size: 13, anchor: 'end' }));
  o.push(text(X(300), Z(-6), 'horizontal bars (front layer, toward the glass) run along here', { size: 12, anchor: 'middle' }));
  o.push(leader(X(235), Z(D25) + 30, X(XV[1]) - 8, Z(Z_V) + 6), text(X(235), Z(D25) + 44, 'vertical bars: back layer, touching the horizontals, welded at each crossing', { size: 12, anchor: 'middle' }));
  files['rfq-4_from-above.svg'] = svg(X(W + 60) + 20, ly + 70, 'Seen from above', o.join(''));
}

// ---------------------------------------------------------------- 4. Side views
{
  const o = [title('6. Side views', 'Left: the free stile seen from the mullion side. Right: a cut through the middle, bottom end.')];
  // (a) free stile, whole height, seen from the mullion side
  const sa = 0.62, ax = 120, ay = 100;
  const AY = v => ay + (HL - v) * sa;
  o.push(rect(ax, AY(HL), D50 * sa * 2.2, HL * sa, { fill: BAR50, stroke: BAR50_EDGE, sw: 1.2 }));  // depth drawn 2.2 × wider so the holes read
  const za = v => ax + v * sa * 2.2;
  for (const y of M5_Y) {
    o.push(circle(za(M5_Z), AY(y), 3.2, { fill: '#fff', stroke: INK }));
    o.push(line(za(D50) + 4, AY(y), za(D50) + 18, AY(y), { stroke: DIM, sw: 0.7 }), text(za(D50) + 22, AY(y) + 4, `M5 at ${y}`, { size: 12, fill: DIM }));
  }
  o.push(text(za(0), AY(HL) - 10, 'window', { size: 12, anchor: 'middle', fill: DIM }), text(za(D50), AY(HL) - 10, 'room', { size: 12, anchor: 'middle', fill: DIM }));
  o.push(dimH(za(0), za(D50), AY(0) + 26, '50'));
  o.push(dimH(za(0), za(M5_Z), AY(0) + 56, '30 to hole centres'));
  o.push(lines(ax - 90, AY(0) + 92, ['The 50 face of the free stile.', 'Four M5 tapped holes for', 'a window opener (owner fits).'], { size: 12, fill: DIM }));
  // (b) cut at X = 232, bottom 330 mm, seen from the mullion side
  const s = 2.4, bx = 470, by = 100, YTOP = 330;
  const BZ = v => bx + (v + GAP + 10) * s, BY = v => by + (YTOP - v) * s;
  o.push(rect(BZ(-GAP - 10), BY(YTOP), 10 * s, YTOP * s, { fill: GLASS, stroke: '#9bb7d0' }));
  o.push(text(BZ(-GAP - 5), BY(YTOP) - 10, 'glass', { size: 12, anchor: 'middle', fill: DIM }));
  // free stile beyond the cut, in outline
  o.push(rect(BZ(0), BY(YTOP), D50 * s, YTOP * s, { fill: '#fbe3d1', stroke: BAR50_EDGE, sw: 1, dash: '5 3' }));
  // vertical rod beyond (back layer)
  o.push(rect(BZ(Z_V - ROD_D / 2), BY(YTOP), ROD_D * s, (YTOP - T) * s, { fill: '#9fbbe0', stroke: ROD_EDGE }));
  // bottom rail, cut
  o.push(rect(BZ(0), BY(T), D25 * s, T * s, { fill: BAR25, stroke: BAR25_EDGE, sw: 1.2 }));
  // horizontal rod at 290, cut
  o.push(circle(BZ(Z_H), BY(YH[0]), ROD_D / 2 * s, { fill: ROD, stroke: ROD_EDGE }));
  o.push(dimV(BY(T), BY(0), BZ(0) - 10, '5'));
  o.push(dimV(BY(YH[0]), BY(0), BZ(-GAP - 10) - 14, '290'));
  o.push(dimH(BZ(0), BZ(D25), BY(0) + 26, '25'));
  o.push(dimH(BZ(0), BZ(D50), BY(0) + 58, '50 (free stile, beyond)'));
  o.push(dimH(BZ(-GAP), BZ(0), BY(0) + 90, '27'));
  const lx = BZ(D50) + 30;
  o.push(leader(lx, BY(YH[0]) - 24, BZ(Z_H) + 16, BY(YH[0]) - 4), lines(lx + 4, BY(YH[0]) - 30, ['horizontal bar, cut', '(front layer, toward the glass)'], { size: 12 }));
  o.push(leader(lx, BY(180), BZ(Z_V) + 15, BY(180)), lines(lx + 4, BY(180) - 4, ['vertical bar beyond', '(back layer)'], { size: 12 }));
  o.push(leader(lx, BY(60), BZ(D50) - 3, BY(60)), lines(lx + 4, BY(60) - 4, ['free stile 50 × 5 beyond', '(dashed outline)'], { size: 12 }));
  o.push(leader(lx, BY(-30), BZ(D25) - 3, BY(T / 2)), lines(lx + 4, BY(-30) + 4, ['bottom rail 25 × 5, cut'], { size: 12 }));
  o.push(text(BZ(10), BY(YTOP) - 26, 'Bottom 330 mm shown. The top end matches.', { size: 12, fill: DIM }));
  files['rfq-6_side-views.svg'] = svg(1000, BY(0) + 130, 'Side views', o.join(''));
}

// ---------------------------------------------------------------- 5. The corner, in 3D
{
  // Isometric view from the room side, above and to the mullion side: sees +X, +Y and +Z faces.
  const k = 2.6, c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
  const P = (x, y, z) => [x0 + (x - z) * c * k, y0 - y * k + (x + z) * sn * k];
  let x0 = 0, y0 = 0;
  const box = (xa, xb, ya, yb, za, zb, fill, edge, shade = [1, 0.86, 0.72]) => {
    const tone = (hex, f) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0')).join('');
    return [
      poly([P(xa, yb, za), P(xb, yb, za), P(xb, yb, zb), P(xa, yb, zb)], { fill: tone(fill, shade[0]), stroke: edge }),  // top (+Y)
      poly([P(xb, ya, za), P(xb, yb, za), P(xb, yb, zb), P(xb, ya, zb)], { fill: tone(fill, shade[1]), stroke: edge }),  // mullion side (+X)
      poly([P(xa, ya, zb), P(xb, ya, zb), P(xb, yb, zb), P(xa, yb, zb)], { fill: tone(fill, shade[2]), stroke: edge }),  // room face (+Z)
    ].join('');
  };
  const XA = 280, YB = 340;
  x0 = 40 - (XA - D50) * c * k; y0 = 120 + YB * k - (XA + 0) * sn * k;
  const o = [title('5. The bottom corner at the free stile, in 3D', 'Seen from the room side, from above. Rods drawn square; round is fine too.')];
  o.push(box(XA, W - T, 0, T, 0, D25, BAR25, BAR25_EDGE));                                    // bottom rail
  o.push(box(XA, W - T, YH[0] - 6, YH[0] + 6, Z_H - 6, Z_H + 6, ROD, ROD_EDGE));              // horizontal rod, front layer
  o.push(box(XV[1] - 6, XV[1] + 6, T, YB, Z_V - 6, Z_V + 6, ROD, ROD_EDGE));                   // vertical rod, back layer
  o.push(box(W - T, W, 0, YB, 0, D50, BAR50, BAR50_EDGE));                                    // free stile
  const lab = (pt, dx, dy, arr, anchor = 'start') => leader(pt[0] + dx, pt[1] + dy, pt[0], pt[1]) + lines(pt[0] + dx + (anchor === 'start' ? 4 : -4), pt[1] + dy + 4, arr, { size: 13, anchor });
  o.push(lab(P(W, 200, D50 / 2), 70, -40, ['free stile 50 × 5', '(next to the mullion)']));
  o.push(lab(P(W, 60, D50), 70, 60, ['its room-side edge sticks out', '25 past the bottom rail']));
  o.push(lab(P(360, T, D25), -40, 70, ['bottom rail 25 × 5'], 'end'));
  o.push(lab(P(375, YH[0] + 6, Z_H), 60, -110, ['horizontal bar at 290,', 'front layer (glass side)']));
  o.push(lab(P(XV[1], 200, Z_V + 6), -60, -40, ['vertical bar,', 'back layer'], 'end'));
  o.push(text(40, P(W, 0, D50)[1] + 80, 'All bars are flush on the window side; only the free stile is deeper.', { size: 13, fill: DIM }));
  files['rfq-5_corner-3d.svg'] = svg(900, P(W, 0, D50)[1] + 110, 'The bottom corner at the free stile', o.join(''));
}

for (const [name, body] of Object.entries(files)) {
  writeFileSync(join(OUT, name), body);
  console.log('wrote diagrams/' + name);
}
