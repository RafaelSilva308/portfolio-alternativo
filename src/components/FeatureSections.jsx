import { services } from "../data/profile";

export default function FeatureSections() {
  return (
    <div id="servicos">
      {services.map((service, index) => (
        <section
          key={service.id}
          className={`feature-section ${index % 2 === 1 ? "is-reverse" : ""}`}
        >
          <div className="container feature-grid">
            <div className="feature-text">
              <p className="eyebrow">{service.title}</p>
              <h2 className="feature-title">{service.headline}</h2>
              <p className="feature-desc">{service.description}</p>
              <div className="feature-tags">
                {service.items.map((item) => (
                  <span className="feature-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="feature-visual" style={{ "--accent-icon": service.color }}>
              <span className="feature-visual-num">{String(index + 1).padStart(2, "0")}</span>
              <div className="feature-icon">{service.icon}</div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
