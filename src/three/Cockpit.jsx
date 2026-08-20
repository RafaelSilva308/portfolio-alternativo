import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "../data/projects";
import { useMediaQuery } from "../hooks/useMediaQuery";

const BOX = 90;
const PARTICLE_COUNT = 1600;
const PARTICLE_COUNT_LOW = 700;
const ASTEROID_COUNT = 10;
const ASTEROID_COUNT_LOW = 6;
const BASE_SPEED = 9;
const BOOST_SPEED = 20;
const STICK_RADIUS = 64;

/**
 * Entradas de voo (teclado + toque) num único ref, para não re-renderizar a cada frame.
 * yaw/pitch vão de -1 a 1; o teclado usa os extremos, o joystick de toque é analógico.
 */
function useFlightInput() {
  const input = useRef({ yaw: 0, pitch: 0, boost: false });

  useEffect(() => {
    const keys = {};

    const apply = () => {
      let yaw = 0;
      let pitch = 0;
      if (keys.ArrowLeft || keys.KeyA) yaw += 1;
      if (keys.ArrowRight || keys.KeyD) yaw -= 1;
      if (keys.ArrowUp || keys.KeyW) pitch += 1;
      if (keys.ArrowDown || keys.KeyS) pitch -= 1;
      input.current.yaw = yaw;
      input.current.pitch = pitch;
      input.current.boost = !!(keys.ShiftLeft || keys.ShiftRight);
    };

    const down = (e) => {
      keys[e.code] = true;
      apply();
    };
    const up = (e) => {
      keys[e.code] = false;
      apply();
    };
    // sem isto, uma tecla segurada na hora de trocar de aba fica "presa" para sempre
    const reset = () => {
      Object.keys(keys).forEach((key) => delete keys[key]);
      apply();
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return input;
}

function wrapAxis(value, camValue) {
  let delta = value - camValue;
  if (delta > BOX / 2) return value - BOX;
  if (delta < -BOX / 2) return value + BOX;
  return value;
}

function Starfield({ count }) {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * BOX;
      arr[i * 3 + 1] = (Math.random() - 0.5) * BOX;
      arr[i * 3 + 2] = (Math.random() - 0.5) * BOX;
    }
    return arr;
  }, [count]);

  useFrame(({ camera }) => {
    const geo = pointsRef.current.geometry;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix] = wrapAxis(arr[ix], camera.position.x);
      arr[ix + 1] = wrapAxis(arr[ix + 1], camera.position.y);
      arr[ix + 2] = wrapAxis(arr[ix + 2], camera.position.z);
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f5f1e8" size={0.09} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

function Asteroids({ count }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: [(Math.random() - 0.5) * BOX, (Math.random() - 0.5) * BOX, (Math.random() - 0.5) * BOX],
        scale: 1.1 + Math.random() * 2.2,
      })),
    [count]
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

function FlightRig({ inputRef, onBoostChange }) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const boostRef = useRef(false);

  // reaproveitados a cada frame para não gerar lixo no loop de render
  const targetEuler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const forward = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const input = inputRef.current;
    const turnSpeed = 1.1 * delta;

    yaw.current += input.yaw * turnSpeed;
    pitch.current += input.pitch * turnSpeed * 0.8;
    pitch.current = THREE.MathUtils.clamp(pitch.current, -1.1, 1.1);

    targetEuler.set(pitch.current, yaw.current, 0);
    targetQuat.setFromEuler(targetEuler);
    camera.quaternion.slerp(targetQuat, 0.08);

    if (input.boost !== boostRef.current) {
      boostRef.current = input.boost;
      onBoostChange(input.boost);
    }

    const speed = input.boost ? BOOST_SPEED : BASE_SPEED;
    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(forward, speed * delta);
  });

  return null;
}

/**
 * Joystick virtual: arrastar em qualquer ponto da tela pilota, e o anel/knob
 * aparecem onde o dedo tocou. Posições são escritas direto no DOM (sem estado)
 * para o arrasto não disparar re-render a cada movimento.
 */
