import type { SkillGroup } from "./schema";

export const skills: SkillGroup[] = [
  {
    id: "languages",
    title: { de: "Programmiersprachen", en: "Programming languages" },
    items: {
      de: ["TypeScript · JavaScript", "HTML · CSS", "C# · Python · Java"],
      en: ["TypeScript · JavaScript", "HTML · CSS", "C# · Python · Java"],
    },
  },
  {
    id: "frameworks",
    title: { de: "Frameworks & Libraries", en: "Frameworks & libraries" },
    items: {
      de: [
        "Node.js · React · Next.js · Express",
        ".NET · ASP.NET · WinUI 3",
        "Flutter · React Native · Expo",
      ],
      en: [
        "Node.js · React · Next.js · Express",
        ".NET · ASP.NET · WinUI 3",
        "Flutter · React Native · Expo",
      ],
    },
  },
  {
    id: "data",
    title: { de: "Datenbanken & Cloud", en: "Databases & cloud" },
    items: {
      de: ["MySQL · PostgreSQL", "Vercel · Cloudflare", "OpenShift · CI/CD-Pipelines"],
      en: ["MySQL · PostgreSQL", "Vercel · Cloudflare", "OpenShift · CI/CD pipelines"],
    },
  },
  {
    id: "security",
    title: { de: "IT-Security", en: "IT security" },
    items: {
      de: [
        "Automatisierung des Schwachstellenmanagements",
        "BSI · Tenable · SIEM",
        "Security Operations Center (SOC)",
      ],
      en: [
        "Vulnerability-management automation",
        "BSI · Tenable · SIEM",
        "Security Operations Center (SOC)",
      ],
    },
  },
  {
    id: "tools",
    title: { de: "Tools & Workflow", en: "Tools & workflow" },
    items: {
      de: ["Git · GitHub · GitLab", "Docker · Podman", "Windows · Linux · Visual Studio · VS Code"],
      en: ["Git · GitHub · GitLab", "Docker · Podman", "Windows · Linux · Visual Studio · VS Code"],
    },
  },
  {
    id: "design",
    title: { de: "Design & KI", en: "Design & AI" },
    items: {
      de: ["Figma · UI/UX · App-Konzeption", "AI/LLM-gestützte Entwicklung", "Prompt Engineering"],
      en: ["Figma · UI/UX · App conception", "AI/LLM-assisted development", "Prompt engineering"],
    },
  },
  {
    id: "spoken",
    title: { de: "Sprachen", en: "Languages" },
    items: {
      de: ["Deutsch: Muttersprache", "Englisch: B2/C1", "Technisches Englisch"],
      en: ["German: native", "English: B2/C1", "Technical English"],
    },
    rank: "B2/C1",
  },
];
