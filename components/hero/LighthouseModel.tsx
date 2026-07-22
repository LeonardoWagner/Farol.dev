'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLATFORM_TOP_Y } from './LighthouseBase';

const LIGHTHOUSE_X = 1.7;
const LIGHTHOUSE_Z = -1;

// Tower body built as three stacked, banded segments instead of one long
// tapered cylinder — this is what actually reads as "lighthouse" rather than
// "obelisk": alternating off-white/navy bands, a gallery that's much wider
// than the tower, and a railing all break up what used to be a single
// unbroken vertical silhouette. Overall tower height is ~25% shorter than
// the previous single-cylinder version (2.6 → 1.95 world units) and the
// base radius is ~36% wider (0.22 → 0.30), per the brief's "shorter, wider,
// less tapered" direction.
const SEG_A_HEIGHT = 0.85; // base segment, off-white
const SEG_B_HEIGHT = 0.65; // mid segment, navy
const SEG_C_HEIGHT = 0.35; // upper segment, off-white
const RING_HEIGHT = 0.05;
const TOWER_HEIGHT = SEG_A_HEIGHT + SEG_B_HEIGHT + SEG_C_HEIGHT + RING_HEIGHT * 2;

const GALLERY_Y = PLATFORM_TOP_Y + TOWER_HEIGHT;
const GALLERY_RADIUS = 0.42;
const RAIL_Y = GALLERY_Y + 0.14;
const LANTERN_ROOM_HEIGHT = 0.32;
const LANTERN_Y = RAIL_Y + 0.05 + LANTERN_ROOM_HEIGHT / 2;
const ROOF_Y = LANTERN_Y + LANTERN_ROOM_HEIGHT / 2 + 0.14;

// 10 evenly spaced guard-rail posts around the gallery — a fixed, deterministic
// layout (not randomized), computed once at module scope since it never
// changes.
const RAIL_POSTS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  return [Math.cos(angle) * (GALLERY_RADIUS - 0.03), Math.sin(angle) * (GALLERY_RADIUS - 0.03)] as const;
});

type TrapezoidSpec = {
  apex: number; // half-width at the near edge
  apexZ: number; // near-edge distance from the lantern (must clear the housing radius)
  baseX: number; // half-width at the far edge
  baseY: number; // vertical drop to the far edge
  baseZ: number; // far-edge distance
};

