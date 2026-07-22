'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LIGHTHOUSE_X = 1.7;
const LIGHTHOUSE_Z = -1;
const WATER_Y = -0.6;
const TOWER_HEIGHT = 2.6;
const LANTERN_Y = WATER_Y + TOWER_HEIGHT + 0.15;

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
const CORE_SPEC: TrapezoidSpec = { apex: 0.03, apexZ: 0.2, baseX: 0.9, baseY: 1.5, baseZ: 2.6 };
const CONE_SPEC: TrapezoidSpec = { apex: 0.07, apexZ: 0.24, baseX: 2.9, baseY: 3.3, baseZ: 5.4 };
const HALO_SPEC: TrapezoidSpec = { apex: 0.22, apexZ: 0.28, baseX: 4.1, baseY: 3.35, baseZ: 5.6 };

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

      {/* Tower — slightly warmed dark navy (not pure black) + a faint coral
          emissive undertone on the side facing the lantern, for "volume". */}
      <mesh position={[0, WATER_Y + TOWER_HEIGHT / 2, 0]}>
        {/* openEnded: true — the flat top cap disk was catching light at a
            steep camera angle and reading as a stray triangular highlight,
            not as part of the tower's silhouette. The lantern housing sits
            right above and hides the now-open top. */}
        <cylinderGeometry args={[0.12, 0.22, TOWER_HEIGHT, 24, 1, true]} />
        <meshStandardMaterial
          color="#242A3B"
          roughness={0.5}
          metalness={0.16}
          emissive="#2A140E"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Tonal band */}
      <mesh position={[0, WATER_Y + TOWER_HEIGHT * 0.55, 0]}>
        <cylinderGeometry args={[0.166, 0.176, 0.12, 24]} />
        <meshStandardMaterial color="#525A6E" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Thin lit accent ring bridging tower and lantern — a small structural
          detail (the "trim" between body and lamp room) that also catches
          the coral rim light, reinforcing the tower→lantern connection. */}
      <mesh position={[0, LANTERN_Y - 0.15, 0]}>
        <torusGeometry args={[0.135, 0.012, 8, 24]} />
        <meshStandardMaterial
          color="#3A2A24"
          roughness={0.4}
          metalness={0.3}
          emissive="#FF8F73"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Lantern room — solid dark housing with a low dome cap. (A translucent
          "glass" version was tried, but the rotating beam's apex sits at this
          same point and showed through it in a confusing way — opaque reads
          more cleanly at this small scale.) */}
      <mesh position={[0, LANTERN_Y, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.24, 24]} />
        <meshStandardMaterial color="#1B2030" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Thin glowing frame around the lantern glass, top and bottom — reads
          as a lit window frame rather than a flat cylinder end. */}
      <mesh position={[0, LANTERN_Y + 0.12, 0]}>
        <torusGeometry args={[0.14, 0.008, 6, 24]} />
        <meshStandardMaterial color="#FFD9C7" emissive="#FF8F73" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, LANTERN_Y + 0.13, 0]}>
        <sphereGeometry args={[0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color="#12151F" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Two-layer glow (fake bloom): bright warm core + wider soft halo */}
      <sprite position={[0, LANTERN_Y, 0.05]} scale={[2.6, 2.6, 1]}>
        <spriteMaterial map={haloGlow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[0, LANTERN_Y, 0.1]} scale={[1.5, 1.5, 1]}>
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
