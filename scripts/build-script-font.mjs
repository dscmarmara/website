// Builds the hero headings' script font, "DSC Script", from Condiment:
//
//   node scripts/build-script-font.mjs
//
// Condiment (OFL, src/fonts/condiment/) lacks five Turkish letters: Ğ ğ İ Ş ş.
// They are added here from Condiment's own letters and accents (G/g + breve,
// I + dot accent, S/s + cedilla), placed the way the font places its own
// accents (Ç/ç, Ö, Ï, the dot of i), and get the kerning of their base letter.
// The OFL reserves the name "Condiment" for the original, so the result is
// renamed. Output: src/fonts/dsc-script/DSCScript-Regular.ttf (next to OFL.txt).
// No dependencies: a minimal TrueType reader/writer for the tables touched.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE = path.join(root, "src/fonts/condiment/Condiment-Regular.ttf");
export const OUTPUT = path.join(root, "src/fonts/dsc-script/DSCScript-Regular.ttf");
const FAMILY = "DSC Script";
const POSTSCRIPT = "DSCScript-Regular";
const NOTICE = "Turkish letters (Gbreve, gbreve, Idotaccent, Scedilla, scedilla) added by DSC Marmara, 2026.";

// ---------------------------------------------------------------- reading

export function readFont(file) {
  const buf = Buffer.isBuffer(file) ? file : fs.readFileSync(file);
  const tables = new Map();
  for (let i = 0; i < buf.readUInt16BE(4); i++) {
    const r = 12 + i * 16;
    const tag = buf.toString("latin1", r, r + 4);
    const off = buf.readUInt32BE(r + 8);
    tables.set(tag, Buffer.from(buf.subarray(off, off + buf.readUInt32BE(r + 12))));
  }
  const head = tables.get("head");
  const maxp = tables.get("maxp");
  const numGlyphs = maxp.readUInt16BE(4);
  const longLoca = head.readInt16BE(50) === 1;
  const loca = tables.get("loca");
  const offsets = Array.from({ length: numGlyphs + 1 }, (_, g) => (longLoca ? loca.readUInt32BE(g * 4) : loca.readUInt16BE(g * 2) * 2));
  const glyf = tables.get("glyf");
  const glyphs = Array.from({ length: numGlyphs }, (_, g) => glyf.subarray(offsets[g], offsets[g + 1]));
  const hmtx = tables.get("hmtx");
  const nHM = tables.get("hhea").readUInt16BE(34);
  const metrics = Array.from({ length: numGlyphs }, (_, g) =>
    g < nHM
      ? { adv: hmtx.readUInt16BE(g * 4), lsb: hmtx.readInt16BE(g * 4 + 2) }
      : { adv: hmtx.readUInt16BE((nHM - 1) * 4), lsb: hmtx.readInt16BE(nHM * 4 + (g - nHM) * 2) }
  );
  return { tables, glyphs, metrics, cmap: readCmap(tables.get("cmap")) };
}

function readCmap(cmap) {
  const map = new Map();
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const pid = cmap.readUInt16BE(4 + i * 8);
    const off = cmap.readUInt32BE(8 + i * 8);
    if (cmap.readUInt16BE(off) !== 4 || (pid !== 3 && pid !== 0)) continue;
    const segX2 = cmap.readUInt16BE(off + 6);
    const ends = off + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
    for (let s = 0; s < segX2 / 2; s++) {
      const end = cmap.readUInt16BE(ends + s * 2), start = cmap.readUInt16BE(starts + s * 2);
      const delta = cmap.readInt16BE(deltas + s * 2), ro = cmap.readUInt16BE(ranges + s * 2);
      for (let c = start; c <= end && c !== 0xffff; c++) {
        let g = ro === 0 ? (c + delta) & 0xffff : cmap.readUInt16BE(ranges + s * 2 + ro + (c - start) * 2);
        if (ro !== 0 && g) g = (g + delta) & 0xffff;
        if (g) map.set(c, g);
      }
    }
  }
  return map;
}

