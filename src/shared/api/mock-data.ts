/**
 * Static stand-in for the API. A real app would generate this layer from an
 * OpenAPI contract (Т8); the shapes here play the part of those generated
 * types, and the fetchers are async like real network calls (Т9), so the
 * loaders above are written exactly as they would be against a server.
 */

export type TaskStatus = "open" | "in_progress" | "done";

export const TASK_STATUSES: TaskStatus[] = ["open", "in_progress", "done"];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  open: "Открыта",
  in_progress: "В работе",
  done: "Готово",
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

const projects: Project[] = [
  { id: "apollo", name: "Apollo", openTasks: 12 },
  { id: "hermes", name: "Hermes", openTasks: 3 },
];

const tasks: Task[] = [
  {
    id: "TF-142",
    title: "Таблица задач теряет фильтр после перезагрузки",
    status: "in_progress",
    assignee: "А. Ильин",
  },
  {
    id: "TF-138",
    title: "Диалог создания не сбрасывается при закрытии",
    status: "open",
    assignee: "М. Соколова",
  },
  {
    id: "TF-131",
    title: "Взять типы из нового контракта /tasks",
    status: "done",
    assignee: "Д. Кравцов",
  },
  {
    id: "TF-127",
    title: "Ответ 500 не показывает уведомление",
    status: "open",
    assignee: "А. Ильин",
  },
];

/** What the client throws for a non-2xx response; `status` is the HTTP code. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function fetchProjects() {
  return projects;
}

export async function fetchProject(projectId: string) {
  const project = projects.find((candidate) => candidate.id === projectId);
  if (!project) throw new ApiError(404, `Project ${projectId} not found`);
  return project;
}

export async function fetchTasks() {
  return tasks;
}

export async function fetchTask(taskId: string) {
  const task = tasks.find((candidate) => candidate.id === taskId);
  if (!task) throw new ApiError(404, `Task ${taskId} not found`);
  return task;
}
