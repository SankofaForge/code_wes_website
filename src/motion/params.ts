// Every duration, stagger and scroll range in one place, so motion can be tuned without touching
// components. Scroll ranges are ScrollTrigger start/end strings.
export const motion = {
  checkout: { band: 0.22, stagger: 0.035 },
  rail: { start: 'top 70%', end: 'bottom 70%' },
  merge: { start: 'top 75%', end: 'bottom 85%', scrub: 0.6, lane: 1, develop: 0.7, overlap: 0.35 },
  profileLane: { duration: 1.1, develop: 0.9 },
  typing: { type: 0.05, erase: 0.025, blink: 0.5, hold: 2.4, pause: 0.5 },
} as const;