/** Outline of a simple glyph: contours of { x, y, on } points. */
export function parseGlyph(data) {
  if (data.length === 0) return [];
  const n = data.readInt16BE(0);
  if (n < 0) throw new Error("composite glyphs are not supported here");
  const endPts = Array.from({ length: n }, (_, i) => data.readUInt16BE(10 + i * 2));
  let p = 12 + n * 2 + data.readUInt16BE(10 + n * 2);
  const total = n ? endPts[n - 1] + 1 : 0;
  const flags = [];
  while (flags.length < total) {
    const f = data[p++];
    flags.push(f);
    if (f & 8) for (let r = data[p++]; r > 0; r--) flags.push(f);
  }
  const coords = (short, same) => {
    let v = 0;
    return flags.map((f) => {
      if (f & short) v += f & same ? data[p++] : -data[p++];
      else if (!(f & same)) { v += data.readInt16BE(p); p += 2; }
      return v;
    });
  };
  const xs = coords(2, 16);
  const ys = coords(4, 32);
  const contours = [];
  let start = 0;
  for (const end of endPts) {
    contours.push(xs.slice(start, end + 1).map((x, i) => ({ x, y: ys[start + i], on: (flags[start + i] & 1) === 1 })));
    start = end + 1;
  }
  return contours;
}

// ---------------------------------------------------------------- outline helpers

const points = (contours) => contours.flat();
export const bbox = (contours) => {
  const pts = points(contours);
  return { xMin: Math.min(...pts.map((p) => p.x)), yMin: Math.min(...pts.map((p) => p.y)), xMax: Math.max(...pts.map((p) => p.x)), yMax: Math.max(...pts.map((p) => p.y)) };
};
const centerX = (contours) => { const b = bbox(contours); return (b.xMin + b.xMax) / 2; };
const shift = (contours, dx, dy) => contours.map((c) => c.map((p) => ({ x: Math.round(p.x + dx), y: Math.round(p.y + dy), on: p.on })));
/** Mean x of the on-curve points within `band` units of the glyph's lowest (or highest) point. */
const extremeX = (contours, side, band = 12) => {
  const pts = points(contours).filter((p) => p.on);
  const edge = side === "bottom" ? Math.min(...pts.map((p) => p.y)) : Math.max(...pts.map((p) => p.y));
  const near = pts.filter((p) => Math.abs(p.y - edge) <= band);
  return { x: near.reduce((s, p) => s + p.x, 0) / near.length, y: edge };
};

// ---------------------------------------------------------------- the new letters

/**
 * Each new letter = base outline + accent outline moved so that it sits where
 * Condiment puts that kind of accent. `tune` holds hand adjustments (font units)
 * checked against renderings.
 */
