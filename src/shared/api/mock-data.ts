/**
 * Static stand-in for the API. A real app would generate this layer from an
 * OpenAPI contract (§ 6); the shapes here play the part of those generated
 * types so the routes above can be written the way the spec expects.
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

export const projects: Project[] = [
  { id: "apollo", name: "Apollo", openTasks: 12 },
  { id: "hermes", name: "Hermes", openTasks: 3 },
];

export const tasks: Task[] = [
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

export function findProject(id: string) {
  return projects.find((project) => project.id === id);
}

export function findTask(id: string) {
  return tasks.find((task) => task.id === id);
}
