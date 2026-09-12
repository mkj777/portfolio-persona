import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Maximilian Julius Kielholz",
  shortName: "Maximilian Kielholz",
  wordmark: "max.",
  location: { de: "Bochum, Deutschland", en: "Bochum, Germany" },
  title: { de: "Softwareentwickler. IT-Spezialist.", en: "Software Developer. IT Specialist." },
  titleLines: {
    de: ["Software", "entwickler.", "IT-Spezialist."],
    en: ["Software", "Developer.", "IT Specialist."],
  },
  heroText: {
    de: "Ich entwickle Full-Stack-Web- und Desktop-Anwendungen mit React, TypeScript und C#/.NET: von Architektur und UI bis zu Anwendungen für IT-Security und automatisiertes Schwachstellenmanagement.",
    en: "I develop full-stack web and desktop applications with React, TypeScript and C#/.NET: from architecture and UI to applications for IT security and automated vulnerability management.",
  },
  availability: {
    de: ["Full-Stack", "IT-Security", "Softwarearchitektur"],
    en: ["Full stack", "IT security", "Software architecture"],
  },
  meta: {
    title: {
      de: "Maximilian Kielholz | Softwareentwickler & IT-Spezialist",
      en: "Maximilian Kielholz | Software Developer & IT Specialist",
    },
    description: {
      de: "Portfolio von Maximilian Kielholz, Softwareentwickler und IT-Spezialist mit Erfahrung in Full-Stack-Entwicklung, Softwarearchitektur und IT-Security.",
      en: "Portfolio of Maximilian Kielholz, a software developer and IT specialist experienced in full-stack development, software architecture and IT security.",
    },
  },
  backdropMode: "generative",
  cvPath: "/cv/Maximilian-Kielholz-CV.pdf",
};
