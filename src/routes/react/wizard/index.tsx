import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";

import { WizardSteps } from "#/routes/react/wizard/-components/wizard-steps/wizard-steps.tsx";
import { useWizard, WizardProvider } from "#/routes/react/wizard/wizard.context.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Input } from "#/shared/ui/input/input.tsx";
import { Label } from "#/shared/ui/label/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card/card.tsx";

const FILE = "src/routes/react/wizard/index.tsx";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
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
          <Card>
        <CardHeader>
          <CardTitle>Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStep />
          </CardContent>
      </Card>
        </div>
      </WizardProvider>
    </Boundary>
  );
}

export const Route = createFileRoute("/react/wizard/")({
  component: WizardPage,
});
