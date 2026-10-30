'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';
import { motion } from '@/motion/params';

gsap.registerPlugin(ScrollTrigger);

export const REF_EVENT = 'cw:ref';
export const announceRef = (ref: string) =>
  dispatchEvent(new CustomEvent(REF_EVENT, { detail: { ref, path: location.pathname } }));

// One driver for the log: scroll position decides how far the main line has drawn and which
// commit the corner names. Renders nothing.
export function LogDriver() {
  usePage(() => {
    const log = document.querySelector<HTMLElement>('[data-log]');
    if (!log) return;
    const rows = [...log.querySelectorAll<HTMLElement>('[data-ref]')];
    rows.forEach((row) => ScrollTrigger.create({
      trigger: row,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => { if (self.isActive) announceRef(row.dataset.ref!); },
    }));
    if (prefersReducedMotion()) return;
    gsap.fromTo(log.querySelector('.rail__fill'), { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: log, start: motion.rail.start, end: motion.rail.end, scrub: true, invalidateOnRefresh: true },
    });
  });
  return null;
}
