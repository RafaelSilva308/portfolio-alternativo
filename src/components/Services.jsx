import { services } from "../data/profile";

export default function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">O que eu faço</p>
          <h2>Serviços</h2>
          <p className="section-lead">
            Três frentes de trabalho, um mesmo objetivo: transformar sua
            necessidade em um produto digital funcional e bonito.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article
              key={service.id}
              className="service-card"
              style={{ "--accent": service.color }}
            >
              <div className="service-icon" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
