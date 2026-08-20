import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CREAM_DARK = "#cdc5b4";
const ACCENT = "#ff6a2c";
const ACCENT_2 = "#ffb238";
const ACCENT_COOL = "#2f7f8c";
const DUSK = "#7d6b8a";
const DEEP = "#3d4f6b";

function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function SpaceBody({
  position,
  radius,
  color,
  roughness = 0.75,
  metalness = 0.05,
  emissive,
  emissiveIntensity = 0,
  ring,
  moon,
  glow,
  start,
  end,
  spin = 0.08,
  floatAmp = 0.06,
  floatSpeed = 0.2,
  parallax = 0.03,
  baseOpacity = 1,
  progress,
  pointerRef,
}) {
  const group = useRef(null);
  const mesh = useRef(null);
  const mainMat = useRef(null);
  const ringMat = useRef(null);
  const moonGroup = useRef(null);
  const moonMat = useRef(null);
  const glowMat = useRef(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const t = state.clock.getElapsedTime();
    const pointer = pointerRef?.current ?? { x: 0, y: 0 };
    const visible = smoothstep(start, end, progress);

    const nextScale = THREE.MathUtils.lerp(node.scale.x, visible, 0.06);
    node.scale.setScalar(Math.max(nextScale, 0.0001));

    node.position.x = position[0] + pointer.x * parallax;
    node.position.y =
      position[1] -
      (1 - visible) * floatAmp * 6 +
      Math.sin(t * floatSpeed + position[0] * 3) * floatAmp +
      pointer.y * parallax * 0.6;
    node.position.z = position[2];

    if (mesh.current) mesh.current.rotation.y += delta * spin;
    if (moonGroup.current) moonGroup.current.rotation.y += delta * (moon?.speed ?? 0.4);

    if (mainMat.current) mainMat.current.opacity = visible * baseOpacity;
    if (ringMat.current) ringMat.current.opacity = visible * 0.8;
    if (moonMat.current) moonMat.current.opacity = visible;
    if (glowMat.current) glowMat.current.opacity = visible * 0.35;
  });

  return (
    <group ref={group} position={position} scale={0.0001}>
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, 28, 28]} />
        <meshStandardMaterial
          ref={mainMat}
          color={color}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0}
        />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2 - ring.tilt, 0.15, 0]}>
          <torusGeometry args={[radius * ring.scale, radius * ring.width, 8, 48]} />
          <meshStandardMaterial
            ref={ringMat}
            color={ring.color}
            roughness={0.65}
            metalness={0.1}
            transparent
            opacity={0}
          />
        </mesh>
      )}

      {moon && (
        <group ref={moonGroup}>
          <mesh position={[moon.distance, 0, 0]}>
            <sphereGeometry args={[moon.radius, 16, 16]} />
            <meshStandardMaterial ref={moonMat} color={moon.color} roughness={0.6} transparent opacity={0} />
          </mesh>
        </group>
      )}

      {glow && (
        <mesh>
          <sphereGeometry args={[radius * 1.9, 16, 16]} />
          <meshBasicMaterial ref={glowMat} color={color} transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

const PLANETS = [
  {
    key: "sun",
    position: [3.4, 2.3, -17],
    radius: 1.6,
    color: ACCENT_2,
    emissive: ACCENT_2,
    emissiveIntensity: 1.1,
    roughness: 0.4,
    glow: true,
    start: 0,
    end: 0.22,
    spin: 0.02,
    floatAmp: 0.04,
    floatSpeed: 0.08,
    parallax: 0.012,
  },
  {
    key: "ringed-giant",
    position: [-3.6, -0.5, -9.5],
    radius: 0.95,
    color: DEEP,
    roughness: 0.7,
    ring: { color: ACCENT, scale: 1.7, width: 0.05, tilt: 0.35 },
    start: 0.12,
    end: 0.42,
    spin: 0.16,
    floatAmp: 0.08,
    floatSpeed: 0.15,
    parallax: 0.035,
  },
  {
    key: "cyan-moonlet",
    position: [3.1, -1.5, -6.5],
    radius: 0.5,
    color: ACCENT_COOL,
    roughness: 0.55,
    moon: { distance: 1.05, radius: 0.15, color: CREAM_DARK, speed: 0.55 },
    start: 0.32,
    end: 0.6,
    spin: 0.26,
    floatAmp: 0.1,
    floatSpeed: 0.22,
    parallax: 0.05,
  },
  {
    key: "dusk-planet",
    position: [-2.1, 1.7, -12],
    radius: 0.68,
    color: DUSK,
    roughness: 0.65,
    start: 0.48,
    end: 0.78,
    spin: 0.1,
    floatAmp: 0.07,
    floatSpeed: 0.12,
    parallax: 0.025,
  },
];

const ASTEROID_COUNT = 6;
const ASTEROIDS = Array.from({ length: ASTEROID_COUNT }, (_, i) => {
  const seed = i * 12.9898;
  const rand = (n) => {
    const v = Math.sin(seed + n * 7.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return {
    key: `asteroid-${i}`,
    position: [
      (rand(1) - 0.5) * 7.5,
      (rand(2) - 0.5) * 4.5,
      -3 - rand(3) * 3,
    ],
    radius: 0.07 + rand(4) * 0.1,
    color: CREAM_DARK,
    roughness: 0.85,
    start: 0.05 + rand(5) * 0.55,
    end: 0.35 + rand(6) * 0.55,
    spin: 0.3 + rand(7) * 0.4,
    floatAmp: 0.12 + rand(8) * 0.1,
    floatSpeed: 0.3 + rand(9) * 0.3,
    parallax: 0.07 + rand(10) * 0.05,
    baseOpacity: 0.85,
  };
});

export default function SpaceObjects({ progress = 0, pointerRef }) {
  return (
    <group>
      {PLANETS.map(({ key, ...body }) => (
        <SpaceBody key={key} {...body} progress={progress} pointerRef={pointerRef} />
      ))}
      {ASTEROIDS.map(({ key, ...body }) => (
        <SpaceBody key={key} {...body} progress={progress} pointerRef={pointerRef} />
      ))}
    </group>
  );
}
