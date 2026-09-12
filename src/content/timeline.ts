import type { TimelineEntry } from "./schema";

/* Ordered bottom to top: the oldest entry is floor 1, today is the top floor. */
export const timeline: TimelineEntry[] = [
  {
    date: "2012–2020",
    sortKey: "2012-08",
    kind: "station",
    title: { de: "Otto-Hahn-Gymnasium Herne", en: "Otto-Hahn-Gymnasium Herne" },
    detail: { de: "Abitur", en: "Abitur (A-levels)" },
  },
  {
    date: "12/2017",
    sortKey: "2017-12",
    kind: "tech",
    title: { de: "HTML & CSS", en: "HTML & CSS" },
    detail: {
      de: "Erste eigene Websites, Layout und Styling.",
      en: "First own websites, layout and styling.",
    },
  },
  {
    date: "02/2018",
    sortKey: "2018-02",
    kind: "tech",
    title: { de: "Python & Java", en: "Python & Java" },
    detail: {
      de: "Einstieg in Programmierung und Objektorientierung.",
      en: "Getting started with programming and object orientation.",
    },
  },
  {
    date: "01/2020",
    sortKey: "2020-01",
    kind: "tech",
    title: { de: "JavaScript, TypeScript & Git", en: "JavaScript, TypeScript & Git" },
    detail: {
      de: "Typsichere Frontends und Versionskontrolle als Standard.",
      en: "Type-safe front ends and version control as the default.",
    },
  },
  {
    date: "06/2020",
    sortKey: "2020-06",
    kind: "tech",
    title: { de: "Deployment & DevOps", en: "Deployment & DevOps" },
    detail: {
      de: "Vercel, Cloudflare, erste Pipelines.",
      en: "Vercel, Cloudflare, first pipelines.",
    },
  },
  {
    date: "2020–2021",
    sortKey: "2020-10",
    kind: "station",
    title: { de: "Ruhr-Universität Bochum", en: "Ruhr University Bochum" },
    detail: {
      de: "Informatik · Bachelor-Grundlagen",
      en: "Computer Science · bachelor-level foundations",
    },
  },
  {
    date: "2021",
    sortKey: "2021-03",
    kind: "tech",
    title: { de: "React, Node & MySQL", en: "React, Node & MySQL" },
    detail: {
      de: "Full-Stack-Anwendungen von der Datenbank bis zur UI.",
      en: "Full-stack applications from database to UI.",
    },
  },
  {
    date: "08/2022",
    sortKey: "2022-08",
    kind: "station",
    title: { de: "rku.it GmbH & FH Dortmund", en: "rku.it GmbH & FH Dortmund" },
    detail: {
      de: "Start als Softwareentwickler, parallel Informatik Dual (Softwaretechnik).",
      en: "Start as a software developer, dual computer science studies in parallel.",
    },
  },
  {
    date: "11/2022",
    sortKey: "2022-11",
    kind: "tech",
    title: { de: "AI & LLMs", en: "AI & LLMs" },
    detail: {
      de: "LLM-gestützte Entwicklung und Prompt Engineering im Alltag.",
      en: "LLM-assisted development and prompt engineering as daily practice.",
    },
  },
  {
    date: "2023",
    sortKey: "2023-01",
    kind: "tech",
    title: { de: "Figma, C# & .NET", en: "Figma, C# & .NET" },
    detail: {
      de: "UI-Konzeption in Figma, Backends und Desktop mit .NET.",
      en: "UI concepts in Figma, back ends and desktop apps with .NET.",
    },
  },
  {
    date: "11/2024",
    sortKey: "2024-11",
    kind: "tech",
    title: { de: "Docker, Podman, Linux & Kubernetes", en: "Docker, Podman, Linux & Kubernetes" },
    detail: {
      de: "Container-Entwicklung und Deployments auf OpenShift.",
      en: "Container development and deployments on OpenShift.",
    },
  },
  {
    date: "01/2025",
    sortKey: "2025-01",
    kind: "tech",
    title: { de: "React Native & Expo", en: "React Native & Expo" },
    detail: {
      de: "Mobile Apps mit geteiltem TypeScript-Stack.",
      en: "Mobile apps on a shared TypeScript stack.",
    },
  },
  {
    date: "03/2025",
    sortKey: "2025-03",
    kind: "tech",
    title: { de: "WinUI 3", en: "WinUI 3" },
    detail: {
      de: "Native Windows-Desktop-Anwendungen (CODEC).",
      en: "Native Windows desktop applications (CODEC).",
    },
  },
  {
    date: "04/2025",
    sortKey: "2025-04",
    kind: "tech",
    title: { de: "IT-Sicherheit", en: "IT security" },
    detail: {
      de: "Wechsel ins IT-Security-Team: Schwachstellenmanagement, Tenable, SIEM, SOC.",
      en: "Move into the IT-security team: vulnerability management, Tenable, SIEM, SOC.",
    },
  },
  {
    date: "05/2025",
    sortKey: "2025-05",
    kind: "tech",
    title: { de: "Flutter", en: "Flutter" },
    detail: { de: "Cross-Platform-Apps mit Dart.", en: "Cross-platform apps with Dart." },
  },
  {
    date: "2025",
    sortKey: "2025-07",
    kind: "station",
    title: {
      de: "Fachinformatiker Anwendungsentwicklung (IHK)",
      en: "IT Specialist for Application Development (IHK)",
    },
    detail: {
      de: "Ausbildung abgeschlossen, TBS1 Bochum.",
      en: "Apprenticeship completed, TBS1 Bochum.",
    },
  },
  {
    date: "2026",
    sortKey: "2026-09",
    kind: "station",
    title: { de: "Heute", en: "Today" },
    detail: {
      de: "IT-Security bei rku.it, Studium an der FH Dortmund, eigene Produkte.",
      en: "IT security at rku.it, studies at FH Dortmund, own products.",
    },
  },
];
