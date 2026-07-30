import { CATEGORIES } from "../data/projects";

export default function ProjectCard({ project }) {
  const category = CATEGORIES[project.category];

  return (
    <article
      className={`project-card ${project.featured ? "is-featured" : ""}`}
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
