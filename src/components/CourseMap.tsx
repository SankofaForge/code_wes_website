'use client';
import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';
import type { CourseMapLayout } from '@/lib/courseMap';
import { drawFrom } from '@/motion/lanes';
import { motion } from '@/motion/params';

gsap.registerPlugin(ScrollTrigger);

// The prerequisite map as a graph. Pointing at a course traces every lane that leads to it, back to
// the 100-level courses: the path you'd take to get there. The list under the map carries the
// same links for keyboards and screen readers, so the drawing itself is hidden from them.
export function CourseMap({ layout }: { layout: CourseMapLayout }) {
  const root = useRef<HTMLDivElement>(null);

  usePage(() => {
    const el = root.current;
    if (!el) return;
    const edges = layout.edges;
    const chain = (number: string) => {
      const seen = new Set([number]);
      const walk = (n: string) => edges.filter((e) => e.to === n).forEach((e) => { if (!seen.has(e.from)) { seen.add(e.from); walk(e.from); } });
      walk(number);
      return seen;
    };
    const nodes = [...el.querySelectorAll<SVGAElement>('.map__node')];
    const paths = [...el.querySelectorAll<SVGPathElement>('.map__lanes .lane')];
    // "Any one of these" lanes are dashed, and a draw-on would overwrite the dashes, so they fade.
    const solid = paths.filter((p) => !p.classList.contains('lane--any'));
    const dashed = paths.filter((p) => p.classList.contains('lane--any'));
    const trace = (number: string | null) => {
      const on = number ? chain(number) : null;
      el.classList.toggle('is-tracing', !!on);
      nodes.forEach((n) => n.classList.toggle('is-on', !!on?.has(n.dataset.number!)));
      paths.forEach((p) => p.classList.toggle('is-lit', !!on?.has(p.dataset.to!) && on.has(p.dataset.from!)));
    };
    const off = nodes.map((n) => {
      const enter = () => trace(n.dataset.number!);
      const leave = () => trace(null);
      n.addEventListener('pointerenter', enter);
      n.addEventListener('pointerleave', leave);
      return () => {
        n.removeEventListener('pointerenter', enter);
        n.removeEventListener('pointerleave', leave);
      };
    });

    if (!prefersReducedMotion()) {
      // The lanes draw down the map, row by row, as it scrolls into view.
      gsap.timeline({ scrollTrigger: { trigger: el, start: motion.courseMap.start, end: motion.courseMap.end, scrub: motion.courseMap.scrub, invalidateOnRefresh: true } })
        .fromTo(dashed, { opacity: 0 }, { opacity: 1, ease: 'none', stagger: motion.courseMap.stagger, immediateRender: true }, 0)
        .fromTo(solid, drawFrom, { strokeDashoffset: 0, ease: 'none', stagger: motion.courseMap.stagger, immediateRender: true }, 0.1);
    }
    return () => off.forEach((f) => f());
  });

  const { width, height, nodeH, nodes, edges } = layout;
  return (
    <div ref={root} className="map" aria-hidden="true">
      <svg className="map__svg" viewBox={`-8 -8 ${width + 16} ${height + 16}`}>
        <g className="map__lanes">
          {edges.map((e) => (
            <path
              key={`${e.from}-${e.to}`}
              className={`lane${e.anyOf ? ' lane--any' : ''}`}
              d={e.d}
              data-from={e.from}
              data-to={e.to}
              style={{ '--mix': `${e.mix}%` } as CSSProperties}
            />
          ))}
        </g>
        {nodes.map((n) => (
          <a key={n.slug} className="map__node" href={`/resources/courses/${n.slug}/`} tabIndex={-1} data-number={n.number} style={{ '--mix': `${n.mix}%` } as CSSProperties}>
            <rect x={n.x - n.w / 2} y={n.y} width={n.w} height={nodeH} />
            <text className="map__num" x={n.x} y={n.y + 22}>{n.number}</text>
            <text className="map__short" x={n.x} y={n.y + 42}>{n.short}</text>
            {n.extra.length > 0 && <text className="map__extra" x={n.x} y={n.y + 58}>+ {n.extra.join(', ')}</text>}
          </a>
        ))}
      </svg>
    </div>
  );
}
