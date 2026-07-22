import { heroSceneConfig } from '@/data/hero-scene-config';

/**
 * Sea + boat as a flat 2D layer (SVG + CSS animation), not part of the R3F
 * scene. The earlier shader-based water lived in 3D and had to be viewed at
 * the hero camera's ~6° grazing angle, which turned any real geometric wave
 * displacement into a broken, "scribbled" self-occlusion mess — no amplitude
 * was both subtle enough to look calm and large enough to read as water. A
 * flat layer sidesteps that entirely: smooth tileable bezier paths drifting
 * sideways at three slow, independent speeds read as calm, organic water,
 * and the boat can be positioned with plain CSS well clear of the text
 * column instead of wherever 3D camera projection happened to place it.
 */

type WaveLayerConfig = {
  baseline: number;
  amplitude: number;
  opacity: number;
  fill: string;
  durationS: number;
};

const LAYERS: WaveLayerConfig[] = [
  { baseline: 58, amplitude: 12, opacity: 0.4, fill: '#121a2e', durationS: 95 },
  { baseline: 100, amplitude: 20, opacity: 0.58, fill: '#1b2740', durationS: 68 },
  { baseline: 148, amplitude: 28, opacity: 0.85, fill: '#28395e', durationS: 42 },
];

function wavePath(baseline: number, amplitude: number) {
  const b = baseline;
  const a = amplitude;
  return `M0,${b} Q75,${b - a} 150,${b} T300,${b} T450,${b} T600,${b} L600,200 L0,200 Z`;
}

function WaveTile({ config }: { config: WaveLayerConfig }) {
  const d = wavePath(config.baseline, config.amplitude);
  return (
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="h-full w-1/2 shrink-0">
      <path d={d} fill={config.fill} opacity={config.opacity} />
    </svg>
  );
}

function WaveLayer({ config }: { config: WaveLayerConfig }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full w-[200%]"
        style={{ animation: `wave-drift ${config.durationS}s linear infinite` }}
      >
        <WaveTile config={config} />
        <WaveTile config={config} />
      </div>
    </div>
  );
}

// Base size bumped again from the previous pass (70px/82px → 84px/98px, ~20%)
// plus a config-driven scale multiplier on top, for whoever tunes this next.
// Hull/sail read as timber and canvas now (brown hull, aged-cream sail,
// small coral flag) — a classic small explorer's boat, not a navy/grey hull.
function Boat() {
  const { hullColorTop, hullColorBottom, sailColorTop, sailColorBottom, flagColor, scale } =
    heroSceneConfig.boat;
  return (
    <div
      className="absolute right-[14%] bottom-[24%] h-[84px] w-[84px] sm:h-[98px] sm:w-[98px]"
      style={{ animation: 'boat-bob 4.5s ease-in-out infinite', transform: `scale(${scale})` }}
    >
      <svg viewBox="0 0 64 72" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={hullColorTop} />
            <stop offset="100%" stopColor={hullColorBottom} />
          </linearGradient>
          <linearGradient id="sailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={sailColorTop} />
            <stop offset="100%" stopColor={sailColorBottom} />
          </linearGradient>
        </defs>

        {/* Grounding shadow on the water */}
        <ellipse cx="32" cy="54.5" rx="24" ry="5" fill="#04070d" opacity="0.42" />

        {/* Reflection — flattened, faint, catches the lantern's warmth too */}
        <g opacity="0.18" transform="translate(0,58) scale(1,-0.48)">
          <path d="M7,46 Q32,61 57,46 L50,55 Q32,65 14,55 Z" fill={hullColorBottom} />
          <path d="M32,9 Q52,26 32,45 Z" fill={sailColorTop} />
        </g>

        {/* Hull — a couple of plank lines suggest timber without extra detail */}
        <path
          d="M7,46 Q32,61 57,46 L50,55 Q32,65 14,55 Z"
          fill="url(#hullGrad)"
          stroke="#2A1B10"
          strokeWidth="1"
        />
        <path d="M11,49.5 Q32,57.5 53,49.5" fill="none" stroke="#2A1B10" strokeWidth="0.6" opacity="0.4" />
        <path d="M13,53 Q32,60.5 51,53" fill="none" stroke="#2A1B10" strokeWidth="0.6" opacity="0.35" />
        {/* Mast */}
        <line x1="32" y1="44" x2="32" y2="6" stroke="#D8C7A8" strokeWidth="1.5" />
        {/* Small flag, catching the coral light */}
        <path d="M32,6 L44,9.5 L32,13 Z" fill={flagColor} opacity="0.85" />
        {/* Sail — curved, wind-filled, aged canvas */}
        <path d="M32,9 Q52,26 32,45 Z" fill="url(#sailGrad)" stroke="#A8956D" strokeWidth="0.75" />
        {/* Top-edge highlight, catching the lantern's warmth */}
        <path d="M8,46.5 Q32,60 56,46.5" fill="none" stroke="#FFB68F" strokeWidth="1.2" opacity="0.5" />
      </svg>
    </div>
  );
}

export function SeaLayer({ glowRef }: { glowRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] sm:h-[38%]">
      {/* Warm patch suggesting the lantern's light falling on the water — its
          horizontal position (--beam-x) is pushed by HeroVisual every frame
          from the same angle driving the 3D beam, via direct style mutation
          (no React state), so it tracks the beam instead of sitting static. */}
      <div
        ref={glowRef}
        className="absolute -top-10 h-32 w-[45%] rounded-full opacity-50 blur-3xl"
        style={{
          left: 'var(--beam-x, 58%)',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(255,140,110,0.3) 0%, rgba(138,92,255,0.12) 55%, transparent 80%)',
        }}
      />
      {LAYERS.map((layer, i) => (
        <WaveLayer key={i} config={layer} />
      ))}
      <Boat />
    </div>
  );
}
