'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LighthouseScene } from './LighthouseScene';
import { SeaLayer } from './SeaLayer';
import { Moon } from './Moon';

const MAX_SVG_ANGLE = 26; // degrees — safe swing range for the flat fallback beam
const REFLECTION_CENTER_PCT = 58; // roughly where the lighthouse sits, horizontally
const REFLECTION_SWING_PCT = 20;

/**
 * Owns the beam's interactive-control state and orchestrates the pieces that
 * need it: the 3D/fallback scene, the moon toggle, and the sea layer's
 * reflection glow (which tracks the beam's angle, not just the moon toggle).
 *
 * Two different interaction models by design, not an oversight:
 * - 3D mode: continuous mouse-follow. `pointerXRef` is a plain ref updated on
 *   pointermove — never React state — so tracking the mouse doesn't trigger
 *   a re-render per move event. LighthouseModel's own useFrame reads it, and
 *   reports its angle back out the same way (a callback that mutates a DOM
 *   style property directly) so the water reflection can follow every frame
 *   without a React re-render anywhere in the chain.
 * - Flat SVG fallback: no per-frame loop exists there to continuously ease a
 *   value, so it uses the click-to-target alternative from the brief instead
 *   — one state update per click, animated by a plain CSS transition.
 */
export function HeroVisual() {
  const [interactive, setInteractive] = useState(false);
  const [svgAngle, setSvgAngle] = useState(0);
  const pointerXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reflectionGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const normalized = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerXRef.current = Math.max(-1, Math.min(1, normalized));
    };
    el.addEventListener('pointermove', handleMove);
    return () => el.removeEventListener('pointermove', handleMove);
  }, [interactive]);

  // Direct DOM mutation, not setState — this fires every animation frame from
  // inside the R3F loop, so putting it through React would mean a re-render
  // per frame for the one property (a left offset) that actually needs it.
  const handleBeamAngleChange = useCallback((normalized: number) => {
    const el = reflectionGlowRef.current;
    if (!el) return;
    const pct = REFLECTION_CENTER_PCT + normalized * REFLECTION_SWING_PCT;
    el.style.setProperty('--beam-x', `${pct}%`);
  }, []);

  const handleAimClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const normalized = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const clamped = Math.max(-1, Math.min(1, normalized));
    setSvgAngle(clamped * MAX_SVG_ANGLE);
    // The fallback path has no per-frame loop to drive the reflection glow,
    // so nudge it once, in the same click, to roughly the clicked side.
    handleBeamAngleChange(clamped);
  };

  // Derived, not synced via effect+setState: svgAngle only means anything
  // while interactive, so falling back to 0 the instant it's off is just a
  // render-time computation, not state that needs resetting.
  const effectiveSvgAngle = interactive ? svgAngle : 0;

  return (
    <div ref={containerRef} className="absolute inset-0" onClick={handleAimClick}>
      <LighthouseScene
        interactive={interactive}
        pointerXRef={pointerXRef}
        svgAngle={effectiveSvgAngle}
        onAngleChange={handleBeamAngleChange}
      />
      <SeaLayer glowRef={reflectionGlowRef} />
      <Moon active={interactive} onClick={() => setInteractive((v) => !v)} />
    </div>
  );
}
