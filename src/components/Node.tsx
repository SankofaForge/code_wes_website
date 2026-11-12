import type { CSSProperties } from 'react';

/** A commit on the main line. Hollow marks one that hasn't happened yet. */
export function Node({ hollow }: { hollow?: boolean }) {
  return (
    <svg className={`node${hollow ? ' node--hollow' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6" />
    </svg>
  );
}

/** A row's color is its place in the list, on the board post's blue-to-red run. */
export const mix = (i: number, n: number) => ({ '--mix': `${Math.round((i / Math.max(1, n - 1)) * 100)}%` }) as CSSProperties;
