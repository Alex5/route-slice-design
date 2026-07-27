import { createFileRoute } from "@tanstack/react-router";

import { WizardSteps } from "#/routes/wizard/-components/wizard-steps/wizard-steps.tsx";
import { useWizard, WizardProvider } from "#/routes/wizard/wizard.context.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Section } from "#/shared/ui/section/section.tsx";

const FILE = "src/routes/wizard/index.tsx";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-md border border-white/10 bg-transparent px-2.5 text-xs outline-none focus:border-layer-routes"
      />
    </label>
  );
}

function CurrentStep() {
  const { step, draft, update } = useWizard();

  if (step === 0) {
    return <Field label="Title" value={draft.title} onChange={(title) => update({ title })} />;
  }

  if (step === 1) {
    return (
      <Field
        label="Assignee"
        value={draft.assignee}
        onChange={(assignee) => update({ assignee })}
      />
    );
  }

  return (
    <dl className="space-y-2 text-xs">
      <div className="flex gap-2">
        <dt className="w-20 text-muted-foreground">Title</dt>
        <dd>{draft.title || "—"}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="w-20 text-muted-foreground">Assignee</dt>
        <dd>{draft.assignee || "—"}</dd>
      </div>
    </dl>
  );
}

function WizardPage() {
  return (
    <Boundary file={FILE} label="wizard/index.tsx" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Wizard</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          State shared by one subtree and nothing else, held in native context beside the route.
        </p>
      </div>

      <WizardProvider>
        <div className="space-y-5">
          <WizardSteps />
          <Section title="Draft">
            <CurrentStep />
          </Section>
        </div>
      </WizardProvider>
    </Boundary>
  );
}

export const Route = createFileRoute("/wizard/")({
  component: WizardPage,
});
