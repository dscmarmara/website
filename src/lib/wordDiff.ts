export interface DiffPart {
  type: "same" | "del" | "ins";
  text: string;
}

// Words (Latin letters incl. Turkish, digits), runs of whitespace, and single punctuation marks.
const TOKEN = /[0-9A-Za-zÀ-ɏ]+|\s+|[^0-9A-Za-zÀ-ɏ\s]/g;

/**
 * Word-level difference between two texts (longest common subsequence over
 * tokens). Neighbouring changes separated only by spaces are merged, so a
 * reworded phrase reads as one deletion and one insertion.
 */
export function wordDiff(a: string, b: string): DiffPart[] {
  const x = a.match(TOKEN) ?? [];
  const y = b.match(TOKEN) ?? [];
  // The common start and end need no table.
  let start = 0;
  while (start < x.length && start < y.length && x[start] === y[start]) start++;
  let endX = x.length;
  let endY = y.length;
  while (endX > start && endY > start && x[endX - 1] === y[endY - 1]) {
    endX--;
    endY--;
  }
  const xs = x.slice(start, endX);
  const ys = y.slice(start, endY);
  const n = xs.length;
  const m = ys.length;
  // lcs[i][j] = length of the longest common subsequence of xs[i..] and ys[j..].
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = xs[i] === ys[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const ops: DiffPart[] = x.slice(0, start).map((text) => ({ type: "same", text }));
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (xs[i] === ys[j]) {
      ops.push({ type: "same", text: xs[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ type: "del", text: xs[i++] });
    } else {
      ops.push({ type: "ins", text: ys[j++] });
    }
  }
  while (i < n) ops.push({ type: "del", text: xs[i++] });
  while (j < m) ops.push({ type: "ins", text: ys[j++] });
  for (const text of x.slice(endX)) ops.push({ type: "same", text });
  return tidy(ops);
}

function tidy(ops: DiffPart[]): DiffPart[] {
  const out: DiffPart[] = [];
  let del = "";
  let ins = "";
  let gap = ""; // spaces after a change, held until we know whether the change goes on
  const pushSame = (text: string) => {
    const last = out[out.length - 1];
    if (last?.type === "same") last.text += text;
    else out.push({ type: "same", text });
  };
  const flush = () => {
    if (del) out.push({ type: "del", text: del });
    if (ins) out.push({ type: "ins", text: ins });
    if (gap) pushSame(gap);
    del = ins = gap = "";
  };
  for (const op of ops) {
    if (op.type === "same") {
      if ((del || ins) && /^\s+$/.test(op.text)) {
        gap += op.text;
        continue;
      }
      flush();
      pushSame(op.text);
      continue;
    }
    if (gap) {
      if (del) del += gap;
      if (ins) ins += gap;
      gap = "";
    }
    if (op.type === "del") del += op.text;
    else ins += op.text;
  }
  flush();
  return out;
}
