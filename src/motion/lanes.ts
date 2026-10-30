// Lanes use `vector-effect: non-scaling-stroke`, so browsers dash them in screen pixels, not in
// path units. Drawing a lane therefore needs its on-screen length, measured through the SVG's
// current scale (x and y can differ when the drawing stretches).
const SAMPLES = 48;

export function screenLength(path: SVGPathElement) {
  const svg = path.ownerSVGElement;
  if (!svg) return 0;
  const box = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  if (!box.width || !vb.width) return 0; // hidden drawing (the other breakpoint's)
  const sx = box.width / vb.width;
  const sy = box.height / vb.height;
  const total = path.getTotalLength();
  let length = 0;
  let prev = path.getPointAtLength(0);
  for (let i = 1; i <= SAMPLES; i++) {
    const p = path.getPointAtLength((total * i) / SAMPLES);
    length += Math.hypot((p.x - prev.x) * sx, (p.y - prev.y) * sy);
    prev = p;
  }
  return length;
}

/** fromTo vars that draw a lane from its start; function values re-measure on refresh. */
export const drawFrom = {
  strokeDasharray: (_: number, el: SVGPathElement) => {
    const len = screenLength(el);
    return `${len} ${len + 2}`;
  },
  strokeDashoffset: (_: number, el: SVGPathElement) => screenLength(el) + 1,
};
