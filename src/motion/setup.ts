// Global motion: the "checkout" page transition. The curtain repaints the screen in bands from
// the top, like a terminal redrawing, and names the path being checked out.
import { gsap } from 'gsap';
import { setTransition } from '@/engine';
import { motion } from './params';

let target = '';

function refFor(href: string) {
  const path = new URL(href, location.href).pathname.replace(/^\/|\/$/g, '');
  return path === '' ? 'main' : path;
}

export function setupMotion() {
  addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.('a');
    if (a?.href) target = refFor(a.href);
  }, true);

  setTransition({
    leave: (c) => {
      const bands = c.querySelectorAll('.curtain__band');
      const label = c.querySelector('.curtain__ref');
      const ref = c.querySelector('[data-curtain-ref]');
      if (ref) ref.textContent = target;
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .set(label, { autoAlpha: 0 })
        .fromTo(bands, { scaleY: 0, transformOrigin: '50% 0%' }, {
          scaleY: 1, duration: motion.checkout.band, ease: 'power2.in', stagger: motion.checkout.stagger,
        })
        .to(label, { autoAlpha: 1, duration: 0.15 }, '-=0.1');
    },
    enter: (c) => gsap.timeline()
      .to(c.querySelector('.curtain__ref'), { autoAlpha: 0, duration: 0.15 })
      .to(c.querySelectorAll('.curtain__band'), {
        scaleY: 0, transformOrigin: '50% 100%', duration: motion.checkout.band, ease: 'power2.out', stagger: motion.checkout.stagger,
      })
      .set(c, { autoAlpha: 0 }),
  });
}
