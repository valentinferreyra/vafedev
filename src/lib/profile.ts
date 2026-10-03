export type TimelineEntry = {
  date: string;
  title: string;
  summary: string;
  href?: string;
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
    "Since 2022, I have taught Estrategias de Persistencia at Universidad Nacional de Quilmes. Students arrive with object-oriented programming and SQL knowledge and build their first APIs using Java, JDBC, Hibernate, and Spring. We also explore MongoDB, Neo4j, transactions, consistency, scaling, and the trade-offs behind persistence choices.",
    "I mentor student teams through their projects, reviewing pull requests and helping with Git workflows, design decisions, and team organization. Teaching strengthens how I communicate and support teams at work, while professional experience gives me concrete examples to bring into the classroom.",
    "I earned my Técnico en Programación Informática qualification at UNQ in 2024 and am continuing toward a licenciatura. My next professional goals are to grow into a Senior Engineer role and, eventually, technical leadership. I use this space to share my work and connect with other developers and teams.",
  ],
} as const;

export const timeline: TimelineEntry[] = [
  { date: "2022", title: "Joined Mercado Libre", summary: "Started as a Junior Software Engineer in Customer Service, contributing to the CRM platform." },
  { date: "2022", title: "Started university teaching", summary: "Began teaching Estrategias de Persistencia at Universidad Nacional de Quilmes and mentoring student project teams." },
  { date: "2024", title: "First university qualification", summary: "Earned the Técnico en Programación Informática qualification at UNQ. Continuing toward a licenciatura." },
  { date: "2025-02", title: "Promoted to Semi Senior", summary: "Became a Semi Senior Software Engineer at Mercado Libre, continuing work on CRM Platform." },
];
export const skills: ReferenceItem[] = [];
export const tools: ReferenceItem[] = [];

export function sortTimeline(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
