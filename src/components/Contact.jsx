import { profile } from "../data/profile";

export default function Contact() {
  return (
    <section id="contato" className="section section-alt">
      <div className="container contact-inner">
        <p className="eyebrow">Vamos conversar</p>
        <h2>Tem um projeto em mente?</h2>
        <p className="section-lead">
          Me chame no WhatsApp e vamos entender juntos qual a melhor solução
          para o seu negócio.
        </p>

        <div className="contact-actions">
          <a
            className="btn btn-primary btn-lg"
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
