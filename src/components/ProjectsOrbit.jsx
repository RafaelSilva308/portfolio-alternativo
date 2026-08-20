import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CATEGORIES, projects } from "../data/projects";

const TOTAL = projects.length;
const MAX_SCROLL = 3000;
const CARD_WIDTH = 64;

const lerp = (start, end, t) => start * (1 - t) + end * t;

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function OrbitCard({ project, target }) {
  const category = CATEGORIES[project.category];

  const handleActivate = () => {
    if (project.demo) {
      window.open(project.demo, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      className="orbit-card"
      role="link"
      tabIndex={0}
      aria-label={`Ver projeto ${project.name}`}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      <motion.div
        className="orbit-card-inner"
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="orbit-card-face orbit-card-front"
          style={{ "--card-accent": category.color }}
        >
          <span className="orbit-card-category">{category.label}</span>
          <span className="orbit-card-initials">{initials(project.name)}</span>
          {project.featured && <span className="orbit-card-dot" />}
        </div>

        <div
          className="orbit-card-face orbit-card-back"
          style={{ "--card-accent": category.color }}
        >
          <p className="orbit-card-name">{project.name}</p>
          <p className="orbit-card-tagline">{project.tagline}</p>
          <span className="orbit-card-cta">Ver projeto →</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsOrbit() {
  const containerRef = useRef(null);
  const [introPhase, setIntroPhase] = useState("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(node);
    setContainerSize({ width: node.offsetWidth, height: node.offsetHeight });

    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const clampScroll = (next) => Math.min(Math.max(next, 0), MAX_SCROLL);

    const handleWheel = (e) => {
      const atTop = scrollRef.current <= 0;
      const atBottom = scrollRef.current >= MAX_SCROLL;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        return;
      }
      e.preventDefault();
      const next = clampScroll(scrollRef.current + e.deltaY);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const atTop = scrollRef.current <= 0;
      const atBottom = scrollRef.current >= MAX_SCROLL;
      if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
        return;
      }
      e.preventDefault();
      const next = clampScroll(scrollRef.current + deltaY);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("touchstart", handleTouchStart, { passive: false });
    node.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    node.addEventListener("mousemove", handleMouseMove);
    return () => node.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scatterPositions = useMemo(
    () =>
      projects.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      })),
    []
  );

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubMorph = smoothMorph.on("change", setMorphValue);
    const unsubRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubMorph();
      unsubRotate();
      unsubParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={containerRef} className="orbit">
      <div className="orbit-intro" aria-hidden={introPhase !== "circle" || morphValue >= 0.5}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: 0.7 - morphValue }
              : { opacity: 0 }
          }
          transition={{ duration: 1 }}
          className="eyebrow"
        >
          Portfólio
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{ duration: 1 }}
          className="orbit-intro-title"
        >
          Projetos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: 0.5 - morphValue }
              : { opacity: 0 }
          }
          transition={{ duration: 1, delay: 0.2 }}
          className="orbit-hint"
        >
          Role para explorar
        </motion.p>
      </div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="orbit-content">
        <h3>Do código ao ar</h3>
        <p>
          Uma seleção de sistemas e landing pages que desenvolvi e coloquei no ar.
          Passe o mouse em cada card para ver os detalhes e clique para abrir a demonstração.
        </p>
      </motion.div>

      <div className="orbit-stage">
        {projects.map((project, i) => {
          let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

          if (introPhase === "scatter") {
            target = scatterPositions[i];
          } else if (introPhase === "line") {
            const lineSpacing = CARD_WIDTH + 18;
            const lineTotalWidth = TOTAL * lineSpacing;
            const lineX = i * lineSpacing - lineTotalWidth / 2;
            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
          } else {
            const isMobile = containerSize.width < 768;
            const minDimension = Math.min(containerSize.width, containerSize.height);

            const circleRadius = Math.min(minDimension * 0.35, 320);
            const circleAngle = (i / TOTAL) * 360;
            const circleRad = (circleAngle * Math.PI) / 180;
            const circlePos = {
              x: Math.cos(circleRad) * circleRadius,
              y: Math.sin(circleRad) * circleRadius,
              rotation: circleAngle + 90,
            };

            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
            const arcCenterY = arcApexY + arcRadius;

            const spreadAngle = isMobile ? 100 : 130;
            const startAngle = -90 - spreadAngle / 2;
            const step = spreadAngle / (TOTAL - 1);

            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
            const maxRotation = spreadAngle * 0.8;
            const boundedRotation = -scrollProgress * maxRotation;

            const currentArcAngle = startAngle + i * step + boundedRotation;
            const arcRad = (currentArcAngle * Math.PI) / 180;

            const arcPos = {
              x: Math.cos(arcRad) * arcRadius + parallaxValue,
              y: Math.sin(arcRad) * arcRadius + arcCenterY,
              rotation: currentArcAngle + 90,
              scale: isMobile ? 1.4 : 1.8,
            };

            target = {
              x: lerp(circlePos.x, arcPos.x, morphValue),
              y: lerp(circlePos.y, arcPos.y, morphValue),
              rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
              scale: lerp(1, arcPos.scale, morphValue),
              opacity: 1,
            };
          }

          return <OrbitCard key={project.id} project={project} target={target} />;
        })}
      </div>
    </div>
  );
}
