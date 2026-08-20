import { useEffect, useRef, useState } from "react";
import { CATEGORIES, projects } from "../data/projects";

export default function ProjectsCarousel() {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return undefined;

    const handleScroll = () => {
      const max = node.scrollWidth - node.clientWidth;
      const pct = max > 0 ? (node.scrollLeft / max) * 100 : 0;
      setProgress(pct);

      const tile = node.firstElementChild;
      if (tile) {
        const step = tile.getBoundingClientRect().width + 24;
        setIndex(Math.round(node.scrollLeft / step));
      }
    };

    handleScroll();
    node.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      node.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollByTile = (dir) => {
    const node = trackRef.current;
    if (!node) return;
    const tile = node.firstElementChild;
    const step = tile ? tile.getBoundingClientRect().width + 24 : 320;
    node.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const total = projects.length;

  return (
    <section id="projetos" className="section section-alt projects-carousel-section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Portfólio</p>
          <h2>Do código ao ar</h2>
          <p className="section-lead">
            Uma seleção de sistemas e landing pages que desenvolvi e coloquei no ar.
          </p>
        </div>

        <div className="carousel-track" ref={trackRef}>
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

        <div className="carousel-footer">
          <span className="carousel-counter">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="carousel-progress-bar">
            <div className="carousel-progress-fill" style={{ "--progress": `${progress}%` }} />
          </div>
          <div className="carousel-nav">
            <button className="carousel-nav-btn" onClick={() => scrollByTile(-1)} aria-label="Projeto anterior">
              ‹
            </button>
            <button className="carousel-nav-btn" onClick={() => scrollByTile(1)} aria-label="Próximo projeto">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
