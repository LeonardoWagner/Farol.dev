'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Invisible enhancer — Process.tsx stays a Server Component with plain markup;
 * this leaf only attaches the scroll-scrubbed connector-line/number highlight
 * on top of it, queried by class name rather than via React refs/children.
 */
export function ProcessScrollFx() {
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const section = document.getElementById('processo');
    if (!section) return;

    const lines = gsap.utils.toArray<HTMLElement>('.process-line', section);
    const numbers = gsap.utils.toArray<HTMLElement>('.process-step > div > span', section);

    gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(numbers, { borderColor: 'var(--border-default)', color: 'var(--color-gray-medium)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.5,
      },
    });

    numbers.forEach((num, i) => {
      tl.to(num, { borderColor: 'var(--color-coral)', color: 'var(--color-coral)', duration: 0.3 }, i);
      if (lines[i]) tl.to(lines[i], { scaleX: 1, duration: 0.4 }, i + 0.1);
    });

    // Fonts swapping in after next/font resolves can shift layout enough to
    // desync scroll-triggered positions measured before that happened.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return null;
}
