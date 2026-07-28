import { useWizard } from "#/routes/react/wizard/wizard.context.tsx";
import { cn } from "#/shared/lib/utils.ts";
import { Boundary } from "#/shared/ui/boundary/boundary.tsx";

const FILE = "src/routes/react/wizard/-components/wizard-steps/wizard-steps.tsx";

const STEPS = ["Title", "Assignee", "Review"];

/** Reads the step from context; the page never passes it down. */
export function WizardSteps() {
  const { step, setStep } = useWizard();

  return (
    <Boundary file={FILE} label="-components/wizard-steps" className="pb-3 pt-6">
      <ol className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                index === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>
    </Boundary>
  );
}
