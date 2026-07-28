import { Button } from "#/shared/ui/button/button.tsx";

/**
 * Submit and cancel row. The labels arrive as props, so "Create task" and
 * "Save changes" need no branch inside.
 */
export function FormActions({
  submitLabel,
  onCancel,
  onSubmit,
}: {
  submitLabel: string;
  onCancel: () => void;
  onSubmit?: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </div>
  );
}
