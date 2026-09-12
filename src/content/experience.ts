import type { Experience } from "./schema";

export const experience: Experience = {
  company: "rku.it GmbH",
  role: { de: "Softwareentwickler", en: "Software Developer" },
  period: { de: "Seit August 2022", en: "Since August 2022" },
  periodLabel: { de: "Zeitraum", en: "Period" },
  location: "Herne",
  intro: {
    de: "Seit 2022 entwickle ich bei rku.it interne und kundenbezogene Anwendungen an der Schnittstelle von Full-Stack-Entwicklung und IT-Security.",
    en: "Since 2022, I have been developing internal and customer-facing applications at rku.it where full-stack development and IT security meet.",
  },
  pillars: [
    {
      id: "fullstack",
      label: { de: "Full-Stack", en: "Full stack" },
      title: { de: "Anwendungsentwicklung", en: "Application development" },
      bullets: {
        de: [
          "Projektplanung und Umsetzung interner Anwendungen und Kundenanwendungen.",
          "Anforderungsanalyse, Aufwandsschätzung und SQL-Datenbankdesign.",
          "Full-Stack-Webentwicklung mit React und C#/.NET, darunter eine Ideenplattform und ein Zeitschriftenumlauf.",
        ],
        en: [
          "Planned and implemented internal and customer-facing applications.",
          "Requirements analysis, effort estimation and SQL database design.",
          "Full-stack web development with React and C#/.NET, including an idea platform and a journal circulation tool.",
        ],
      },
    },
    {
      id: "security",
      label: { de: "IT-Security", en: "IT security" },
      title: { de: "Security-Team seit 04/2025", en: "Security team since 04/2025" },
      bullets: {
        de: [
          "Entwicklung von Anwendungen für automatisiertes Schwachstellenmanagement und CVE-Monitoring.",
          "Tenable, SIEM, SOC-Tickets und BSI-Berichte im täglichen Betrieb.",
          "IT-Security-Lookup-Tooling und Automatisierung der Workflows mit .NET und React.",
        ],
        en: [
          "Built applications for automated vulnerability management and CVE monitoring.",
          "Tenable, SIEM, SOC tickets and BSI reports as part of daily operations.",
          "IT-security lookup tooling and workflow automation with .NET and React.",
        ],
      },
    },
    {
      id: "architecture",
      label: { de: "Architektur", en: "Architecture" },
      title: { de: "Architektur & Betrieb", en: "Architecture & operations" },
      bullets: {
        de: [
          "Konzeption und Umsetzung von Softwarearchitekturen.",
          "CI/CD-Pipelines auf OpenShift, Container mit Docker und Podman.",
          "Design und Planung von Applikationen in Figma.",
        ],
        en: [
          "Designed and implemented software architectures.",
          "CI/CD pipelines on OpenShift, containers with Docker and Podman.",
          "Application design and planning in Figma.",
        ],
      },
    },
  ],
};
