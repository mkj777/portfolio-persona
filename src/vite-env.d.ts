/// <reference types="vite/client" />

/* vite-imagetools: every project frame is requested as a resized webp URL. */
declare module "*?w=1600&format=webp" {
  const src: string;
  export default src;
}
