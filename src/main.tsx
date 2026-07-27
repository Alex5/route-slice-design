import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { router } from "#/app/router.tsx";
import "#/styles.css";

const root = document.getElementById("root");

if (!root) throw new Error("[main.tsx]: #root element not found");

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
