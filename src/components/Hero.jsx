import { useRef } from "react";
import { profile } from "../data/profile";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { usePointer } from "../hooks/usePointer";
import { useInViewport } from "../hooks/useInViewport";
import HeroScene from "../three/HeroScene";

const LINES = [
  "Eu construo coisas que vendem.",
  "Do código ao deploy.",
  "Em voo: SaaS, landing pages e IA.",
];

function lineStyle(index, progress) {
  const total = LINES.length;
  const fade = 0.08;
  const start = index / total;
  const end = (index + 1) / total;

  let opacity = progress >= start && progress <= end ? 1 : 0;

  if (index > 0 && progress < start && progress > start - fade) {
    opacity = 1 - (start - progress) / fade;
  }
  if (index < total - 1 && progress > end && progress < end + fade) {
    opacity = 1 - (progress - end) / fade;
  }
  opacity = Math.min(Math.max(opacity, 0), 1);

  const translateY = (1 - opacity) * 26;
  const blur = (1 - opacity) * 6;
  return {
    opacity,
    transform: `translateY(${translateY}px)`,
    filter: `blur(${blur}px)`,
    zIndex: Math.round(opacity * 10),
  };
}

export default function Hero({ active = true }) {
  const wrapperRef = useRef(null);
  const progress = useScrollProgress(wrapperRef);
  const pointerRef = usePointer();
  // retoma um pouco antes de reaparecer, para não haver quadro parado na volta
  const inViewport = useInViewport(wrapperRef, "200px");

  return (
    <section id="top" className="hero-pin-wrapper" ref={wrapperRef}>
      <div className="hero-pin-inner">
        <div className="hero-canvas-layer" aria-hidden="true">
          {active && (
            <HeroScene progress={progress} pointerRef={pointerRef} paused={!inViewport} />
          )}
        </div>
        <div className="hero-vignette" aria-hidden="true" />

        <div className="container hero-content">
          <p className="eyebrow">{profile.role}</p>
          <div className="hero-headline-stack">
            {LINES.map((line, i) => (
              <h1 key={line} className="hero-headline-line" style={lineStyle(i, progress)}>
                {line}
              </h1>
            ))}
          </div>
        </div>

        <div className="hero-scroll-hint" style={{ opacity: progress < 0.05 ? 1 : 0 }} aria-hidden="true">
          <span />
          Role para explorar
        </div>
      </div>
    </section>
  );
}