// Every beam layer is the same hand-built trapezoid shape (narrow near the
// lantern, wide at the water) at a different scale — the widening comes from
// geometry, not a masking calculation, so the shared fragment shader only
// does a cheap color/alpha computation.
function useTrapezoidGeometry(spec: TrapezoidSpec) {
  return useMemo(() => {
    const apexL = [-spec.apex, 0, spec.apexZ];
    const apexR = [spec.apex, 0, spec.apexZ];
    const baseL = [-spec.baseX, -spec.baseY, spec.baseZ];
    const baseR = [spec.baseX, -spec.baseY, spec.baseZ];

    const positions = new Float32Array([...apexL, ...apexR, ...baseR, ...apexL, ...baseR, ...baseL]);
    const uvs = new Float32Array([0.5, 0, 1, 0, 1, 1, 0.5, 0, 1, 1, 0, 1]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    return geometry;
  }, [spec.apex, spec.apexZ, spec.baseX, spec.baseY, spec.baseZ]);
}

// Three concentric layers (core / main cone / atmosphere halo) instead of one
// flat trapezoid — a single shape read as "a 2D triangle stuck on the scene"
// no matter how the shader was tuned. Layering a tight bright core inside a
// wider, softer cone inside an even wider, dimmer halo is what actually sells
// volume/falloff without a real volumetric-lighting render pass.
// apexZ pushed out to clear the lantern room's own radius (~0.24) and its
// mullions — the beam now visibly starts at the windows' edge instead of
// originating from inside the housing geometry.
const CORE_SPEC: TrapezoidSpec = { apex: 0.05, apexZ: 0.27, baseX: 0.9, baseY: 1.5, baseZ: 2.6 };
const CONE_SPEC: TrapezoidSpec = { apex: 0.1, apexZ: 0.31, baseX: 2.9, baseY: 3.3, baseZ: 5.4 };
const HALO_SPEC: TrapezoidSpec = { apex: 0.26, apexZ: 0.35, baseX: 4.1, baseY: 3.35, baseZ: 5.6 };

const beamVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// One shared shader for all three layers, parametrized per-instance via
// uniforms — a single piece of shading logic controlling the beam's look
// (color language, falloff, breathing, internal noise), not three near-copies
// that could quietly drift out of sync with each other.
const beamFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uWhiteBoost;
  uniform float uNoiseStrength;

  void main() {
    vec3 coral = vec3(1.0, 0.44, 0.36);
    vec3 purple = vec3(0.58, 0.38, 1.0);
    vec3 blue = vec3(0.32, 0.46, 1.0);
    vec3 white = vec3(1.0, 0.98, 0.95);

    vec3 baseColor = mix(coral, mix(purple, blue, smoothstep(0.3, 1.0, vUv.y)), smoothstep(0.0, 0.4, vUv.y));
    vec3 color = mix(baseColor, white, uWhiteBoost * (1.0 - smoothstep(0.0, 0.55, vUv.y)));

    float edgeFade = 1.0 - smoothstep(0.1, 0.5, abs(vUv.x - 0.5));
    float lengthFade = pow(1.0 - smoothstep(0.0, 1.0, vUv.y), 1.25);
    float breathe = 0.92 + 0.08 * sin(uTime * 0.7);

    // Cheap "dust suspended in light" variation — two drifting sine bands,
    // not a real noise texture, just enough to break up a perfectly flat fill.
    float grain = 0.88 + 0.12 * sin(vUv.y * 16.0 + uTime * 0.35) * sin(vUv.x * 7.0 - uTime * 0.22);
    float grainMix = mix(1.0, grain, uNoiseStrength);

    float alpha = edgeFade * lengthFade * uOpacity * breathe * grainMix;
    gl_FragColor = vec4(color, alpha);
  }
`;

function makeGlowTexture(inner: string, mid: string) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.4, mid);
  gradient.addColorStop(1, 'rgba(138,92,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/** Soft round sprite used for the beam's light-mote particles. */
function makeParticleTexture() {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const PARTICLE_COUNT = 26;

// Plain module-scope singleton — not a hook (no `use` prefix), so React's
// render-purity lint (which only analyzes components/hooks) doesn't apply.
// Math.random() here runs once per module load, not per render, which is all
// a static decorative particle field needs.
let particleGeometryCache: THREE.BufferGeometry | null = null;
function getBeamParticleGeometry() {
  if (!particleGeometryCache) {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random(); // 0 = near lantern, 1 = near water
      const spread = 0.06 + t * 2.1;
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = -t * 3.2 + Math.random() * 0.3;
      positions[i * 3 + 2] = 0.3 + t * 5.0 + Math.random() * 0.4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometryCache = geometry;
  }
  return particleGeometryCache;
}

// Safe swing range for interactive mode — keeps the beam within the visible
// composition instead of letting it spin toward/behind the camera.
const MAX_INTERACTIVE_SWING = 0.5; // radians, ~28.6° each side
const AUTO_ROTATE_SPEED = 0.15; // rad/s
const INTERACTIVE_LERP_SPEED = 3.2; // higher = snappier follow, still eased

export function LighthouseModel({
  interactive = false,
  pointerXRef,
  onAngleChange,
}: {
  interactive?: boolean;
  pointerXRef?: React.RefObject<number>;
  /** Called every frame with sin(currentAngle) (~-1..1) — lets a plain DOM
   * element (the sea layer's reflection glow) track the beam without any
   * React state/re-render on the hot path. */
  onAngleChange?: (normalized: number) => void;
}) {
  const beamGroup = useRef<THREE.Group>(null);
  const coreMaterial = useRef<THREE.ShaderMaterial>(null);
  const coneMaterial = useRef<THREE.ShaderMaterial>(null);
  const haloMaterial = useRef<THREE.ShaderMaterial>(null);
  const particles = useRef<THREE.Points>(null);
  // Persists across auto/interactive mode switches so neither transition ever
  // "teleports" — only how the increment is computed each frame changes.
  const currentAngle = useRef(0);

  const coreGeometry = useTrapezoidGeometry(CORE_SPEC);
  const coneGeometry = useTrapezoidGeometry(CONE_SPEC);
  const haloGeometry = useTrapezoidGeometry(HALO_SPEC);
  const particleGeometry = getBeamParticleGeometry();
  const particleTexture = useMemo(() => makeParticleTexture(), []);

  const coreGlow = useMemo(() => makeGlowTexture('rgba(255,248,238,1)', 'rgba(255,107,87,0.9)'), []);
  const haloGlow = useMemo(() => makeGlowTexture('rgba(255,140,110,0.65)', 'rgba(138,92,255,0.4)'), []);

  const coreUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.7 }, uWhiteBoost: { value: 0.6 }, uNoiseStrength: { value: 0.1 } }),
    [],
  );
  const coneUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.42 }, uWhiteBoost: { value: 0.15 }, uNoiseStrength: { value: 0.35 } }),
    [],
  );
  const haloUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.14 }, uWhiteBoost: { value: 0 }, uNoiseStrength: { value: 0.2 } }),
    [],
  );

  useFrame((_, delta) => {
    if (interactive && pointerXRef) {
      const target = pointerXRef.current * MAX_INTERACTIVE_SWING;
      currentAngle.current += (target - currentAngle.current) * Math.min(1, delta * INTERACTIVE_LERP_SPEED);
    } else {
      currentAngle.current += delta * AUTO_ROTATE_SPEED;
    }
    if (beamGroup.current) {
      beamGroup.current.rotation.y = currentAngle.current;
    }
    onAngleChange?.(Math.sin(currentAngle.current));

    if (coreMaterial.current) coreMaterial.current.uniforms.uTime.value += delta;
    if (coneMaterial.current) coneMaterial.current.uniforms.uTime.value += delta;
    if (haloMaterial.current) haloMaterial.current.uniforms.uTime.value += delta;
    if (particles.current) {
      particles.current.rotation.y += delta * 0.02;
      const mat = particles.current.material as THREE.PointsMaterial;
      mat.opacity = 0.35 + 0.1 * Math.sin(performance.now() * 0.0006);
    }
  });

  return (
    <group position={[LIGHTHOUSE_X, 0, LIGHTHOUSE_Z]}>
      {/* Warm light source at the lantern — the actual light "casting" on the
          tower top, nearby water and the boat, not just a visual sprite. */}
      <pointLight position={[0.4, LANTERN_Y + 0.15, 0.6]} color="#FF6B57" intensity={0.4} distance={7.5} decay={2} />
      {/* Cool rim light from front-left (near camera) — catches the tower's
          silhouette edge so it reads with volume against the dark backdrop. */}
      <pointLight position={[-1.5, LANTERN_Y - 0.5, 3]} color="#8FA6FF" intensity={0.28} distance={9} decay={2} />
      {/* Focused rim accent on the tower's upper third, coral-tinted, tying
          the tower visually to the lantern above it. */}
      <pointLight position={[0.9, LANTERN_Y - 0.9, 1.2]} color="#FF8F73" intensity={0.3} distance={3.5} decay={2} />

      {/* --- Tower body: three banded segments, off-white / navy / off-white,
          instead of one long tapered cylinder. The alternating bands and the
          much-wider gallery above are what break the old "single dark
          silhouette" problem. --- */}
      <mesh position={[0, PLATFORM_TOP_Y + SEG_A_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.3, SEG_A_HEIGHT, 20]} />
        {/* Self-lit emissive rather than relying on the scene's dim, cool-
            toned lights to reveal this as "off-white" — under this scene's
            actual illumination a plain light-colored diffuse still renders
            almost as dark as the navy segment, which defeats the point of
            banding. */}
        <meshStandardMaterial color="#E4DECF" emissive="#4A4638" emissiveIntensity={0.35} roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Small door notch at the tower's own base, facing the camera */}
      <mesh position={[0, PLATFORM_TOP_Y + 0.16, 0.29]}>
        <planeGeometry args={[0.12, 0.24]} />
        <meshStandardMaterial color="#171B26" roughness={0.9} />
      </mesh>
      <mesh position={[0, PLATFORM_TOP_Y + SEG_A_HEIGHT + RING_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.245, 0.28, RING_HEIGHT, 20]} />
        <meshStandardMaterial color="#141A2C" roughness={0.4} metalness={0.25} />
      </mesh>
      <mesh position={[0, PLATFORM_TOP_Y + SEG_A_HEIGHT + RING_HEIGHT + SEG_B_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.24, 0.245, SEG_B_HEIGHT, 20]} />
        <meshStandardMaterial
          color="#1B2440"
          roughness={0.5}
          metalness={0.16}
          emissive="#160E1E"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Small lit window partway up the mid segment */}
      <mesh position={[0, PLATFORM_TOP_Y + SEG_A_HEIGHT + RING_HEIGHT + SEG_B_HEIGHT * 0.6, 0.235]}>
        <planeGeometry args={[0.08, 0.1]} />
        <meshStandardMaterial color="#FFD9C7" emissive="#FF8F73" emissiveIntensity={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[0, PLATFORM_TOP_Y + SEG_A_HEIGHT + RING_HEIGHT + SEG_B_HEIGHT + RING_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.195, 0.24, RING_HEIGHT, 20]} />
        <meshStandardMaterial
          color="#3A2A24"
          roughness={0.4}
          metalness={0.3}
          emissive="#FF8F73"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, PLATFORM_TOP_Y + TOWER_HEIGHT - SEG_C_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[0.19, 0.195, SEG_C_HEIGHT, 20]} />
        <meshStandardMaterial color="#E4DECF" emissive="#5A5648" emissiveIntensity={0.4} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* --- Gallery / varanda: a disk far wider than the tower, the single
          biggest silhouette-breaking element — it reads as a horizontal
          ledge, not a continuation of the vertical body. --- */}
      <mesh position={[0, GALLERY_Y, 0]}>
        <cylinderGeometry args={[GALLERY_RADIUS, GALLERY_RADIUS + 0.03, 0.07, 24]} />
        <meshStandardMaterial color="#20263A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Guard-rail: a ring of thin posts plus a handrail — small vertical
          notches around the gallery edge instead of a smooth disk rim. */}
      {RAIL_POSTS.map(([x, z], i) => (
        <mesh key={i} position={[x, GALLERY_Y + 0.1, z]}>
          <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
          <meshStandardMaterial color="#12151F" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, GALLERY_Y + 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_RADIUS - 0.03, 0.01, 6, 24]} />
        <meshStandardMaterial color="#12151F" roughness={0.5} metalness={0.35} />
      </mesh>

      {/* --- Lantern room: narrower than the gallery, dark mullions over a
          warm "lit glass" body so it reads as windows, not a solid drum. --- */}
      <mesh position={[0, LANTERN_Y, 0]}>
        <cylinderGeometry args={[0.22, 0.24, LANTERN_ROOM_HEIGHT, 16]} />
        <meshStandardMaterial
          color="#FFE0C9"
          emissive="#FF8F73"
          emissiveIntensity={0.55}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 0.235;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, LANTERN_Y, Math.sin(angle) * r]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.014, LANTERN_ROOM_HEIGHT, 0.03]} />
            <meshStandardMaterial color="#12151F" roughness={0.7} metalness={0.15} />
          </mesh>
        );
      })}
      <mesh position={[0, LANTERN_Y + LANTERN_ROOM_HEIGHT / 2, 0]}>
        <torusGeometry args={[0.23, 0.012, 8, 24]} />
        <meshStandardMaterial color="#FFD9C7" emissive="#FF8F73" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, LANTERN_Y - LANTERN_ROOM_HEIGHT / 2, 0]}>
        <torusGeometry args={[0.24, 0.012, 8, 24]} />
        <meshStandardMaterial color="#12151F" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* --- Roof: a short, faceted cone (angular, not an oval dome) with a
          small metal finial on top. --- */}
      <mesh position={[0, ROOF_Y - 0.07, 0]}>
        <coneGeometry args={[0.27, 0.28, 8]} />
        <meshStandardMaterial color="#181E2C" roughness={0.5} metalness={0.25} />
      </mesh>
      <mesh position={[0, ROOF_Y + 0.1, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.13, 8]} />
        <meshStandardMaterial color="#3A2A24" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, ROOF_Y + 0.17, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#FFD9C7" emissive="#FF8F73" emissiveIntensity={0.5} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Two-layer glow (fake bloom): bright warm core + a controlled, much
          smaller halo — the previous halo (scale 2.6) circled the entire
          tower top; this one stays inside the lantern room's own footprint. */}
      <sprite position={[0, LANTERN_Y, 0.05]} scale={[1.5, 1.5, 1]}>
        <spriteMaterial map={haloGlow} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.75} />
      </sprite>
      <sprite position={[0, LANTERN_Y, 0.1]} scale={[0.9, 0.9, 1]}>
        <spriteMaterial map={coreGlow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>

      {/* Rotating beam: core (bright/tight) + main cone (the visible "shape")
          + halo (wide atmosphere), plus a few light motes drifting inside. */}
      <group ref={beamGroup} position={[0, LANTERN_Y, 0]}>
        <mesh geometry={haloGeometry}>
          <shaderMaterial
            ref={haloMaterial}
            uniforms={haloUniforms}
            vertexShader={beamVertexShader}
            fragmentShader={beamFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={coneGeometry}>
          <shaderMaterial
            ref={coneMaterial}
            uniforms={coneUniforms}
            vertexShader={beamVertexShader}
            fragmentShader={beamFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={coreGeometry}>
          <shaderMaterial
            ref={coreMaterial}
            uniforms={coreUniforms}
            vertexShader={beamVertexShader}
            fragmentShader={beamFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <points ref={particles} geometry={particleGeometry}>
          <pointsMaterial
            map={particleTexture}
            size={0.09}
            sizeAttenuation
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#FFE4D6"
          />
        </points>
      </group>
    </group>
  );
}
