'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/Button';
import { WHATSAPP_URL } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { DURATION, GSAP_EASE_OUT } from '@/lib/motion-tokens';

const HIGHLIGHTS = ['Design com propósito', 'Performance real', 'Entrega ponta a ponta'];

export function HeroContent() {
  const scope = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      // gsap.from() sets the initial state and animates in the same call, only
      // after mount — avoids a flash-of-invisible-content that a hardcoded
      // `opacity: 0` in CSS/inline style would cause for above-the-fold text.
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE_OUT } });
      tl.from('.hero-eyebrow', { opacity: 0, y: 12, duration: DURATION.normal })
        .from('.hero-title', { opacity: 0, y: 20, duration: DURATION.slow }, '-=0.1')
        .from('.hero-subtitle', { opacity: 0, y: 16, duration: DURATION.normal }, '-=0.2')
        .from('.hero-ctas', { opacity: 0, y: 16, duration: DURATION.normal }, '-=0.2')
        .from(
          '.hero-highlight',
          { opacity: 0, y: 8, duration: DURATION.fast, stagger: 0.08 },
          '-=0.15',
        );
    },
    { scope, dependencies: [reducedMotion] },
  );

  return (
    <div ref={scope} className="relative max-w-xl pointer-events-auto">
      <p className="hero-eyebrow mb-5 font-body text-xs font-semibold tracking-wide text-(--text-secondary) uppercase">
        Software Studio
      </p>
      <h1 className="hero-title font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
        Construímos produtos digitais <span className="text-coral">com direção</span>.
      </h1>
      <p className="hero-subtitle mt-6 max-w-md text-body-l leading-relaxed text-(--text-secondary)">
        Farol.dev é um software studio: landing pages, sites e sistemas construídos com clareza,
        performance e estratégia — para tirar sua ideia do papel e colocar no mundo.
      </p>

      <div className="hero-ctas mt-9 flex flex-wrap items-center gap-4">
        <Button href={WHATSAPP_URL} size="lg">
          Falar com a gente
        </Button>
        <Button href="#projetos" variant="outline" size="lg">
          Ver projetos
        </Button>
      </div>

      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item}
            className="hero-highlight flex items-center gap-2 font-mono text-xs text-(--text-secondary)"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
