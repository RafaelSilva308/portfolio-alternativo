import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Astronaut from "./Astronaut";
import SpaceObjects from "./SpaceObjects";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function HeroScene({ progress = 0, pointerRef }) {
  const isLowPower = useMediaQuery("(max-width: 720px)");

  return (
    <Canvas
      dpr={[1, isLowPower ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#ffe3c2" />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#22d3ee" />
      <Stars
        radius={70}
        depth={35}
        count={isLowPower ? 700 : 1500}
        factor={2.2}
        saturation={0}
        fade
        speed={0.4}
      />
      <SpaceObjects progress={progress} pointerRef={pointerRef} />
      <Astronaut progress={progress} pointerRef={pointerRef} />
    </Canvas>
  );
}
