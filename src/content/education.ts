import type { EducationEntry } from "./schema";

export const education: EducationEntry[] = [
  {
    period: { de: "Seit 2022", en: "Since 2022" },
    institution: { de: "Fachhochschule Dortmund", en: "Dortmund University of Applied Sciences" },
    detail: {
      de: "Informatik Dual, Schwerpunkt Softwaretechnik",
      en: "Dual Computer Science, focus on Software Engineering",
    },
  },
  {
    period: { de: "2022–2025", en: "2022–2025" },
    institution: { de: "FH Dortmund / TBS1 Bochum", en: "FH Dortmund / TBS1 Bochum" },
    detail: {
      de: "Fachinformatiker für Anwendungsentwicklung (IHK), abgeschlossen",
      en: "IT Specialist for Application Development (IHK), completed",
    },
  },
  {
    period: { de: "2020–2021", en: "2020–2021" },
    institution: { de: "Ruhr-Universität Bochum", en: "Ruhr University Bochum" },
    detail: {
      de: "Informatik, Bachelor-Grundlagen",
      en: "Computer Science, bachelor-level foundations",
    },
  },
  {
    period: { de: "2012–2020", en: "2012–2020" },
    institution: { de: "Otto-Hahn-Gymnasium Herne", en: "Otto-Hahn-Gymnasium Herne" },
    detail: { de: "Abitur", en: "Abitur" },
  },
];
