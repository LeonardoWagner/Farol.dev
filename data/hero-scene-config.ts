/**
 * Centralized tunables for the hero scene — the values someone is actually
 * likely to want to tweak (boat look, particle counts, beam intensity)
 * without hunting through LighthouseModel.tsx/SeaLayer.tsx. Geometry-shape
 * constants that are unlikely to change on their own (trapezoid apex/base
 * coordinates, camera position) stay local to the components that use them;
 * this file is for the values a designer or the next session would reach for
 * first.
 */
export const heroSceneConfig = {
  boat: {
    /** Multiplier on top of the base SVG size (70px/82px mobile/desktop). */
    scale: 1,
    hullColorTop: '#6B4A32',
    hullColorBottom: '#3E2A1C',
    sailColorTop: '#EDE3CC',
    sailColorBottom: '#C9B98F',
    flagColor: '#FF6B57',
  },
  particles: {
    /** Inside the beam cone itself — see LighthouseModel.tsx. */
    beam: 26,
    /** Sparse, near-static background field — see HeroParticles.tsx. */
    distant: 34,
    /** Slow drift, some crossing into the beam — see HeroParticles.tsx. */
    medium: 18,
  },
  beam: {
    coreOpacity: 0.7,
    coneOpacity: 0.42,
    haloOpacity: 0.14,
  },
} as const;