export function buildLetters(font, tune = {}) {
  const g = (ch) => parseGlyph(font.glyphs[font.cmap.get(ch.codePointAt(0))]);
  const gid = (ch) => font.cmap.get(ch.codePointAt(0));
  // The accent's contours in an accented letter: the ones entirely above the plain letter.
  const extra = (accented, base) => accented.filter((c) => bbox([c]).yMin > bbox(base).yMax - 10);
  const breve = g("˘"), dot = g("˙"), cedilla = g("¸");
  const t = (k) => tune[k] ?? { dx: 0, dy: 0 };

  // Cedilla, lowercase: ¸ is drawn exactly where ç has it. The s's bottom stroke sits a little
  // further right and lower than the c's, so it is moved by hand (TUNE) to hang from that stroke.
  const scedilla = [...g("s"), ...shift(cedilla, t("scedilla").dx, t("scedilla").dy)];

  // Cedilla, capital: in Ç the tail is fused to the C; its part below the C gives the position.
  const C = g("C"), Ccedilla = g("Ç");
  const tail = points(Ccedilla).filter((p) => p.y < bbox(C).yMin - 6);
  const tailCx = (Math.min(...tail.map((p) => p.x)) + Math.max(...tail.map((p) => p.x))) / 2;
  const CBottom = extremeX(C, "bottom");
  const SBottom = extremeX(g("S"), "bottom");
  const cedB = bbox(cedilla);
  const Scedilla = [
    ...g("S"),
    ...shift(
      cedilla,
      SBottom.x + (tailCx - CBottom.x) - (cedB.xMin + cedB.xMax) / 2 + t("Scedilla").dx,
      SBottom.y + (bbox(Ccedilla).yMin - CBottom.y) - cedB.yMin + t("Scedilla").dy
    ),
  ];

  // Breve, lowercase: the dot of i sits at a slant from the top of its stem; same for the breve over g's bowl.
  const i = g("i"), dotless = g("ı");
  const stemTop = extremeX(dotless, "top");
  const slant = centerX(extra(i, dotless)) - stemTop.x;
  const u = g("u"), uDots = extra(g("ü"), u);
  const gTop = extremeX(g("g"), "top");
  const brB = bbox(breve);
  const gbreve = [
    ...g("g"),
    ...shift(breve, gTop.x + slant - (brB.xMin + brB.xMax) / 2 + t("gbreve").dx, bbox(uDots).yMin - brB.yMin + t("gbreve").dy),
  ];

  // Breve, capital: the dieresis of Ö relative to the top of the O, applied to the G.
  const O = g("O"), Odots = extra(g("Ö"), O);
  const capSlant = centerX(Odots) - extremeX(O, "top").x;
  const GTop = extremeX(g("G"), "top");
  const Gbreve = [
    ...g("G"),
    ...shift(breve, GTop.x + capSlant - (brB.xMin + brB.xMax) / 2 + t("Gbreve").dx, bbox(Odots).yMin - brB.yMin + t("Gbreve").dy),
  ];

  // Dot accent, capital: one dot where the two dots of Ï are centred.
  const I = g("I"), Idots = extra(g("Ï"), I);
  const dotB = bbox(dot);
  const Idotaccent = [
    ...I,
    ...shift(dot, centerX(Idots) - (dotB.xMin + dotB.xMax) / 2 + t("Idotaccent").dx, bbox(Idots).yMin - dotB.yMin + t("Idotaccent").dy),
  ];

  return [
    { cp: 0x011e, name: "Gbreve", base: gid("G"), contours: Gbreve },
    { cp: 0x011f, name: "gbreve", base: gid("g"), contours: gbreve },
    { cp: 0x0130, name: "Idotaccent", base: gid("I"), contours: Idotaccent },
    { cp: 0x015e, name: "Scedilla", base: gid("S"), contours: Scedilla },
    { cp: 0x015f, name: "scedilla", base: gid("s"), contours: scedilla },
  ];
}

// ---------------------------------------------------------------- writing

function encodeGlyph(contours) {
  const pts = points(contours);
  const b = bbox(contours);
  const endPts = [];
  let n = 0;
  for (const c of contours) { n += c.length; endPts.push(n - 1); }
  // Plain 16-bit deltas for every coordinate: larger than packed, but simple and valid.
  const size = 10 + contours.length * 2 + 2 + pts.length + pts.length * 4;
  const out = Buffer.alloc(size + ((4 - (size % 4)) % 4));
  let p = 0;
  out.writeInt16BE(contours.length, p); p += 2;
  for (const v of [b.xMin, b.yMin, b.xMax, b.yMax]) { out.writeInt16BE(v, p); p += 2; }
  for (const e of endPts) { out.writeUInt16BE(e, p); p += 2; }
  out.writeUInt16BE(0, p); p += 2; // no instructions
  for (const pt of pts) out[p++] = pt.on ? 1 : 0;
  let last = 0;
  for (const pt of pts) { out.writeInt16BE(pt.x - last, p); p += 2; last = pt.x; }
  last = 0;
  for (const pt of pts) { out.writeInt16BE(pt.y - last, p); p += 2; last = pt.y; }
  return out;
}