function TouchControls({ inputRef }) {
  const layerRef = useRef(null);
  const stickRef = useRef(null);
  const knobRef = useRef(null);
  const stickPointer = useRef(null);
  const boostPointer = useRef(null);
  const origin = useRef({ x: 0, y: 0 });

  const moveKnob = (dx, dy) => {
    const knob = knobRef.current;
    if (knob) knob.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
  };

  const releaseStick = () => {
    stickPointer.current = null;
    inputRef.current.yaw = 0;
    inputRef.current.pitch = 0;
    if (stickRef.current) stickRef.current.style.opacity = "0";
    moveKnob(0, 0);
  };

  const releaseBoost = () => {
    boostPointer.current = null;
    inputRef.current.boost = false;
  };

  /**
   * Rede de segurança: trocar de aba/app com o dedo pressionado nunca dispara
   * o pointerup no elemento, e o controle ficaria preso (acelerando sozinho).
   * Cada controle guarda o pointerId que o iniciou, então só o próprio dedo o
   * solta — dois dedos simultâneos (pilotar + boost) seguem independentes.
   */
  useEffect(() => {
    const onRelease = (e) => {
      if (stickPointer.current === e.pointerId) releaseStick();
      if (boostPointer.current === e.pointerId) releaseBoost();
    };
    const onBlur = () => {
      releaseStick();
      releaseBoost();
    };
    window.addEventListener("pointerup", onRelease, true);
    window.addEventListener("pointercancel", onRelease, true);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointerup", onRelease, true);
      window.removeEventListener("pointercancel", onRelease, true);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDown = (e) => {
    if (stickPointer.current !== null) return;
    stickPointer.current = e.pointerId;
    layerRef.current?.setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
    moveKnob(0, 0);
    const stick = stickRef.current;
    if (stick) {
      stick.style.left = `${e.clientX}px`;
      stick.style.top = `${e.clientY}px`;
      stick.style.opacity = "1";
    }
  };

  const handleMove = (e) => {
    if (stickPointer.current !== e.pointerId) return;
    let dx = e.clientX - origin.current.x;
    let dy = e.clientY - origin.current.y;
    const dist = Math.hypot(dx, dy);
    if (dist > STICK_RADIUS) {
      dx = (dx / dist) * STICK_RADIUS;
      dy = (dy / dist) * STICK_RADIUS;
    }
    moveKnob(dx, dy);
    // arrastar para a direita vira para a direita (yaw diminui, igual à seta direita)
    inputRef.current.yaw = -dx / STICK_RADIUS;
    inputRef.current.pitch = -dy / STICK_RADIUS;
  };

  const handleUp = (e) => {
    if (stickPointer.current === e.pointerId) releaseStick();
  };

  return (
    <>
      <div
        ref={layerRef}
        className="cockpit-touch-layer"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <div ref={stickRef} className="cockpit-stick" aria-hidden="true">
        <span ref={knobRef} className="cockpit-stick-knob" />
      </div>
      <button
        type="button"
        className="cockpit-boost"
        aria-label="Acelerar"
        onPointerDown={(e) => {
          boostPointer.current = e.pointerId;
          inputRef.current.boost = true;
        }}
        onPointerUp={releaseBoost}
        onPointerCancel={releaseBoost}
      >
        Boost
      </button>
    </>
  );
}

export default function Cockpit({ onClose }) {
  const inputRef = useFlightInput();
  const [nearProject, setNearProject] = useState(null);
  const [boosting, setBoosting] = useState(false);
  const isTouch = useMediaQuery("(pointer: coarse)");
  const isLowPower = useMediaQuery("(max-width: 720px)");

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
          dpr={[1, 1.75]}
          camera={{ fov: 60, near: 0.1, far: 300, position: [0, 0, 10] }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <color attach="background" args={["#020204"]} />
          <fog attach="fog" args={["#020204", 20, 95]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffe3c2" />
          <Starfield count={isLowPower ? PARTICLE_COUNT_LOW : PARTICLE_COUNT} />
          <Asteroids count={isLowPower ? ASTEROID_COUNT_LOW : ASTEROID_COUNT} />
          <ProjectMarkers onNear={setNearProject} />
          <FlightRig inputRef={inputRef} onBoostChange={setBoosting} />
        </Canvas>
      </div>

      <div className="cockpit-hud">
        <div className="cockpit-vignette" />
        <div className="cockpit-dashboard" />

        {isTouch && <TouchControls inputRef={inputRef} />}

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
          <p className={`cockpit-instructions ${isTouch ? "is-touch" : ""}`}>
            {isTouch
              ? "Arraste para pilotar · Segure BOOST para acelerar · Aproxime-se dos marcadores laranja"
              : "WASD / Setas para pilotar · Shift para acelerar · Aproxime-se dos marcadores laranja · ESC para sair"}
          </p>
        )}
      </div>
    </div>
  );
}
