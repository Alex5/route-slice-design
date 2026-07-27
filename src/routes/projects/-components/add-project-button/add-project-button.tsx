import { useState } from "react";

import { Boundary } from "#/shared/ui/boundary/boundary.tsx";
import { Pill } from "#/shared/ui/pill/pill.tsx";

const FILE = "src/routes/projects/-components/add-project-button/add-project-button.tsx";

/**
 * A Command Component: trigger, dialog state and the write itself in one
 * folder. The page renders <AddProjectButton /> with no props and knows nothing
 * about what happens when it is pressed.
 */
export function AddProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <Boundary file={FILE} label="add-project-button" className="pb-3 pt-6">
      <Pill onClick={() => setOpen((previous) => !previous)}>
        {open ? "Cancel" : "New project"}
      </Pill>
      {open && (
        <div className="absolute end-0 top-full z-20 mt-2 w-56 space-y-3 rounded-lg border bg-popover p-3 text-xs shadow-xl">
          <div className="font-medium">New project</div>
          <div className="h-8 rounded-md border border-white/10" />
          <div className="flex justify-end">
            <Pill active onClick={() => setOpen(false)}>
              Create
            </Pill>
          </div>
        </div>
      )}
    </Boundary>
  );
}