function buildCmap(map) {
  const cps = [...map.keys()].filter((c) => c < 0xffff).sort((a, b) => a - b);
  const segs = [];
  for (const c of cps) {
    const last = segs[segs.length - 1];
    if (last && c === last.end + 1 && map.get(c) === map.get(last.end) + 1) last.end = c;
    else segs.push({ start: c, end: c });
  }
  segs.push({ start: 0xffff, end: 0xffff });
  const segX2 = segs.length * 2;
  const searchRange = 2 * 2 ** Math.floor(Math.log2(segs.length));
  const sub = Buffer.alloc(16 + segs.length * 8);
  sub.writeUInt16BE(4, 0);
  sub.writeUInt16BE(sub.length, 2);
  sub.writeUInt16BE(0, 4);
  sub.writeUInt16BE(segX2, 6);
  sub.writeUInt16BE(searchRange, 8);
  sub.writeUInt16BE(Math.log2(searchRange / 2), 10);
  sub.writeUInt16BE(segX2 - searchRange, 12);
  segs.forEach((s, i) => {
    sub.writeUInt16BE(s.end, 14 + i * 2);
    sub.writeUInt16BE(s.start, 16 + segX2 + i * 2);
    const delta = s.start === 0xffff ? 1 : (map.get(s.start) - s.start) & 0xffff;
    sub.writeUInt16BE(delta, 16 + segX2 * 2 + i * 2);
    sub.writeUInt16BE(0, 16 + segX2 * 3 + i * 2);
  });
  const head = Buffer.alloc(4 + 2 * 8);
  head.writeUInt16BE(0, 0);
  head.writeUInt16BE(2, 2);
  for (const [i, [pid, eid]] of [[0, 3], [3, 1]].entries()) {
    head.writeUInt16BE(pid, 4 + i * 8);
    head.writeUInt16BE(eid, 6 + i * 8);
    head.writeUInt32BE(head.length, 8 + i * 8);
  }
  return Buffer.concat([head, sub]);
}

function buildPost(post, numGlyphsBefore, names) {
  if (post.readUInt32BE(0) !== 0x00020000) throw new Error("expected post format 2");
  const indices = Array.from({ length: numGlyphsBefore }, (_, i) => post.readUInt16BE(34 + i * 2));
  const strings = post.subarray(34 + numGlyphsBefore * 2);
  let custom = 0;
  for (let p = 0; p < strings.length; p += 1 + strings[p]) custom++;
  const added = names.map((n) => Buffer.concat([Buffer.from([n.length]), Buffer.from(n, "latin1")]));
  const out = Buffer.concat([
    post.subarray(0, 32),
    Buffer.alloc(2 + (numGlyphsBefore + names.length) * 2),
    strings,
    ...added,
  ]);
  out.writeUInt16BE(numGlyphsBefore + names.length, 32);
  indices.forEach((v, i) => out.writeUInt16BE(v, 34 + i * 2));
  names.forEach((_, k) => out.writeUInt16BE(258 + custom + k, 34 + (numGlyphsBefore + k) * 2));
  return out;
}

