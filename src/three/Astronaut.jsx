import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CREAM = "#f2ede1";
const CREAM_DARK = "#cdc5b4";
const VISOR = "#0d1720";
const ACCENT = "#ff6a2c";

export default function Astronaut({ progress = 0, pointerRef }) {
  const group = useRef(null);

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const t = state.clock.getElapsedTime();
    const pointer = pointerRef?.current ?? { x: 0, y: 0 };
    node.position.y = Math.sin(t * 0.6) * 0.18 - progress * 0.9;
    node.position.x = THREE.MathUtils.lerp(node.position.x, pointer.x * 0.35, 0.04);
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, pointer.x * 0.4 + Math.sin(t * 0.15) * 0.2, 0.04);
    node.rotation.z = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.15}>
      {/* backpack */}
      <mesh position={[0, 0.05, -0.32]}>
        <boxGeometry args={[0.55, 0.75, 0.32]} />
        <meshStandardMaterial color={CREAM_DARK} roughness={0.6} />
      </mesh>

      {/* torso */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.42, 0.5, 8, 16]} />
        <meshStandardMaterial color={CREAM} roughness={0.45} />
      </mesh>

      {/* chest straps */}
      <mesh position={[0, 0.18, 0.34]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
        <meshStandardMaterial color={ACCENT} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, 0.34]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
        <meshStandardMaterial color={ACCENT} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0.4]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color={CREAM_DARK} roughness={0.5} />
      </mesh>

      {/* head */}
      <group position={[0, 0.76, 0.02]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.02, 0.24]}>
          <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshPhysicalMaterial
            color={VISOR}
            roughness={0.12}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
        <mesh position={[0, -0.24, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.05, 12, 32, Math.PI]} />
          <meshStandardMaterial color={CREAM_DARK} roughness={0.5} />
        </mesh>
      </group>

      {/* arms */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.52, 0.15, 0.05]} rotation={[0, 0, side * -0.35]}>
          <mesh position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.15, 0.4, 6, 12]} />
            <meshStandardMaterial color={CREAM} roughness={0.45} />
          </mesh>
          <mesh position={[side * 0.05, -0.56, 0.05]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color={CREAM_DARK} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* legs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.2, -0.55, 0]}>
          <mesh position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.18, 0.45, 6, 12]} />
            <meshStandardMaterial color={CREAM} roughness={0.45} />
          </mesh>
          <mesh position={[0, -0.6, 0.04]}>
            <boxGeometry args={[0.22, 0.18, 0.32]} />
            <meshStandardMaterial color={ACCENT} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
