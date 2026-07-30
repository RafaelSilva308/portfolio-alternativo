import { useMemo, useState } from "react";
import { CATEGORIES, projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

const FILTERS = [{ id: "all", label: "Todos" }, ...Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: c.label }))];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return filter === "all" ? sorted : sorted.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section id="projetos" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Portfólio</p>
          <h2>Projetos</h2>
          <p className="section-lead">
            Uma seleção de sistemas, automações e landing pages que desenvolvi
            e coloquei no ar — todos com código aberto no GitHub.
          </p>
        </div>

        <div className="filters" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`filter-chip ${filter === f.id ? "is-active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