function buildName(name) {
  const count = name.readUInt16BE(2);
  const storage = name.readUInt16BE(4);
  const records = Array.from({ length: count }, (_, i) => {
    const r = 6 + i * 12;
    const rec = { pid: name.readUInt16BE(r), eid: name.readUInt16BE(r + 2), lid: name.readUInt16BE(r + 4), id: name.readUInt16BE(r + 6) };
    const raw = name.subarray(storage + name.readUInt16BE(r + 10), storage + name.readUInt16BE(r + 10) + name.readUInt16BE(r + 8));
    const wide = rec.pid === 3 || rec.pid === 0;
    let text = wide ? Buffer.from(raw).swap16().toString("utf16le") : raw.toString("latin1");
    if (rec.id === 0) text = `${text} ${NOTICE}`;
    if (rec.id === 1 || rec.id === 16) text = FAMILY;
    if (rec.id === 4) text = `${FAMILY} Regular`;
    if (rec.id === 6) text = POSTSCRIPT;
    if (rec.id !== 0 && rec.id !== 13 && rec.id !== 14 && /Condiment/.test(text)) text = text.replace(/Condiment/g, FAMILY);
    rec.data = wide ? Buffer.from(text, "utf16le").swap16() : Buffer.from(text, "latin1");
    return rec;
  });
  const header = Buffer.alloc(6 + count * 12);
  header.writeUInt16BE(0, 0);
  header.writeUInt16BE(count, 2);
  header.writeUInt16BE(header.length, 4);
  let off = 0;
  records.forEach((rec, i) => {
    const r = 6 + i * 12;
    header.writeUInt16BE(rec.pid, r);
    header.writeUInt16BE(rec.eid, r + 2);
    header.writeUInt16BE(rec.lid, r + 4);
    header.writeUInt16BE(rec.id, r + 6);
    header.writeUInt16BE(rec.data.length, r + 8);
    header.writeUInt16BE(off, r + 10);
    off += rec.data.length;
  });
  return Buffer.concat([header, ...records.map((r) => r.data)]);
}

/** Kerning: GPOS with one PairPos format 1 lookup. New letters copy their base letter's pairs, both sides. */
function buildGpos(gpos, letters) {
  const lookupList = gpos.readUInt16BE(8);
  if (gpos.readUInt16BE(lookupList) !== 1) throw new Error("expected one GPOS lookup");
  const lookup = lookupList + gpos.readUInt16BE(lookupList + 2);
  if (gpos.readUInt16BE(lookup) !== 2 || gpos.readUInt16BE(lookup + 4) !== 1) throw new Error("expected one PairPos subtable");
  const st = lookup + gpos.readUInt16BE(lookup + 6);
  if (gpos.readUInt16BE(st) !== 1 || gpos.readUInt16BE(st + 4) !== 4 || gpos.readUInt16BE(st + 6) !== 0) throw new Error("expected PairPos format 1, XAdvance only");
  // Coverage: the first glyphs, in pair-set order.
  const cov = st + gpos.readUInt16BE(st + 2);
  const firsts = [];
  if (gpos.readUInt16BE(cov) === 1) for (let i = 0; i < gpos.readUInt16BE(cov + 2); i++) firsts.push(gpos.readUInt16BE(cov + 4 + i * 2));
  else for (let i = 0; i < gpos.readUInt16BE(cov + 2); i++) { const r = cov + 4 + i * 6; for (let gl = gpos.readUInt16BE(r); gl <= gpos.readUInt16BE(r + 2); gl++) firsts.push(gl); }
  const sets = new Map();
  firsts.forEach((first, i) => {
    const ps = st + gpos.readUInt16BE(st + 10 + i * 2);
    sets.set(first, Array.from({ length: gpos.readUInt16BE(ps) }, (_, k) => ({ second: gpos.readUInt16BE(ps + 2 + k * 4), value: gpos.readInt16BE(ps + 4 + k * 4) })));
  });
  let added = 0;
  for (const pairs of sets.values()) {
    for (const l of letters) {
      const base = pairs.find((p) => p.second === l.base);
      if (base) { pairs.push({ second: l.gid, value: base.value }); added++; }
    }
    pairs.sort((a, b) => a.second - b.second);
  }
  for (const l of letters) if (sets.has(l.base)) { sets.set(l.gid, sets.get(l.base).map((p) => ({ ...p }))); added += sets.get(l.gid).length; }
  // Serialise: subtable header, pair sets, coverage (format 1 list).
  const order = [...sets.keys()].sort((a, b) => a - b);
  const headerLen = 10 + order.length * 2;
  const setBufs = order.map((gl) => {
    const pairs = sets.get(gl);
    const b = Buffer.alloc(2 + pairs.length * 4);
    b.writeUInt16BE(pairs.length, 0);
    pairs.forEach((p, k) => { b.writeUInt16BE(p.second, 2 + k * 4); b.writeInt16BE(p.value, 4 + k * 4); });
    return b;
  });
  const covBuf = Buffer.alloc(4 + order.length * 2);
  covBuf.writeUInt16BE(1, 0);
  covBuf.writeUInt16BE(order.length, 2);
  order.forEach((gl, i) => covBuf.writeUInt16BE(gl, 4 + i * 2));
  const sub = Buffer.alloc(headerLen);
  sub.writeUInt16BE(1, 0);
  sub.writeUInt16BE(4, 4);
  sub.writeUInt16BE(0, 6);
  sub.writeUInt16BE(order.length, 8);
  let off = headerLen;
  setBufs.forEach((b, i) => { sub.writeUInt16BE(off, 10 + i * 2); off += b.length; });
  sub.writeUInt16BE(off, 2);
  const subtable = Buffer.concat([sub, ...setBufs, covBuf]);
  if (8 + subtable.length > 0xffff) throw new Error("GPOS subtable too large for 16-bit offsets");
  // Header, ScriptList and FeatureList stay as they are; the LookupList is rebuilt after them.
  const lookupHead = Buffer.alloc(4 + 8);
  lookupHead.writeUInt16BE(1, 0);
  lookupHead.writeUInt16BE(4, 2);
  lookupHead.writeUInt16BE(2, 4);
  lookupHead.writeUInt16BE(gpos.readUInt16BE(lookup + 2), 6);
  lookupHead.writeUInt16BE(1, 8);
  lookupHead.writeUInt16BE(8, 10);
  return { table: Buffer.concat([gpos.subarray(0, lookupList), lookupHead, subtable]), added };
}

