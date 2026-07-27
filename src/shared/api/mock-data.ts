/**
 * Static stand-in for the API. A real app would generate this layer from an
 * OpenAPI contract (§ 6); the shapes here play the part of those generated
 * types so the routes above can be written the way the spec expects.
 */

export type TaskStatus = "open" | "in_progress" | "done";

export const TASK_STATUSES: TaskStatus[] = ["open", "in_progress", "done"];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  done: "Done",
};

export interface Project {
  id: string;
  name: string;
  openTasks: number;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
}

export const projects: Project[] = [
  { id: "apollo", name: "Apollo", openTasks: 12 },
  { id: "hermes", name: "Hermes", openTasks: 3 },
];

export const tasks: Task[] = [
  { id: "TF-142", title: "Task table loses its filter on reload", status: "in_progress", assignee: "A. Ilin" },
  { id: "TF-138", title: "Create dialog does not reset when closed", status: "open", assignee: "M. Sokolova" },
  { id: "TF-131", title: "Pull types from the new /tasks contract", status: "done", assignee: "D. Kravtsov" },
  { id: "TF-127", title: "A 500 response shows no toast", status: "open", assignee: "A. Ilin" },
];

export function findProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function findTask(id: string) {
  return tasks.find((task) => task.id === id);
}
