import { createFileRoute } from "@tanstack/react-router";

import { VariantPlaceholder } from "#/routes/-components/variant-placeholder/variant-placeholder.tsx";

export const Route = createFileRoute("/vue/")({
  component: () => <VariantPlaceholder id="vue" />,
});
