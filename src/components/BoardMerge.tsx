'use client';
import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';
import { laneMix, mergeLayout, tilt, type MergeLayout } from '@/lib/merge';
import { drawFrom } from '@/motion/lanes';
import { motion } from '@/motion/params';
import type { Member } from '@/lib/members';
import { Polaroid } from './Polaroid';

gsap.registerPlugin(ScrollTrigger);

type Props = { members: Pick<Member, 'slug' | 'name' | 'role' | 'photo'>[] };

function Lanes({ layout, className }: { layout: MergeLayout; className: string }) {
  const count = layout.spots.length;
  return (
    <svg className={`merge__lanes ${className}`} viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none" aria-hidden="true">
      {layout.spots.map((s, i) => (
        <path key={i} className="lane" data-lane={i} d={s.d} style={{ '--mix': `${laneMix(i, count)}%` } as CSSProperties} />
      ))}
    </svg>
  );
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function BoardMerge({ members }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const desk = mergeLayout(members.length, 4, 190, 70, 16);
  const phone = mergeLayout(members.length, 2, 400, 60, 34);

  usePage(() => {
    const el = root.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('.merge__item')];

    // Hover and focus on a polaroid brighten its own lane, in both drawings.
    const lit = (i: string, on: boolean) =>
      el.querySelectorAll(`.lane[data-lane="${i}"]`).forEach((p) => p.classList.toggle('is-lit', on));
    const off = items.flatMap((item) => {
      const i = item.dataset.i!;
      const enter = () => lit(i, true);
      const leave = () => lit(i, false);
      item.addEventListener('pointerenter', enter);
      item.addEventListener('pointerleave', leave);
      item.addEventListener('focusin', enter);
      item.addEventListener('focusout', leave);
      return [() => {
        item.removeEventListener('pointerenter', enter);
        item.removeEventListener('pointerleave', leave);
        item.removeEventListener('focusin', enter);
        item.removeEventListener('focusout', leave);
      }];
    });

    if (prefersReducedMotion()) return () => off.forEach((f) => f());

    // The signature: scrolled through the merge, each lane draws out of main and its polaroid
    // develops as the line arrives. Both drawings animate together, so a resize across the
    // breakpoint shows the same state.
    const m = motion.merge;
    const emulsions = items.map((item) => item.querySelector('.pol__emulsion'));
    const photos = items.map((item) => item.querySelector('.pol__photo img'));

    gsap.set(emulsions, { opacity: 1 });
    gsap.set(photos, { filter: 'saturate(0) contrast(0.7) brightness(1.4)' });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: el, start: m.start, end: m.end, scrub: m.scrub, invalidateOnRefresh: true },
    });
    items.forEach((_, i) => {
      const at = i * (m.lane - m.overlap);
      const arrive = at + m.lane * 0.95; // the polaroid develops once its lane reaches it
      tl.fromTo(el.querySelectorAll(`.lane[data-lane="${i}"]`), drawFrom, { strokeDashoffset: 0, duration: m.lane }, at)
        .to(emulsions[i], { opacity: 0, duration: m.develop }, arrive)
        .to(photos[i], { filter: 'saturate(1) contrast(1) brightness(1)', duration: m.develop }, arrive);
    });
    return () => off.forEach((f) => f());
  });

  return (
    <div
      ref={root}
      className="merge"
      style={{ '--ar-desk': `${desk.width} / ${desk.height}`, '--ar-phone': `${phone.width} / ${phone.height}` } as CSSProperties}
    >
      <Lanes layout={desk} className="merge__lanes--desk" />
      <Lanes layout={phone} className="merge__lanes--phone" />
      <ul className="merge__list">
        {members.map((m, i) => (
          <li
            key={m.slug}
            className="merge__item"
            data-i={i}
            style={{
              '--dx': pct(desk.spots[i].x, desk.width), '--dy': pct(desk.spots[i].y, desk.height), '--dw': pct(desk.polW, desk.width),
              '--px': pct(phone.spots[i].x, phone.width), '--py': pct(phone.spots[i].y, phone.height), '--pw': pct(phone.polW, phone.width),
              '--tilt': `${tilt(i)}deg`,
            } as CSSProperties}
          >
            <Link href={`/members/${m.slug}/`} className="merge__link">
              <Polaroid name={m.name} role={m.role} photo={m.photo} sizes="(max-width: 767px) 40vw, 18vw" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
