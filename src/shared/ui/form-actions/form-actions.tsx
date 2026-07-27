import { Pill } from "#/shared/ui/pill/pill.tsx";

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
      <Pill onClick={onCancel}>Cancel</Pill>
      <Pill active onClick={onSubmit ?? (() => undefined)}>
        {submitLabel}
      </Pill>
    </div>
  );
}
