'use client';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';
import { drawFrom } from '@/motion/lanes';
import { motion } from '@/motion/params';

// Checking out a member's branch: their lane forks off the main line and runs to the polaroid,
// which develops when the line arrives. Plays once with the page intro.
export function ProfileLane({ mix, children }: { mix: number; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  usePage(({ intro }) => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const lane = el.querySelector('.lane');
    const emulsion = el.querySelector('.pol__emulsion');
    const photo = el.querySelector('.pol__photo img');
    const t = motion.profileLane;
    gsap.set(emulsion, { opacity: 1 });
    gsap.set(photo, { filter: 'saturate(0) contrast(0.7) brightness(1.4)' });
    intro.add(
      gsap.timeline()
        .fromTo(lane, drawFrom, { strokeDashoffset: 0, duration: t.duration, ease: 'power2.inOut', immediateRender: true })
        .to(emulsion, { opacity: 0, duration: t.develop, ease: 'power1.out' }, '-=0.2')
        .to(photo, { filter: 'saturate(1) contrast(1) brightness(1)', duration: t.develop, ease: 'power1.out' }, '<'),
      0,
    );
  });

  return (
    <div ref={root} className="branch" style={{ '--mix': `${mix}%` } as CSSProperties}>
      {/* Spans from the main line to the polaroid's top centre (sized in CSS). */}
      <svg className="branch__lane" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="lane" d="M 0 0 V 30 Q 0 60 60 60 H 940 Q 1000 60 1000 90 V 100" />
      </svg>
      {children}
    </div>
  );
}
