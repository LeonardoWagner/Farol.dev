export type LightingVariant =
  | 'hero'
  | 'about'
  | 'services'
  | 'process'
  | 'projects'
  | 'manifest'
  | 'contact'
  | 'footer';

export type GlowColor = 'coral' | 'blue' | 'purple' | 'teal';

export type GlowConfig = {
  color: GlowColor;
  /** CSS position (e.g. '10%', '-5%') — glows are allowed to bleed past the
   * section edge slightly, matching the hero's own ambient blobs. */
  x: string;
  y: string;
  size: number;
  opacity: number;
  blur: number;
  durationS: number;
  delayS: number;
};

export type LightingPreset = {
  glows: GlowConfig[];
};

// Centralized so every section's ambient lighting is a data change here, not
// a bespoke composition per section. Durations are deliberately uneven and
// un-synced (part 8 of the brief: "não sincronizar todas as luzes") — no two
// glows in a preset share both duration and delay.
export const LIGHTING_PRESETS: Record<LightingVariant, LightingPreset> = {
  hero: {
    // Not rendered via SectionLighting — the hero has its own bespoke
    // HeroVisual/LighthouseModel/SeaLayer composition. Kept here for type
    // completeness/consistency with the rest of the preset table.
    glows: [
      { color: 'coral', x: '68%', y: '10%', size: 600, opacity: 0.18, blur: 100, durationS: 14, delayS: 0 },
      { color: 'blue', x: '30%', y: '80%', size: 500, opacity: 0.12, blur: 110, durationS: 18, delayS: 4 },
    ],
  },
  about: {
    glows: [
      { color: 'coral', x: '-8%', y: '18%', size: 420, opacity: 0.16, blur: 95, durationS: 16, delayS: 0 },
      { color: 'purple', x: '88%', y: '72%', size: 380, opacity: 0.13, blur: 100, durationS: 20, delayS: 3 },
    ],
  },
  services: {
    glows: [
      { color: 'blue', x: '4%', y: '8%', size: 400, opacity: 0.14, blur: 95, durationS: 15, delayS: 0 },
      { color: 'coral', x: '94%', y: '55%', size: 360, opacity: 0.15, blur: 90, durationS: 19, delayS: 5 },
      { color: 'teal', x: '55%', y: '96%', size: 320, opacity: 0.11, blur: 100, durationS: 22, delayS: 2 },
    ],
  },
  process: {
    glows: [
      { color: 'purple', x: '8%', y: '85%', size: 380, opacity: 0.12, blur: 100, durationS: 17, delayS: 1 },
      { color: 'blue', x: '90%', y: '10%', size: 360, opacity: 0.12, blur: 100, durationS: 21, delayS: 6 },
    ],
  },
  projects: {
    glows: [
      { color: 'purple', x: '12%', y: '25%', size: 440, opacity: 0.14, blur: 105, durationS: 20, delayS: 0 },
      { color: 'blue', x: '90%', y: '78%', size: 400, opacity: 0.13, blur: 105, durationS: 24, delayS: 5 },
    ],
  },
  manifest: {
    glows: [
      { color: 'purple', x: '50%', y: '50%', size: 620, opacity: 0.16, blur: 110, durationS: 16, delayS: 0 },
      { color: 'coral', x: '78%', y: '30%', size: 340, opacity: 0.13, blur: 95, durationS: 20, delayS: 4 },
    ],
  },
  contact: {
    glows: [
      { color: 'coral', x: '30%', y: '20%', size: 460, opacity: 0.16, blur: 100, durationS: 15, delayS: 0 },
      { color: 'purple', x: '75%', y: '80%', size: 420, opacity: 0.14, blur: 105, durationS: 19, delayS: 4 },
    ],
  },
  footer: {
    glows: [{ color: 'purple', x: '50%', y: '0%', size: 500, opacity: 0.08, blur: 110, durationS: 24, delayS: 0 }],
  },
};
