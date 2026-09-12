import codecHome from "@/assets/projects/codec.jpg?w=1600&format=webp";
import codecDetail from "@/assets/projects/codec-detail.webp?w=1600&format=webp";
import codecLibrary from "@/assets/projects/codec-library.webp?w=1600&format=webp";
import hubrisHome from "@/assets/projects/hubris.jpg?w=1600&format=webp";
import hubrisProfile from "@/assets/projects/hubris-profile.webp?w=1600&format=webp";
import hubrisSearch from "@/assets/projects/hubris-search.webp?w=1600&format=webp";
import potBeasts from "@/assets/projects/pathoftools-beasts.webp?w=1600&format=webp";
import potHome from "@/assets/projects/pathoftools-home.webp?w=1600&format=webp";
import potScarabs from "@/assets/projects/pathoftools-scarabs.webp?w=1600&format=webp";
import type { Project } from "./schema";

export const projects: Project[] = [
  {
    slug: "hubris",
    index: "01",
    title: "hubris.gg",
    kind: { de: "Webanwendung für League of Legends", en: "Web app for League of Legends" },
    description: {
      de: "Ein League-of-Legends-Profiltracker mit Fokus auf eine moderne und präzise Darstellung der Informationen, die Spieler für ihre Verbesserung benötigen.",
      en: "A League of Legends profile tracker focused on presenting the information players need to improve with clarity and precision.",
    },
    tech: [
      "Frontend: React, TypeScript, shadcn/ui",
      "Backend: Express, TypeScript, PostgreSQL, Drizzle ORM",
    ],
    tags: ["React", "TypeScript", "Express", "PostgreSQL"],
    alt: {
      de: "Ansicht des League-of-Legends-Profile-Trackers hubris.gg",
      en: "View of the hubris.gg League of Legends profile tracker",
    },
    frames: [
      {
        src: hubrisProfile,
        width: 1800,
        height: 778,
        label: { de: "Ranked-Profil", en: "Ranked profile" },
      },
      {
        src: hubrisSearch,
        width: 1800,
        height: 736,
        label: { de: "Spielersuche", en: "Player search" },
      },
      {
        src: hubrisHome,
        width: 1440,
        height: 900,
        label: { de: "Startseite", en: "Landing page" },
      },
    ],
    links: { live: "https://hubris.gg" },
    accent: "cyan",
  },
  {
    slug: "codec",
    index: "02",
    title: "CODEC",
    kind: { de: "Windows-Desktop-App mit WinUI 3", en: "Windows desktop app with WinUI 3" },
    description: {
      de: "Eine Spielebibliothek für Windows, die installierte Spiele, Integrationen und Metadaten bündelt und Installation sowie Start inklusive eigener Launch-Skripte ermöglicht.",
      en: "A Windows game library that combines installed games, integrations and metadata, and supports installation and launching through custom launch scripts.",
    },
    tech: [".NET, WinUI 3, Windows"],
    tags: [".NET", "WinUI 3", "C#"],
    alt: {
      de: "Ansicht der CODEC Windows-Spielebibliothek",
      en: "View of the CODEC Windows game library",
    },
    frames: [
      {
        src: codecLibrary,
        width: 1800,
        height: 991,
        label: { de: "Spielebibliothek", en: "Game library" },
      },
      {
        src: codecDetail,
        width: 1800,
        height: 991,
        label: { de: "Spieldetails", en: "Game details" },
      },
      { src: codecHome, width: 1903, height: 1047, label: { de: "Onboarding", en: "Onboarding" } },
    ],
    links: { live: "https://codeclibrary.dev" },
    accent: "signal",
  },
  {
    slug: "pathoftools",
    index: "03",
    title: "pathoftools.app",
    kind: { de: "Webanwendung für Path of Exile", en: "Web app for Path of Exile" },
    description: {
      de: "Produktiv betriebene Tool-Sammlung für Path of Exile mit Anbindung externer Preis-APIs, täglichen Daten-Snapshots und ISR-Caching.",
      en: "A production tool collection for Path of Exile with external price APIs, daily data snapshots and ISR caching.",
    },
    tech: [
      "Next.js, TypeScript, Vercel",
      "Externe Preis-APIs, tägliche Daten-Snapshots, ISR-Caching",
    ],
    tags: ["Next.js", "TypeScript", "Vercel"],
    alt: {
      de: "Ansicht der Path-of-Exile-Tool-Sammlung pathoftools.app",
      en: "View of the Path of Exile tool collection pathoftools.app",
    },
    frames: [
      { src: potHome, width: 1800, height: 1000, label: { de: "Übersicht", en: "Overview" } },
      {
        src: potBeasts,
        width: 1800,
        height: 1000,
        label: { de: "Beast-Preise", en: "Beast prices" },
      },
      {
        src: potScarabs,
        width: 1800,
        height: 1000,
        label: { de: "Scarab-Nodes", en: "Scarab nodes" },
      },
    ],
    links: { live: "https://pathoftools.app" },
    accent: "paper",
  },
];

export function findProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
