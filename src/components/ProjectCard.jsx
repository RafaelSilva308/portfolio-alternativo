import { CATEGORIES } from "../data/projects";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ProjectCard({ project, index = 0 }) {
  const category = CATEGORIES[project.category];
  const { ref, className } = useScrollReveal({ index });

  return (
    <article
      ref={ref}
      className={`project-card ${project.featured ? "is-featured" : ""} ${className}`}
      style={{ "--accent": category.color }}
    >
      <div className="project-card-top">
        <span className="project-tag">{category.label}</span>
        {project.featured && <span className="project-featured">Destaque</span>}
      </div>

      <h3>{project.name}</h3>
      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.description}</p>

      <ul className="project-highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className="project-stack">
        {project.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <div className="project-links">
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            Ver demonstração
          </a>
        )}
      </div>
    </article>
  );
}
