// Geometry for the board merge: lanes leave the main line (x = 0) and drop onto polaroids laid out
// in rows. The drawing uses a 1000-unit-wide viewBox, and the container's aspect ratio is set to
// match it, so one unit is the same length in x and y and the curves keep their shape.
//
// Within a row, the lane that travels farthest runs highest, so lanes never cross each other.
// Lane runs sit in the gap above their row, so they never cross a polaroid either.

export type Spot = { x: number; y: number; d: string }; // polaroid top centre + lane path
export type MergeLayout = { width: number; height: number; polW: number; spots: Spot[] };

const W = 1000;
const POLAROID_RATIO = 0.7; // width / height, frame included

export function mergeLayout(count: number, cols: number, polW: number, left: number, laneGap: number): MergeLayout {
  const polH = polW / POLAROID_RATIO;
  const slot = (W - left) / cols;
  const radius = Math.min(28, laneGap * 1.2);
  const spots: Spot[] = [];
  let y = 0;

  for (let start = 0; start < count; start += cols) {
    const row = Math.min(cols, count - start);
    const zone = laneGap * (row + 1);
    const top = y + zone;
    // Short rows are centred under the full row above them.
    const offset = ((cols - row) * slot) / 2;
    for (let c = 0; c < row; c++) {
      const x = left + offset + slot * (c + 0.5);
      const runY = y + laneGap * (row - c); // farthest lane runs highest
      const d = `M 0 ${runY} H ${x - radius} Q ${x} ${runY} ${x} ${runY + radius} V ${top}`;
      spots.push({ x, y: top, d });
    }
    y = top + polH + laneGap * 1.5;
  }
  return { width: W, height: Math.ceil(y), polW, spots };
}

// Each lane takes one step along the board post's blue-to-red run.
export const laneMix = (i: number, count: number) => (count > 1 ? Math.round((i / (count - 1)) * 100) : 0);

// Small, fixed tilts, like photos hung by hand. Deterministic so server and client agree.
const tilts = [-3.5, 2.5, -1.5, 4, -2.5, 3, -4, 1.5];
export const tilt = (i: number) => tilts[i % tilts.length];
