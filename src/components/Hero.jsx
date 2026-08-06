import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { useCountUp } from "../hooks/useCountUp";

export default function Hero() {
  const projectCount = projects.length;

  const projectsStat = useCountUp(projectCount, { duration: 1200 });
  const frentesStat = useCountUp(3, { duration: 1200 });
  const codeStat = useCountUp(100, { duration: 1200, suffix: "%" });

  return (
    <section id="top" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-inner">
        <p className="eyebrow">Desenvolvimento web sob demanda</p>
        <h1>
          Sistemas e landing pages que colocam
          <span className="text-gradient"> seu negócio para vender.</span>
        </h1>
        <p className="hero-lead">
          Sou {profile.name}, desenvolvedor full stack. Projeto e construo
          plataformas SaaS, sistemas internos e páginas de conversão para
          negócios que precisam de presença digital de verdade — do banco de
          dados ao design final.
        </p>

        <div className="hero-actions">
          <a
            className="btn btn-primary btn-lg"
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Solicitar orçamento
          </a>
          <a className="btn btn-ghost btn-lg" href="#projetos">
            Ver projetos
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <strong ref={projectsStat.ref}>{projectsStat.display}</strong>
            <span>projetos entregues</span>
          </div>
          <div>
            <strong ref={frentesStat.ref}>{frentesStat.display}</strong>
            <span>frentes de atuação</span>
          </div>
          <div>
            <strong ref={codeStat.ref}>{codeStat.display}</strong>
            <span>código aberto no GitHub</span>
          </div>
        </div>
      </div>
    </section>
  );
}
