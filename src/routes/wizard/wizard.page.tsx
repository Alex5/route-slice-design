import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";

import { WizardSteps } from "#/routes/wizard/-components/wizard-steps/wizard-steps.tsx";
import { useWizard, WizardProvider } from "#/routes/wizard/wizard.context.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card/card.tsx";
import { Input } from "#/shared/ui/input/input.tsx";
import { Label } from "#/shared/ui/label/label.tsx";

const FILE = "src/routes/wizard/wizard.page.tsx";

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
    return <Field label="Название" value={draft.title} onChange={(title) => update({ title })} />;
  }

  if (step === 1) {
    return (
      <Field
        label="Исполнитель"
        value={draft.assignee}
        onChange={(assignee) => update({ assignee })}
      />
    );
  }

  return (
    <dl className="space-y-2 text-xs">
      <div className="flex gap-2">
        <dt className="w-28 text-muted-foreground">Название</dt>
        <dd>{draft.title || "—"}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="w-28 text-muted-foreground">Исполнитель</dt>
        <dd>{draft.assignee || "—"}</dd>
      </div>
    </dl>
  );
}

function WizardPage() {
  return (
    <Boundary file={FILE} label="wizard.page.tsx" className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Мастер</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Состояние одного поддерева и больше ничьё — в нативном контексте рядом с маршрутом.
        </p>
      </div>

      <WizardProvider>
        <div className="space-y-5">
          <WizardSteps />
          <Card>
            <CardHeader>
              <CardTitle>Черновик</CardTitle>
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

export const Route = createFileRoute("/wizard/")({
  component: WizardPage,
});
