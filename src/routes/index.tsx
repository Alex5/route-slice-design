import { createFileRoute, redirect } from "@tanstack/react-router";

/** `/` has to answer something; the app starts at the project list. */
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/projects" });
  },
});
