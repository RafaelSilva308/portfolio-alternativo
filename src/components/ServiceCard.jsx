import { useScrollReveal } from "../hooks/useScrollReveal";

export default function ServiceCard({ service, index }) {
  const { ref, className } = useScrollReveal({ index });

  return (
    <article
      ref={ref}
      className={`service-card ${className}`}
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
  );
}
