export const LANGUAGES = ["de", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
