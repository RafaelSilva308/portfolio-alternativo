import { projects } from "../data/projects";
import { useCountUp } from "../hooks/useCountUp";

export default function About() {
  const projectsStat = useCountUp(projects.length, { duration: 1200 });
  const frentesStat = useCountUp(3, { duration: 1200 });
  const codeStat = useCountUp(100, { duration: 1200, suffix: "%" });

  return (
    <section id="sobre" className="section">
      <div className="container about-grid">
        <div>
          <p className="eyebrow">Sobre mim</p>
          <h2>Da ideia ao produto no ar</h2>
          <p className="section-lead">
            Trabalho ponta a ponta: entendo a necessidade do negócio, desenho
            a solução e construo o sistema ou a página — cuidando de
            performance, responsividade e experiência do usuário em cada
            entrega. Já desenvolvi desde plataformas SaaS completas com IA
            integrada até landing pages de conversão para negócios locais.
          </p>

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

        <div className="about-cards">
          <div className="about-card">
            <h4>Full stack</h4>
            <p>Front-end, back-end e banco de dados sob o mesmo teto.</p>
          </div>
          <div className="about-card">
            <h4>IA aplicada</h4>
            <p>Uso de modelos de IA para automatizar tarefas e gerar valor real.</p>
          </div>
          <div className="about-card">
            <h4>Foco em resultado</h4>
            <p>Cada entrega pensada para gerar contato, venda ou eficiência.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
