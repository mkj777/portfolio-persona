# portfolio-persona

Persona-3-Reload-inspired, fully animated portfolio of Maximilian Kielholz. Vite + React 19 + TypeScript, GSAP for every motion, Lenis smooth scroll, Tailwind v4 tokens with CSS Modules for the shape and animation components, and a lazy OGL shader as the default backdrop.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm check        # typecheck, lint (Biome), content tests (Vitest), production build
```

`?bg=video` or `?bg=hybrid` switches the backdrop for quick comparisons. Loops go into `public/video/` (see `src/content/backdrops.ts`).

## Structure

- `src/content/` is the only place with text. Every entry carries `{ de, en }`, validated by the zod schema in `content.test.ts`.
- `src/styles/tokens.css` holds the palette, clip shapes, easing curves, durations and fonts as Tailwind `@theme` tokens.
- `src/components/shape` are the container primitives (cut panels, angled bars, outline words, signal stripe).
- `src/components/motion` are the page wipes (four variants) and the circle reveal.
- `src/components/backdrop` is the persistent background: CSS fallback, video loop, OGL caustics.
- `src/screens/` are the six home sections, `src/routes/` the four routes.

Keyboard: `M` opens the menu, arrows and Enter navigate, Escape goes back everywhere. Sound is off until the SFX toggle is switched on; the state survives reloads.

## Credits

- Visual language inspired by the Persona series UI and by [blairxu13/persona3-website](https://github.com/blairxu13/persona3-website). Not affiliated with Atlus.
- Fonts: Anton (Vernon Adams), Bebas Neue (Dharma Type), Barlow (Jeremy Tribby), all OFL, self-hosted via Fontsource.
- Sounds are synthesized in the browser with the Web Audio API, no samples.
- Animation: [GSAP](https://gsap.com) (ScrollTrigger, SplitText, ScrambleText, DrawSVG, MorphSVG), [Lenis](https://lenis.darkroom.engineering), [OGL](https://github.com/oframe/ogl).
