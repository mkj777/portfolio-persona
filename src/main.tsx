import "lenis/dist/lenis.css";
import "@/styles/index.css";
import "@/lib/motion";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Providers } from "@/app/providers";
import { router } from "@/app/router";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root missing");

createRoot(rootEl).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
