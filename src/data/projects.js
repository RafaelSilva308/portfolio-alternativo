export const CATEGORIES = {
  sistema: { label: "Sistemas & SaaS", color: "#818cf8" },
  automacao: { label: "Automação com IA", color: "#22d3ee" },
  landing: { label: "Landing Pages", color: "#fb923c" },
};

export const projects = [
  {
    id: "enem-pro",
    name: "ENEM Pro",
    category: "sistema",
    featured: true,
    tagline: "Plataforma SaaS de preparação inteligente para o ENEM",
    description:
      "Plataforma completa de estudos para o ENEM com planos de estudo gerados por IA, banco com mais de 1.558 questões reais de 14 anos de prova, simulados com nota TRI estimada, correção automática de redação nas 5 competências e dashboard de desempenho em tempo real.",
    highlights: [
      "Planos de estudo personalizados por IA",
      "Correção de redação com feedback automático",
      "Simulados com pontuação TRI estimada",
      "PWA instalável com modo adaptativo",
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "IA"],
    demo: "https://frontend-pied-one-13.vercel.app",
    github: "https://github.com/RafaelSilva308/SaaS-Enem",
  },
  {
    id: "belezars",
    name: "BelezaRS",
    category: "sistema",
    tagline: "Plataforma de agendamento para salões de beleza",
    description:
      "Sistema de agendamento que conecta clientes a salões parceiros, com busca por localização/serviço, confirmação instantânea e lembretes automáticos. No lado do salão: dashboard de gestão, controle financeiro, programa de fidelidade e relatórios de desempenho.",
    highlights: [
      "Agendamento online 24/7 para clientes",
      "Dashboard de gestão para salões",
      "Lembretes automáticos contra no-show",
      "Modelo de assinatura por níveis",
    ],
    stack: ["React", "TypeScript"],
    demo: "https://rafaelsilva308.github.io/saloes-agendamento/",
    github: "https://github.com/RafaelSilva308/saloes-agendamento",
  },
  {
    id: "gracie-barra-gama",
    name: "Gracie Barra Gama",
    category: "landing",
    tagline: "Academia de Jiu-Jitsu — Gama, DF",
    description:
      "Landing page para academia de Jiu-Jitsu com foco em captação de novos alunos: apresentação da metodologia, prova social (mais de 300 alunos ativos e 4 campeões estaduais) e chamada para aula experimental gratuita.",
    highlights: ["Aula experimental grátis como CTA", "Prova social e credibilidade", "Design acolhedor para famílias"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/gracie-barra-gama/",
    github: "https://github.com/RafaelSilva308/gracie-barra-gama",
  },
  {
    id: "isabela-melo",
    name: "Lash de Elite",
    category: "landing",
    tagline: "Estúdio de cílios e sobrancelhas — Isabela Melo",
    description:
      "Site para estúdio de beleza com catálogo de serviços e preços, portfólio visual de trabalhos, curso VIP de formação profissional e depoimentos de clientes, com agendamento direto via WhatsApp.",
    highlights: ["Catálogo de serviços com preços", "Vitrine de formação profissional (curso VIP)", "Agendamento via WhatsApp"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/isabela-melo/",
    github: "https://github.com/RafaelSilva308/isabela-melo",
  },
  {
    id: "jaylane-silva",
    name: "Studio Jaylane Silva",
    category: "landing",
    tagline: "Unhas, cílios e sobrancelhas — Valparaíso, GO",
    description:
      "Landing page para estúdio de beleza com portfólio de antes/depois, depoimentos de clientes e formulário de agendamento online integrado ao WhatsApp.",
    highlights: ["Galeria de antes/depois", "Formulário de agendamento online", "Mais de 500 clientes atendidas"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/jaylane-silva/",
    github: "https://github.com/RafaelSilva308/jaylane-silva",
  },
  {
    id: "brown-evolution",
    name: "Brown Evolution",
    category: "landing",
    tagline: "Design de sobrancelhas — Mariana Martins",
    description:
      "Site institucional para estúdio especializado em design de sobrancelhas, com tabela de procedimentos e preços, galeria de resultados e sistema de agendamento online.",
    highlights: ["Tabela de procedimentos e preços", "Galeria de resultados", "Agendamento online"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/mariana-martins-sobrancelhas/",
    github: "https://github.com/RafaelSilva308/mariana-martins-sobrancelhas",
  },
  {
    id: "metalurgica-dias",
    name: "Metalúrgica Dias",
    category: "landing",
    tagline: "Máquinas agrícolas para colheita de café — Patrocínio, MG",
    description:
      "Landing page institucional para fabricante de máquinas agrícolas sob medida (colhedeiras, derriçadoras, sopradores), destacando fabricação própria, personalização por fazenda e contato direto via WhatsApp.",
    highlights: ["Catálogo de equipamentos", "Fabricação e manutenção sob medida", "Contato direto via WhatsApp"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/metalurgica-dias/",
    github: "https://github.com/RafaelSilva308/metalurgica-dias",
  },
  {
    id: "msr-transportes",
    name: "MSR Transportes",
    category: "landing",
    tagline: "Logística e transporte nacional — Belém, PA",
    description:
      "Site institucional para transportadora com atuação em todo o Brasil, apresentando serviços de transporte aéreo e rodoviário, logística farmacêutica autorizada pela ANVISA e cobertura em 27 estados.",
    highlights: ["8 serviços logísticos detalhados", "Certificações e autorizações (ANTT, ANVISA)", "Cobertura nacional em 27 estados"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/MSR_LP/",
    github: "https://github.com/RafaelSilva308/MSR_LP",
  },
  {
    id: "royal-face",
    name: "Royal Face Valparaíso",
    category: "landing",
    tagline: "Clínica de estética facial avançada",
    description:
      "Site para clínica de harmonização facial com mais de 40 procedimentos, galeria de resultados com slider comparativo de antes/depois e múltiplas chamadas para agendamento de consulta gratuita via WhatsApp.",
    highlights: ["Slider comparativo de antes/depois", "Mais de 40 procedimentos estéticos", "Consulta gratuita como CTA"],
    stack: ["HTML", "CSS", "JS"],
    demo: "https://rafaelsilva308.github.io/roytal-face-valparaiso/",
    github: "https://github.com/RafaelSilva308/roytal-face-valparaiso",
  },
];
