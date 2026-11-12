import type { Course } from './content';

// The prerequisite map. Rows run down the major: 100-level courses, the gateway sequence one
// course per row, the 300-level cores, then electives. Every arrow is a lane from a course to one
// that needs it. Prerequisites outside COMP (MATH 228) are written on the node instead of drawn,
// so their lines don't cross the whole map.

export type MapNode = { slug: string; number: string; short: string; x: number; y: number; w: number; mix: number; extra: string[] };
export type MapEdge = { from: string; to: string; d: string; anyOf: boolean; mix: number };
export type CourseMapLayout = { width: number; height: number; nodeH: number; nodes: MapNode[]; edges: MapEdge[] };

const W = 1000;
const NODE_H = 66;
const ROW_GAP = 64;

export function courseMapLayout(courses: Course[]): CourseMapLayout {
  // The gateway sequence gets one row per step: a gateway course sits below the gateway it needs.
  const gatewayDepth = new Map<string, number>();
  const depth = (c: Course): number => {
    if (gatewayDepth.has(c.number)) return gatewayDepth.get(c.number)!;
    const parents = c.requires.flat().map((n) => courses.find((p) => p.number === n && p.kind === 'gateway')).filter(Boolean) as Course[];
    const d = parents.length ? 1 + Math.max(...parents.map(depth)) : 0;
    gatewayDepth.set(c.number, d);
    return d;
  };
  const gateways = courses.filter((c) => c.kind === 'gateway');
  const gatewayRows = gateways.length ? 1 + Math.max(...gateways.map(depth)) : 0;
  const rowOf = (c: Course) =>
    c.kind === 'intro' ? 0 : c.kind === 'gateway' ? 1 + depth(c) : c.kind === 'core' ? 1 + gatewayRows : 2 + gatewayRows;

  const rows: Course[][] = [];
  for (const c of courses) (rows[rowOf(c)] ??= []).push(c);
  const filled = rows.filter(Boolean);

  const nodes: MapNode[] = [];
  filled.forEach((row, r) => {
    const slot = W / row.length;
    const w = Math.min(150, slot - 14);
    row.forEach((c, i) =>
      nodes.push({
        slug: c.slug,
        number: c.number,
        short: c.short,
        x: slot * (i + 0.5),
        y: r * (NODE_H + ROW_GAP),
        w,
        mix: Math.round((r / Math.max(1, filled.length - 1)) * 100),
        extra: c.requires.flat().filter((n) => !n.startsWith('COMP ')),
      }),
    );
  });

  const at = new Map(nodes.map((n) => [n.number, n]));
  const rowY = (r: number) => r * (NODE_H + ROW_GAP);
  const rowNodes = (r: number) => nodes.filter((n) => n.y === rowY(r)).sort((a, b) => a.x - b.x);

  // Where a lane can cross a row without running through a course: its own line if that's clear,
  // otherwise the nearest gap between two courses.
  const crossing = (r: number, want: number) => {
    const row = rowNodes(r);
    const clear = (x: number) => row.every((n) => Math.abs(x - n.x) > n.w / 2 + 6);
    if (clear(want)) return want;
    const gaps = [row[0].x - row[0].w / 2 - 12, ...row.slice(1).map((n, i) => (row[i].x + row[i].w / 2 + n.x - n.w / 2) / 2), row.at(-1)!.x + row.at(-1)!.w / 2 + 12];
    return gaps.reduce((best, g) => (Math.abs(g - want) < Math.abs(best - want) ? g : best));
  };

  const edges: MapEdge[] = [];
  for (const c of courses) {
    const to = at.get(c.number)!;
    for (const group of c.requires) {
      for (const n of group) {
        const from = at.get(n);
        if (!from) continue;
        const r1 = from.y / (NODE_H + ROW_GAP);
        const r2 = to.y / (NODE_H + ROW_GAP);
        let x = from.x;
        let y = from.y + NODE_H;
        let d = `M ${x} ${y}`;
        // A lane that skips rows drops through each one at a clear spot.
        for (let r = r1 + 1; r < r2; r++) {
          const cx = crossing(r, from.x + ((to.x - from.x) * (r - r1)) / (r2 - r1));
          const top = rowY(r);
          const mid = (y + top) / 2;
          d += ` C ${x} ${mid} ${cx} ${mid} ${cx} ${top} V ${top + NODE_H}`;
          x = cx;
          y = top + NODE_H;
        }
        const mid = (y + to.y) / 2;
        d += ` C ${x} ${mid} ${to.x} ${mid} ${to.x} ${to.y}`;
        edges.push({ from: from.number, to: c.number, d, anyOf: group.length > 1, mix: from.mix });
      }
    }
  }

  return { width: W, height: (filled.length - 1) * (NODE_H + ROW_GAP) + NODE_H + 4, nodeH: NODE_H, nodes, edges };
}