const checksum = (b) => {
  const padded = Buffer.concat([b, Buffer.alloc((4 - (b.length % 4)) % 4)]);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0;
  return sum;
};

function assemble(tables) {
  const tags = [...tables.keys()].sort();
  const n = tags.length;
  const pow = 2 ** Math.floor(Math.log2(n));
  const dir = Buffer.alloc(12 + n * 16);
  dir.writeUInt32BE(0x00010000, 0);
  dir.writeUInt16BE(n, 4);
  dir.writeUInt16BE(pow * 16, 6);
  dir.writeUInt16BE(Math.log2(pow), 8);
  dir.writeUInt16BE(n * 16 - pow * 16, 10);
  const head = tables.get("head");
  head.writeUInt32BE(0, 8);
  let off = dir.length;
  const parts = [dir];
  tags.forEach((tag, i) => {
    const data = tables.get(tag);
    const r = 12 + i * 16;
    dir.write(tag, r, "latin1");
    dir.writeUInt32BE(checksum(data), r + 4);
    dir.writeUInt32BE(off, r + 8);
    dir.writeUInt32BE(data.length, r + 12);
    const padded = Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4)]);
    parts.push(padded);
    off += padded.length;
  });
  const font = Buffer.concat(parts);
  const headOff = dir.readUInt32BE(12 + tags.indexOf("head") * 16 + 8);
  font.writeUInt32BE((0xb1b0afba - checksum(font)) >>> 0, headOff + 8);
  return font;
}

