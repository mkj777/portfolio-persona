import { profile } from "@/content/profile";
import type { BackdropMode } from "@/content/schema";

const MODES: readonly BackdropMode[] = ["generative", "video", "hybrid"];

/* `?bg=video|hybrid|generative` overrides the content default for quick comparisons. */
export function resolveBackdropMode(): BackdropMode {
  if (typeof window === "undefined") return profile.backdropMode;
  const param = new URLSearchParams(window.location.search).get("bg");
  return (MODES as readonly string[]).includes(param ?? "")
    ? (param as BackdropMode)
    : profile.backdropMode;
}
