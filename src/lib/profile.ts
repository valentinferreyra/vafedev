export type TimelineEntry = {
  date: string;
  title: string;
  summary: string;
  href?: string;
  category?: "Professional experience" | "Teaching";
  period?: string;
};

export type ReferenceItem = {
  name: string;
  note: string;
};

export const profile = {
  name: "Valentín Ferreyra",
  role: "Software developer",
  location: "Buenos Aires, Argentina",
  headline: "I design software that can evolve without losing clarity.",
  introduction:
    "I’m Valentin Ferreyra, a Semi Senior Software Engineer at Mercado Libre and a university instructor. I build backend platforms for customer service teams and the developers who build applications for them.",
  currentFocus: {
    title: "Current focus",
    summary: "My current focus is delivering features for Mercado Libre’s CRM Platform. Alongside work, I teach persistence and API development at Universidad Nacional de Quilmes and continue my undergraduate studies.",
  },
  about: [
    "I work in Customer Service at Mercado Libre, on the cross-functional CRM Platform team. We build capabilities for customer service representatives and for the development teams whose applications run on the platform. I joined as a Junior Software Engineer in 2022 and became a Semi Senior in February 2025.",
    "I enjoy listening to customer needs and working with my team to turn them into practical solutions. My work includes backend architecture, distributed systems, event-driven processing, observability, and technical documentation. I explain technical work in terms that frontend and product teams can understand, connecting implementation decisions to their value for customers.",
    "My teaching work at Universidad Nacional de Quilmes began in July 2021 as a teaching assistant in Programación con Objetos 1. I joined Estrategias de Persistencia as a teaching assistant in July 2022 and became an instructor in March 2026. Students build their first APIs using Java, JDBC, Hibernate, and Spring, and explore MongoDB, Neo4j, transactions, consistency, and scaling trade-offs.",
    "I mentor student teams through their projects, reviewing pull requests and helping with Git workflows, design decisions, and team organization. Teaching strengthens how I communicate and support teams at work, while professional experience gives me concrete examples to bring into the classroom.",
    "I hold a Técnico Universitario en Programación Informática qualification from UNQ and am pursuing the Licenciatura en Informática. My next professional goals are to grow into a Senior Engineer role and, eventually, technical leadership. I use this space to share my work and connect with other developers and teams.",
  ],
} as const;

export const timeline: TimelineEntry[] = [
  { date: "2022-12", period: "Dec 2022 – Feb 2025", category: "Professional experience", title: "Software Developer · Mercado Libre", summary: "Joined as a junior developer in Customer Service, contributing to the CRM platform and Live Notifications." },
  { date: "2025-02", period: "Feb 2025 – Present", category: "Professional experience", title: "Ssr Software Engineer · Mercado Libre", summary: "Design and maintenance of high-traffic backend applications. Distributed systems, event-driven processing, observability, technical documentation, backlog planning, estimates, and task delegation.", href: "/projects/crm-realtime" },
  { date: "2021-07", period: "Jul 2021 – Dec 2022", category: "Teaching", title: "Teaching assistant · Programación con Objetos 1", summary: "Volunteer teaching assistant at Universidad Nacional de Quilmes." },
  { date: "2022-07", period: "Jul 2022 – Mar 2026", category: "Teaching", title: "Teaching assistant · Estrategias de Persistencia", summary: "Volunteer teaching assistant at UNQ, supporting persistence and API development coursework and mentoring student project teams." },
  { date: "2026-03", period: "Mar 2026 – Present", category: "Teaching", title: "University instructor · Estrategias de Persistencia", summary: "Teaching persistence, API development, transactions, and SQL/NoSQL trade-offs at UNQ. Mentoring teams through code reviews, Git workflows, and design decisions." },
];

export const education: ReferenceItem[] = [
  { name: "Técnico Universitario en Programación Informática", note: "Universidad Nacional de Quilmes · Completed" },
  { name: "Licenciatura en Informática", note: "Universidad Nacional de Quilmes · In progress" },
];
export const skills: ReferenceItem[] = [];
export const tools: ReferenceItem[] = [];

export function sortTimeline(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
