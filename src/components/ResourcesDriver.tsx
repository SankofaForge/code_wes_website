'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

// Motion for /resources, on GSAP's one clock. Each folder's drawing draws itself on as its row
// arrives, the way lanes draw everywhere else on the site; the glyphs beside its links follow.
// At rest a little keeps moving (the pennant, the cursor, the sparks), paused off screen. Pointing
// at a link redraws its glyph. Reduced motion leaves everything drawn and still.
const DASH = '1 1.2'; // a gap longer than the path, so no round-cap dot shows before the draw
const PIN_TOP = 112; // clears the corner

export function ResourcesDriver() {
  usePage(() => {
    if (prefersReducedMotion()) return;
    const off: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('[data-folder]').forEach((row) => {
      const art = row.querySelector<HTMLElement>('[data-art]');
      const strokes = art ? [...art.querySelectorAll<SVGGeometryElement>('[data-draw]')] : [];
      const pops = art ? [...art.querySelectorAll<SVGElement>('[data-pop]')] : [];
      const glyphs = [...row.querySelectorAll<SVGGeometryElement>('.mark--glyph [data-draw]')];
      const tiles = [...row.querySelectorAll<HTMLElement>('.mark')];

      gsap.set([...strokes, ...glyphs], { strokeDasharray: DASH, strokeDashoffset: 1 });
      gsap.set(pops, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
      gsap.set(tiles, { opacity: 0, y: 8 });

      const draw = gsap.timeline({ paused: true })
        .to(strokes, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: { amount: 0.9 } }, 0)
        .to(pops, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.04 }, 0.8)
        .to(tiles, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }, 0.2)
        .to(glyphs, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out', stagger: 0.05 }, 0.4);
      ScrollTrigger.create({ trigger: row, start: 'top 75%', once: true, onEnter: () => draw.play() });

      // The idle state, only while the drawing is on screen.
      if (art) {
        const idle = gsap.timeline({ paused: true, repeat: -1 });
        art.querySelectorAll('[data-blink]').forEach((el) => {
          idle.to(el, { opacity: 0, duration: 0.01, repeat: 1, yoyo: true, repeatDelay: 0.55 }, 0.55);
        });
        art.querySelectorAll('[data-flutter]').forEach((el) => {
          idle.to(el, { scaleX: 0.82, transformOrigin: '0% 50%', duration: 0.6, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0);
        });
        art.querySelectorAll('[data-twinkle]').forEach((el, i) => {
          idle.to(el, { rotate: 90, transformOrigin: '50% 50%', duration: 1.2, ease: 'expo.inOut' }, i * 0.4);
        });
        if (art.classList.contains('art--courses')) {
          // A lane at a time lights up, the way a course traces its path on the map.
          const lanes = gsap.utils.toArray<SVGElement>(art.querySelectorAll('.art__lane'));
          lanes.forEach((lane, i) => idle.to(lane, { opacity: 0.35, duration: 0.25, repeat: 1, yoyo: true, ease: 'sine.inOut' }, i * 0.18));
        }
        if (idle.getChildren().length) {
          if (idle.duration() < 1.2) idle.to({}, { duration: 1.2 - idle.duration() });
          ScrollTrigger.create({ trigger: art, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive && draw.progress() === 1 ? idle.play() : idle.pause()) });
          draw.eventCallback('onComplete', () => { if (ScrollTrigger.isInViewport(art)) idle.play(); });
        }
      }

      // Pointing at a link redraws its glyph and lifts its tile.
      row.querySelectorAll<HTMLElement>('.shelf li').forEach((li) => {
        const paths = li.querySelectorAll('.mark--glyph [data-draw]');
        if (!paths.length) return;
        const redraw = () => {
          if (draw.progress() < 1) return;
          gsap.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05, overwrite: true });
        };
        li.addEventListener('pointerenter', redraw);
        li.addEventListener('focusin', redraw);
        off.push(() => {
          li.removeEventListener('pointerenter', redraw);
          li.removeEventListener('focusin', redraw);
        });
      });
    });

    // On wide screens each drawing stays beside its folder's links while they scroll past. CSS
    // sticky can't do this inside the smooth-scroll wrapper, so ScrollTrigger pins it instead.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1101px)', () => {
      document.querySelectorAll<HTMLElement>('[data-folder]').forEach((row) => {
        const art = row.querySelector<HTMLElement>(':scope > .art, :scope > .art-link');
        if (!art) return;
        ScrollTrigger.create({
          trigger: art,
          pin: true,
          pinSpacing: false,
          start: `top top+=${PIN_TOP}`,
          endTrigger: row,
          end: () => `bottom top+=${PIN_TOP + art.offsetHeight + 48}`,
          invalidateOnRefresh: true,
        });
      });
    });

    return () => {
      mm.revert();
      off.forEach((f) => f());
    };
  });
  return null;
}
