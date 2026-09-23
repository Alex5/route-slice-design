import { createContext, use, useMemo, useState, type ReactNode } from "react";

/**
 * State shared by one subtree and nothing else: three steps of a form that must
 * agree on a draft. A store would outlive the screen and a prop chain would
 * thread through every step, so native context is the right size here.
 *
 * .tsx rather than .ts because the provider is a component; the role is in the
 * suffix, the extension still describes the contents.
 */

export interface Draft {
  title: string;
  assignee: string;
}

interface WizardValue {
  step: number;
  draft: Draft;
  setStep: (step: number) => void;
  update: (patch: Partial<Draft>) => void;
}

const WizardContext = createContext<WizardValue | null>(null);

export function useWizard() {
  const value = use(WizardContext);
  if (!value) throw new Error("useWizard must be called inside <WizardProvider>");
  return value;
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ title: "", assignee: "" });

  const value = useMemo<WizardValue>(
    () => ({
      step,
      draft,
      setStep,
      update: (patch) => setDraft((previous) => ({ ...previous, ...patch })),
    }),
    [step, draft],
  );

  return <WizardContext value={value}>{children}</WizardContext>;
}
