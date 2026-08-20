const ITEMS = [
  "Sistemas & SaaS",
  "Landing Pages",
  "Automação com IA",
  "React & Next.js",
  "APIs & Bancos de Dados",
  "Integração com WhatsApp",
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span className="marquee-item" key={`${item}-${i}`}>
            <b>{item}</b>
            <span className="marquee-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
