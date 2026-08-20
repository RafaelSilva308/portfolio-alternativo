import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "../data/projects";

const BOX = 90;
const PARTICLE_COUNT = 1600;
const ASTEROID_COUNT = 10;
const BASE_SPEED = 9;
const BOOST_SPEED = 20;

function useKeys() {
  const keys = useRef({});
  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true;
    };
    const up = (e) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

function wrapAxis(value, camValue) {
  let delta = value - camValue;
  if (delta > BOX / 2) return value - BOX;
  if (delta < -BOX / 2) return value + BOX;
  return value;
}

function Starfield() {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * BOX;
      arr[i * 3 + 1] = (Math.random() - 0.5) * BOX;
      arr[i * 3 + 2] = (Math.random() - 0.5) * BOX;
    }
    return arr;
  }, []);

  useFrame(({ camera }) => {
    const geo = pointsRef.current.geometry;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      arr[ix] = wrapAxis(arr[ix], camera.position.x);
      arr[ix + 1] = wrapAxis(arr[ix + 1], camera.position.y);
      arr[ix + 2] = wrapAxis(arr[ix + 2], camera.position.z);
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f5f1e8" size={0.09} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

function Asteroids() {
  const items = useMemo(
    () =>
      Array.from({ length: ASTEROID_COUNT }, () => ({
        pos: [(Math.random() - 0.5) * BOX, (Math.random() - 0.5) * BOX, (Math.random() - 0.5) * BOX],
        scale: 1.1 + Math.random() * 2.2,
      })),
    []
  );
  const group = useRef(null);

  useFrame(({ camera }) => {
    if (!group.current) return;
    group.current.children.forEach((mesh) => {
      mesh.position.x = wrapAxis(mesh.position.x, camera.position.x);
      mesh.position.y = wrapAxis(mesh.position.y, camera.position.y);
      mesh.position.z = wrapAxis(mesh.position.z, camera.position.z);
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
    });
  });

  return (
    <group ref={group}>
      {items.map((a, i) => (
        <mesh key={i} position={a.pos} scale={a.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#4a4740" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function ProjectMarkers({ onNear }) {
  const items = useMemo(
    () =>
      projects.map((project, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const radius = 16 + (i % 3) * 6;
        return {
          project,
          pos: [Math.cos(angle) * radius, Math.sin(i * 1.7) * 6, Math.sin(angle) * radius - i * 4],
        };
      }),
    []
  );

  const refs = useRef([]);
  const lastId = useRef(null);

  useFrame(({ camera, clock }) => {
    let nearestProject = null;
    let nearestDist = Infinity;

    items.forEach((item, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.rotation.y = clock.elapsedTime * 0.6 + i;
      mesh.rotation.x = clock.elapsedTime * 0.3;
      const dist = camera.position.distanceTo(mesh.position);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestProject = item.project;
      }
    });

    const current = nearestDist < 7 ? nearestProject : null;
    const currentId = current ? current.id : null;
    if (currentId !== lastId.current) {
      lastId.current = currentId;
      onNear(current);
    }
  });

  return (
    <group>
      {items.map((item, i) => (
        <mesh key={item.project.id} ref={(el) => (refs.current[i] = el)} position={item.pos}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial color="#ff6a2c" emissive="#ff6a2c" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function FlightRig({ keysRef, onBoostChange }) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const boostRef = useRef(false);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const k = keysRef.current;
    const turnSpeed = 1.1 * delta;

    if (k.ArrowLeft || k.KeyA) yaw.current += turnSpeed;
    if (k.ArrowRight || k.KeyD) yaw.current -= turnSpeed;
    if (k.ArrowUp || k.KeyW) pitch.current += turnSpeed * 0.8;
    if (k.ArrowDown || k.KeyS) pitch.current -= turnSpeed * 0.8;
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.1, 1.1);

    const targetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pitch.current, yaw.current, 0, "YXZ")
    );
    camera.quaternion.slerp(targetQuat, 0.08);

    const boosting = !!(k.ShiftLeft || k.ShiftRight);
    if (boosting !== boostRef.current) {
      boostRef.current = boosting;
      onBoostChange(boosting);
    }

    const speed = boosting ? BOOST_SPEED : BASE_SPEED;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(forward, speed * delta);
  });

  return null;
}

export default function Cockpit({ onClose }) {
  const keysRef = useKeys();
  const [nearProject, setNearProject] = useState(null);
  const [boosting, setBoosting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.code === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="cockpit-overlay">
      <div className="cockpit-canvas-layer">
        <Canvas
          camera={{ fov: 60, near: 0.1, far: 300, position: [0, 0, 10] }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <color attach="background" args={["#020204"]} />
          <fog attach="fog" args={["#020204", 20, 95]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffe3c2" />
          <Starfield />
          <Asteroids />
          <ProjectMarkers onNear={setNearProject} />
          <FlightRig keysRef={keysRef} onBoostChange={setBoosting} />
        </Canvas>
      </div>

      <div className="cockpit-hud">
        <div className="cockpit-vignette" />
        <div className="cockpit-dashboard" />

        <div className="cockpit-topbar">
          <span className="cockpit-brand">
            Rafael<span className="brand-dot">.</span>dev — Cockpit
          </span>
          <button className="cockpit-close" onClick={onClose} aria-label="Fechar cockpit">
            ✕
          </button>
        </div>

        <div className="cockpit-crosshair" />

        {nearProject ? (
          <div className="cockpit-project-card">
            <p className="eyebrow">{boosting ? "Boost ativado" : "Projeto próximo"}</p>
            <h4>{nearProject.name}</h4>
            <p>{nearProject.tagline}</p>
          </div>
        ) : (
          <p className="cockpit-instructions">
            WASD / Setas para pilotar · Shift para acelerar · Aproxime-se dos marcadores laranja · ESC para sair
          </p>
        )}
      </div>
    </div>
  );
}
