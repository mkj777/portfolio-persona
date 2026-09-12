import { z } from "zod";

export { LANGUAGES, type Language } from "./languages";

export const localized = z.object({ de: z.string().min(1), en: z.string().min(1) });
export type Localized = z.infer<typeof localized>;

export const localizedList = z.object({
  de: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
});
export type LocalizedList = z.infer<typeof localizedList>;

export const backdropModeSchema = z.enum(["generative", "video", "hybrid"]);
export type BackdropMode = z.infer<typeof backdropModeSchema>;

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  wordmark: z.string().min(1),
  location: localized,
  title: localized,
  titleLines: localizedList,
  heroText: localized,
  availability: localizedList,
  meta: z.object({ title: localized, description: localized }),
  backdropMode: backdropModeSchema,
  cvPath: z.string().startsWith("/"),
});
export type Profile = z.infer<typeof profileSchema>;

export const projectFrameSchema = z.object({
  src: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  label: localized,
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  index: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  kind: localized,
  description: localized,
  tech: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1).max(4),
  alt: localized,
  frames: z.array(projectFrameSchema).min(1).max(3),
  links: z.object({
    live: z.url(),
    repo: z.url().optional(),
  }),
  accent: z.enum(["cyan", "signal", "paper"]),
});
export type Project = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: localized,
  period: localized,
  periodLabel: localized,
  location: z.string().min(1),
  intro: localized,
  pillars: z
    .array(
      z.object({
        id: z.string().min(1),
        label: localized,
        title: localized,
        bullets: localizedList,
      }),
    )
    .length(3),
});
export type Experience = z.infer<typeof experienceSchema>;

export const educationEntrySchema = z.object({
  period: localized,
  institution: localized,
  detail: localized,
});
export type EducationEntry = z.infer<typeof educationEntrySchema>;

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  title: localized,
  items: localizedList,
  rank: z.string().optional(),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const timelineEntrySchema = z.object({
  date: z.string().min(1),
  sortKey: z.string().regex(/^\d{4}-\d{2}$/),
  title: localized,
  detail: localized,
  kind: z.enum(["tech", "station"]),
});
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;

export const socialsSchema = z.object({
  email: z.email(),
  phone: z.string().min(1),
  showPhone: z.boolean(),
  github: z.object({ handle: z.string().min(1), url: z.url() }),
  linkedin: z.url().optional(),
});
export type Socials = z.infer<typeof socialsSchema>;

export const videoSceneSchema = z.object({ src: z.string().min(1), poster: z.string().min(1) });

export const backdropsSchema = z.object({
  video: z.object({
    menu: videoSceneSchema.optional(),
    home: videoSceneSchema.optional(),
    about: videoSceneSchema.optional(),
    resume: videoSceneSchema.optional(),
  }),
});
export type Backdrops = z.infer<typeof backdropsSchema>;
