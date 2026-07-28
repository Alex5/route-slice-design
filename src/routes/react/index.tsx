import { createFileRoute, redirect } from "@tanstack/react-router";

/** The React variant starts at its project list. */
export const Route = createFileRoute("/react/")({
  beforeLoad: () => {
    throw redirect({ to: "/react/projects" });
  },
});
