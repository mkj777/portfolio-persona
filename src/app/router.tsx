import { createBrowserRouter } from "react-router";
import { Home } from "@/routes/Home";
import { NotFound } from "@/routes/NotFound";
import { ProjectDetail } from "@/routes/ProjectDetail";
import { Resume } from "@/routes/Resume";
import { AppLayout } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "resume", element: <Resume /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
