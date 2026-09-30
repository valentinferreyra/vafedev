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
    "Placeholder: add a concise introduction to your work, current focus, and the problems you care about.",
  currentFocus: {
    title: "Current focus",
    summary: "Placeholder: describe what you are learning, building, or improving today.",
  },
  about: [
    "Placeholder: tell the personal and professional story that led you to software development.",
    "Placeholder: explain how you work, what you value, and the direction you are pursuing now.",
  ],
} as const;

export const timeline: TimelineEntry[] = [];
export const skills: ReferenceItem[] = [];
export const tools: ReferenceItem[] = [];

export function sortTimeline(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}
