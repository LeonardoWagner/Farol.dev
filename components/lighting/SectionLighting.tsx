'use client';

import { useEffect, useRef, useState } from 'react';
import { BrandGlow } from '@/components/brand/BrandGlow';
import { LIGHTING_PRESETS, type LightingVariant } from '@/lib/lighting-presets';

/**
 * Drops a section's ambient-lighting preset in as a single absolutely
 * positioned, `pointer-events-none` background layer — `<SectionLighting
 * variant="services" />` inside a `relative isolate overflow-hidden`
 * section, nothing else to wire up per section.
 *
 * Animations pause via IntersectionObserver once the section scrolls out of
 * view (a real perf win even though the CSS animations are transform/opacity
 * only — no sense animating a dozen off-screen sections at once on a long
 * page). `prefers-reduced-motion` is handled independently, globally, in
 * globals.css — this observer is purely an off-screen optimization, not the
 * reduced-motion mechanism.
 */
export function SectionLighting({ variant }: { variant: LightingVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts true (SSR-safe default matches "visible") — corrected after mount
  // once we can actually observe. Wrong for one frame at worst, never causes
  // a hydration mismatch since the server never renders animation state.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '200px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const preset = LIGHTING_PRESETS[variant];

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {preset.glows.map((glow, i) => (
        <BrandGlow
          key={i}
          color={glow.color}
          x={glow.x}
          y={glow.y}
          size={glow.size}
          opacity={glow.opacity}
          blur={glow.blur}
          durationS={glow.durationS}
          delayS={glow.delayS}
          paused={!inView}
        />
      ))}
    </div>
  );
}
