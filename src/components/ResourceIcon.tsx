import type { CSSProperties } from 'react';
import { resourceIcons } from '@/data/resource-icons';

// The mark beside a resource link: a brand logo in its own color, or a Glaxnimate line glyph in
// the row's lane color that draws on (ResourcesDriver). Decorative: the link names the resource.
export function ResourceIcon({ name }: { name?: string }) {
  const icon = name ? resourceIcons[name] : undefined;
  if (!icon) return <span className="mark mark--empty" aria-hidden="true" />;
  if (icon.kind === 'brand') {
    return (
      <span className="mark mark--brand" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" style={{ '--brand': icon.color } as CSSProperties}>
          <path d={icon.d} />
        </svg>
      </span>
    );
  }
  return (
    <span className="mark mark--glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {icon.d.map((d) => <path key={d} d={d} pathLength={1} data-draw />)}
      </svg>
    </span>
  );
}
