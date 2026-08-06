import { services } from "../data/profile";
import ServiceCard from "./ServiceCard";

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
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
