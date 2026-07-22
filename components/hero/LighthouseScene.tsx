'use client';

import { Suspense, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { HeroFallback } from './HeroFallback';

const LighthouseCanvas = dynamic(() => import('./LighthouseCanvas'), { ssr: false });

const MOBILE_BREAKPOINT = 768;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

// One synchronous snapshot combining all three gates — no effect+state needed,
// and no risk of the "stale value from an earlier render" race that an
// effect-based version would have between reduced-motion, viewport, and WebGL.
function getSnapshot() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  if (window.innerWidth < MOBILE_BREAKPOINT) return false;
  return supportsWebGL();
}

function getServerSnapshot() {
  return false;
}

type LighthouseSceneProps = {
  /** Whether the moon's beam-control mode is on. */
  interactive?: boolean;
  /** 3D mode only: continuous mouse-follow, read per-frame, never React state. */
  pointerXRef?: React.RefObject<number>;
  /** Fallback mode only: click-to-target angle in degrees (see HeroVisual). */
  svgAngle?: number;
  /** 3D mode only: fired every frame with sin(beamAngle) so the sea layer's
   * reflection glow can track it without React state. */
  onAngleChange?: (normalized: number) => void;
};

/**
 * Renders the static fallback by default (SSR-safe, no hydration mismatch —
 * matches what the server sent). Only after mount, if the device passes every
 * gate (no reduced-motion, wide enough viewport, WebGL available), does it
 * swap to the dynamically-imported R3F canvas. Mobile/reduced-motion/no-WebGL
 * stay on the fallback permanently — not a "lighter" 3D mode, no 3D at all.
 */
export function LighthouseScene({ interactive, pointerXRef, svgAngle, onAngleChange }: LighthouseSceneProps) {
  const canUse3D = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!canUse3D) {
    return <HeroFallback rotation={svgAngle} />;
  }

  return (
    <Suspense fallback={<HeroFallback rotation={svgAngle} />}>
      <LighthouseCanvas interactive={interactive} pointerXRef={pointerXRef} onAngleChange={onAngleChange} />
    </Suspense>
  );
}
