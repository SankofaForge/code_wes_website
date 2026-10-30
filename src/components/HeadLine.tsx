'use client';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';
import { declarations } from '@/data/site';
import { motion } from '@/motion/params';

const VALUE = '"We are Code_Wes!"';
const first = declarations[0];

// The 2023 homepage's title, kept: the club's name typed as a declaration in a random language,
// held with a blinking caret, erased, and typed again in another. It runs on GSAP's clock, so it
// pauses with the page, and it has a pause control (WCAG 2.2.2). Reduced motion: the first
// declaration, still.
export function HeadLine() {
  const text = useRef<HTMLSpanElement>(null);
  const lang = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [moving, setMoving] = useState(false);
  const clock = useRef<gsap.core.Timeline | null>(null);

  usePage(() => {
    const el = text.current;
    if (!el || prefersReducedMotion()) return;
    setMoving(true);
    const t = motion.typing;
    let last = 0;

    const cycle = () => {
      let i = Math.floor(Math.random() * declarations.length);
      if (i === last) i = (i + 1) % declarations.length;
      last = i;
      const d = declarations[i];
      const full = d.start + VALUE + d.end;
      const tl = gsap.timeline({ onComplete: cycle });
      const show = (n: number, caret: boolean) => () => { el.textContent = full.slice(0, n) + (caret ? '▌' : ''); };
      tl.call(() => { if (lang.current) lang.current.textContent = d.lang; });
      for (let n = 1; n <= full.length; n++) tl.call(show(n, true), [], `+=${t.type}`);
      for (let b = 0; b < Math.round(t.hold / (t.blink * 2)); b++) {
        tl.call(show(full.length, false), [], `+=${t.blink}`).call(show(full.length, true), [], `+=${t.blink}`);
      }
      for (let n = full.length; n >= 0; n--) tl.call(show(n, true), [], `+=${t.erase}`);
      tl.to({}, { duration: t.pause });
      clock.current = tl;
    };
    // Start from the declaration the server rendered: hold it, then erase it.
    const opening = first.start + VALUE + first.end;
    const tl = gsap.timeline({ onComplete: cycle });
    tl.to({}, { duration: t.hold });
    for (let n = opening.length; n >= 0; n--) tl.call(() => { el.textContent = opening.slice(0, n) + '▌'; }, [], `+=${t.erase}`);
    clock.current = tl;
    return () => { clock.current?.kill(); };
  });

  const toggle = () => {
    const next = !paused;
    setPaused(next);
    clock.current?.paused(next);
  };

  return (
    <div className="headline">
      <h1 className="headline__h1">
        <span className="sr-only">Code_Wes, Wesleyan&rsquo;s coding club</span>
        <span className="headline__code" aria-hidden="true">
          <span ref={text}>{first.start + VALUE + first.end}</span>
        </span>
      </h1>
      <p className="headline__meta">
        <span ref={lang} aria-hidden="true">{first.lang}</span>
        {moving && (
          <button type="button" className="headline__pause" aria-pressed={paused} onClick={toggle}>
            {paused ? 'resume typing' : 'pause typing'}
          </button>
        )}
      </p>
    </div>
  );
}