export function buildFont(tune = TUNE()) {
  const font = readFont(SOURCE);
  const numGlyphs = font.glyphs.length;
  const letters = buildLetters(font, tune).map((l, k) => ({ ...l, gid: numGlyphs + k }));
  for (const l of letters) if (font.cmap.has(l.cp)) throw new Error(`U+${l.cp.toString(16)} already in the font`);
  const t = new Map([...font.tables].map(([k, v]) => [k, Buffer.from(v)]));

  // glyf + loca (short offsets: even lengths, total < 128 KiB)
  const glyphBufs = [...font.glyphs.map((g) => Buffer.concat([g, Buffer.alloc(g.length % 2)])), ...letters.map((l) => encodeGlyph(l.contours))];
  const glyf = Buffer.concat(glyphBufs);
  if (glyf.length > 0x1fffe) throw new Error("glyf too large for short loca");
  const loca = Buffer.alloc((glyphBufs.length + 1) * 2);
  let off = 0;
  glyphBufs.forEach((b, i) => { loca.writeUInt16BE(off / 2, i * 2); off += b.length; });
  loca.writeUInt16BE(off / 2, glyphBufs.length * 2);
  t.set("glyf", glyf);
  t.set("loca", loca);

  // hmtx / hhea: base letter's advance, lsb = xMin
  const metrics = [...font.metrics, ...letters.map((l) => ({ adv: font.metrics[l.base].adv, lsb: bbox(l.contours).xMin }))];
  const hmtx = Buffer.alloc(metrics.length * 4);
  metrics.forEach((m, i) => { hmtx.writeUInt16BE(m.adv, i * 4); hmtx.writeInt16BE(m.lsb, i * 4 + 2); });
  t.set("hmtx", hmtx);
  const hhea = t.get("hhea");
  hhea.writeUInt16BE(metrics.length, 34);
  for (const l of letters) {
    const b = bbox(l.contours);
    const adv = font.metrics[l.base].adv;
    hhea.writeInt16BE(Math.min(hhea.readInt16BE(12), b.xMin), 12); // minLeftSideBearing
    hhea.writeInt16BE(Math.min(hhea.readInt16BE(14), adv - b.xMax), 14); // minRightSideBearing
    hhea.writeInt16BE(Math.max(hhea.readInt16BE(16), b.xMax), 16); // xMaxExtent
  }

  // maxp
  const maxp = t.get("maxp");
  maxp.writeUInt16BE(metrics.length, 4);
  if (maxp.readUInt32BE(0) === 0x00010000) {
    for (const l of letters) {
      maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(6), points(l.contours).length), 6);
      maxp.writeUInt16BE(Math.max(maxp.readUInt16BE(8), l.contours.length), 8);
    }
  }

  // head: font bounding box
  const head = t.get("head");
  for (const l of letters) {
    const b = bbox(l.contours);
    head.writeInt16BE(Math.min(head.readInt16BE(36), b.xMin), 36);
    head.writeInt16BE(Math.min(head.readInt16BE(38), b.yMin), 38);
    head.writeInt16BE(Math.max(head.readInt16BE(40), b.xMax), 40);
    head.writeInt16BE(Math.max(head.readInt16BE(42), b.yMax), 42);
  }

  // cmap, post, name, GPOS
  const map = new Map(font.cmap);
  for (const l of letters) map.set(l.cp, l.gid);
  t.set("cmap", buildCmap(map));
  t.set("post", buildPost(t.get("post"), numGlyphs, letters.map((l) => l.name)));
  t.set("name", buildName(t.get("name")));
  const gpos = buildGpos(t.get("GPOS"), letters);
  t.set("GPOS", gpos.table);

  // OS/2: Latin Extended-A (Unicode range bit 2) and the Turkish code page (bit 4)
  const os2 = t.get("OS/2");
  os2.writeUInt32BE((os2.readUInt32BE(42) | (1 << 2)) >>> 0, 42);
  if (os2.length >= 86) os2.writeUInt32BE((os2.readUInt32BE(78) | (1 << 4)) >>> 0, 78);

  return { font: assemble(t), letters, kerningPairsAdded: gpos.added };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { font, letters, kerningPairsAdded } = buildFont();
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, font);
  console.log(`${path.relative(root, OUTPUT)}: ${font.length} bytes, +${letters.map((l) => String.fromCodePoint(l.cp)).join(" ")}, ${kerningPairsAdded} kerning pairs added`);
}

/** Hand adjustments (font units), checked against renderings of the new letters next to Ç, Ö, Ü, ı. */
function TUNE() {
  return {
    scedilla: { dx: 30, dy: -15 },
    Scedilla: { dx: 0, dy: 15 }, // touch the S's bottom curve, as Ç's tail touches the C
  };
}
