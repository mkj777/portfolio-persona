import { describe, expect, it } from "vitest";
import { backdrops } from "./backdrops";
import { education } from "./education";
import { experience } from "./experience";
import { de } from "./i18n/de";
import { en } from "./i18n/en";
import { profile } from "./profile";
import { projects } from "./projects";
import {
  backdropsSchema,
  educationEntrySchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
  socialsSchema,
  timelineEntrySchema,
} from "./schema";
import { skills } from "./skills";
import { socials } from "./socials";
import { timeline } from "./timeline";

describe("content schema", () => {
  it("profile", () => {
    expect(profileSchema.safeParse(profile).success).toBe(true);
  });
  it("projects", () => {
    for (const p of projects) {
      const r = projectSchema.safeParse(p);
      expect(r.success, r.success ? "" : JSON.stringify(r.error.issues)).toBe(true);
    }
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
  it("experience", () => {
    expect(experienceSchema.safeParse(experience).success).toBe(true);
  });
  it("education", () => {
    for (const e of education) expect(educationEntrySchema.safeParse(e).success).toBe(true);
  });
  it("skills", () => {
    for (const s of skills) expect(skillGroupSchema.safeParse(s).success).toBe(true);
    expect(skills).toHaveLength(7);
  });
  it("timeline is sorted bottom to top", () => {
    for (const t of timeline) expect(timelineEntrySchema.safeParse(t).success).toBe(true);
    const keys = timeline.map((t) => t.sortKey);
    expect([...keys].sort()).toEqual(keys);
    expect(timeline.filter((t) => t.kind === "station")).toHaveLength(5);
    expect(timeline.filter((t) => t.kind === "tech")).toHaveLength(12);
  });
  it("socials", () => {
    expect(socialsSchema.safeParse(socials).success).toBe(true);
  });
  it("backdrops", () => {
    expect(backdropsSchema.safeParse(backdrops).success).toBe(true);
  });
  it("ui strings have the same shape in both languages", () => {
    const shape = (o: unknown): unknown =>
      o && typeof o === "object"
        ? Object.fromEntries(
            Object.entries(o as Record<string, unknown>)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, v]) => [k, shape(v)]),
          )
        : typeof o;
    expect(shape(en)).toEqual(shape(de));
  });
});
