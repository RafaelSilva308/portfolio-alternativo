import { useEffect, useRef, useState } from "react";
import { CATEGORIES, projects } from "../data/projects";
import { useScrollProgress } from "../hooks/useScrollProgress";

const SCROLL_FACTOR = 1.15;

export default function ProjectsCarousel() {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const [maxTranslate, setMaxTranslate] = useState(0);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return undefined;

    const measure = () => {
      setMaxTranslate(Math.max(node.scrollWidth - node.clientWidth, 0));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const progress = useScrollProgress(wrapperRef);
  const translateX = -progress * maxTranslate;

  const total = projects.length;
  const index = Math.min(total - 1, Math.round(progress * (total - 1)));

  const scrollByProject = (dir) => {
    const step = maxTranslate / Math.max(total - 1, 1);
    window.scrollBy({ top: dir * step * SCROLL_FACTOR, behavior: "smooth" });
  };

  return (
    <section
      id="projetos"
      className="projects-pin-wrapper"
      ref={wrapperRef}
      style={{ height: `calc(100vh + ${maxTranslate * SCROLL_FACTOR}px)` }}
    >
      <div className="projects-pin-inner section-alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Portfólio</p>
            <h2>Do código ao ar</h2>
            <p className="section-lead">
              Uma seleção de sistemas e landing pages que desenvolvi e coloquei no ar.
            </p>
          </div>

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              ref={trackRef}
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {projects.map((project, i) => {
                const category = CATEGORIES[project.category];
                return (
                  <article
                    className="project-tile"
                    key={project.id}
                    style={{ "--accent-icon": category.color }}
                  >
                    <div className="project-tile-media">{category.icon}</div>
                    <div className="project-tile-top">
                      <span className="project-tile-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="project-tile-badge">{category.label}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.tagline}</p>
                    <div className="project-tile-links">
                      {project.demo && (
                        <a className="project-tile-link" href={project.demo} target="_blank" rel="noreferrer">
                          Ver demo ↗
                        </a>
                      )}
                      {project.github && (
                        <a className="project-tile-link" href={project.github} target="_blank" rel="noreferrer">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="carousel-footer">
            <span className="carousel-counter">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="carousel-progress-bar">
              <div className="carousel-progress-fill" style={{ "--progress": `${progress * 100}%` }} />
            </div>
            <div className="carousel-nav">
              <button
                className="carousel-nav-btn"
                onClick={() => scrollByProject(-1)}
                aria-label="Projeto anterior"
                disabled={progress <= 0.01}
              >
                ‹
              </button>
              <button
                className="carousel-nav-btn"
                onClick={() => scrollByProject(1)}
                aria-label="Próximo projeto"
                disabled={progress >= 0.99}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
