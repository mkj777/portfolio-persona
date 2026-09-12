import type { Backdrops } from "./schema";

/* Drop .webm loops (< 4 MB each) plus a poster into public/video/ and reference them here. */
export const backdrops: Backdrops = {
  video: {
    menu: { src: "/video/menu.webm", poster: "/video/menu.jpg" },
    home: { src: "/video/menu.webm", poster: "/video/menu.jpg" },
    about: { src: "/video/about.webm", poster: "/video/about.jpg" },
    resume: { src: "/video/resume.webm", poster: "/video/resume.jpg" },
  },
};
