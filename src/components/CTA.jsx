import { profile } from "../data/profile";

export default function CTA({ onPlay }) {
  return (
    <section id="contato" className="cta-final">
      <div className="cta-final-glow" aria-hidden="true" />
      <div className="container cta-final-inner">
        <p className="eyebrow">Vamos conversar</p>
        <h2 className="cta-final-title">Pronto para decolar?</h2>
        <p className="cta-final-lead">
          Me conta sobre o seu projeto — ou pilote o cockpit primeiro para conhecer
          um pouco mais do meu trabalho em uma experiência 3D.
        </p>

        <div className="cta-final-actions">
          <button type="button" className="btn btn-play btn-lg" onClick={onPlay}>
            Play — entrar no cockpit
          </button>
          <a
            className="btn btn-ghost btn-lg"
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            {profile.whatsappDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
