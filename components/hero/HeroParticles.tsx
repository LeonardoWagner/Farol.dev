'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { heroSceneConfig } from '@/data/hero-scene-config';

function makeDotTexture() {
  const size = 24;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// Plain module-scope singletons (not hooks) — Math.random() here runs once
// per module load, not per render. See LighthouseModel.tsx's particle field
// for the same pattern and why it's structured this way (React's
// render-purity lint only analyzes components/hooks, not plain functions).
let distantCache: THREE.BufferGeometry | null = null;
function getDistantGeometry(count: number) {
  if (!distantCache) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = -3 + Math.random() * 8;
      positions[i * 3 + 1] = 0.2 + Math.random() * 4.2;
      positions[i * 3 + 2] = -4 + Math.random() * 10;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    distantCache = geometry;
  }
  return distantCache;
}

let mediumCache: THREE.BufferGeometry | null = null;
function getMediumGeometry(count: number) {
  if (!mediumCache) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = -1 + Math.random() * 4.5;
      positions[i * 3 + 1] = 0.4 + Math.random() * 2.6;
      positions[i * 3 + 2] = -1 + Math.random() * 6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    mediumCache = geometry;
  }
  return mediumCache;
}

/**
 * Two sparse, cheap depth layers behind/around the lighthouse — distant
 * (near-static, low luminosity, "sense of sky") and medium (slow drift, a
 * few crossing into the beam). Kept deliberately sparse: this is atmosphere,
 * not a particle-system centerpiece — two extra Points draw calls, nothing
 * that scales with scroll or interaction.
 */
export function HeroParticles() {
  const distantRef = useRef<THREE.Points>(null);
  const mediumRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => makeDotTexture(), []);

  const distantGeometry = getDistantGeometry(heroSceneConfig.particles.distant);
  const mediumGeometry = getMediumGeometry(heroSceneConfig.particles.medium);

  useFrame((_, delta) => {
    if (mediumRef.current) {
      mediumRef.current.rotation.y += delta * 0.006;
    }
    if (distantRef.current) {
      const mat = distantRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.22 + 0.06 * Math.sin(performance.now() * 0.00025);
    }
  });

  return (
    <>
      <points ref={distantRef} geometry={distantGeometry}>
        <pointsMaterial
          map={texture}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.24}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#C9D6FF"
        />
      </points>
      <points ref={mediumRef} geometry={mediumGeometry}>
        <pointsMaterial
          map={texture}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#FFE4D6"
        />
      </points>
    </>
  );
}
