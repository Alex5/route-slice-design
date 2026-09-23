import { useWizard } from "#/routes/wizard/wizard.context.tsx";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Button } from "#/shared/ui/button/button.tsx";

const FILE = "src/routes/wizard/-components/wizard-steps/wizard-steps.tsx";

const STEPS = ["Название", "Исполнитель", "Проверка"];

/** Reads the step from context; the page never passes it down. */
export function WizardSteps() {
  const { step, setStep } = useWizard();

  return (
    <Boundary file={FILE} label="-components/wizard-steps" className="pb-3 pt-6">
      <ol className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <li key={label}>
            <Button
              size="xs"
              variant={index === step ? "default" : "secondary"}
              onClick={() => setStep(index)}
            >
              {index + 1}. {label}
            </Button>
          </li>
        ))}
      </ol>
    </Boundary>
  );
}
