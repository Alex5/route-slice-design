/**
 * A guided walk through the demo: each step opens a URL, points at the file
 * behind it and states one requirement on a live example.
 *
 * Kept next to source-notes for the same reason: this is opinion laid over the
 * facts the tree reads from disk. Links go through linkOptions, so a renamed
 * folder breaks the build here too (Т10).
 */
import { linkOptions } from "@tanstack/react-router";

const R = "src/routes/projects";
const TASKS = `${R}/$projectId/tasks`;

export const TOUR = [
  {
    title: "Адрес — это папка",
    rule: "Т1",
    text: "Вы на /projects. Слева выделен файл, который рендерит эту страницу, — routes/projects/projects.page.tsx. Путь к файлу повторяет URL, поэтому код любого экрана находится по адресной строке. Удалить экран — удалить одну папку.",
    focus: `${R}/projects.page.tsx`,
    link: linkOptions({ to: "/projects", search: {} }),
  },
  {
    title: "Страница только собирает",
    rule: "Т6",
    text: "projects.page.tsx — оркестратор: заголовок, таблица, кнопка, и ни строчки логики. «Новый проект» — Command Component: триггер, состояние и запись лежат в одной папке, а страница рендерит <AddProjectButton /> без пропсов. Новое действие — новая папка и одна строка JSX.",
    focus: `${R}/-components/add-project-button`,
    link: linkOptions({ to: "/projects", search: {} }),
  },
  {
    title: "Имя файла говорит, что это",
    rule: "Т5",
    text: "Сегмент $projectId — папка с двумя файлами: project-id.layout.tsx грузит проект и держит вкладки, project-id.page.tsx — содержимое. Имена по сегменту, index.tsx нет: по вкладкам редактора видно, что открыто. В каждой папке-сегменте есть страница или лэйаут.",
    focus: `${R}/$projectId/project-id.layout.tsx`,
    link: linkOptions({ to: "/projects/$projectId", params: { projectId: "apollo" }, search: {} }),
  },
  {
    title: "Состояние живёт там, откуда оно родом",
    rule: "Т7",
    text: "Фильтр «Открыта» — в адресе, а не в useState: ссылку можно отправить коллеге, она переживёт перезагрузку. Данные с сервера — в лоадере маршрута, общее для поддерева — в контексте рядом с маршрутом, локальное — в useState. Архитектура называет происхождение, инструмент выбирает стек.",
    focus: `${TASKS}/-components/filters/status-filter.tsx`,
    link: linkOptions({
      to: "/projects/$projectId/tasks",
      params: { projectId: "apollo" },
      search: { status: "open" },
    }),
  },
  {
    title: "Поднимать на втором использовании",
    rule: "Т4",
    text: "Поля задачи нужны созданию и редактированию. Их ближайший общий предок — tasks/, поэтому блок лежит в tasks/-components, а не в shared: он знает, что такое задача. Первое использование — на месте, второе — у общего предка, в shared — только то, что не знает домена.",
    focus: `${TASKS}/-components/task-form`,
    link: linkOptions({
      to: "/projects/$projectId/tasks/new",
      params: { projectId: "apollo" },
      search: {},
    }),
  },
  {
    title: "Дублировать сборку — нормально",
    rule: "Т4",
    text: "Страницы создания и редактирования похожи, и это правильно: общие блоки вынесены, а сборка у каждой своя. Слить их через проп mode — значит протащить ветвление в каждый блок. Процент сходства здесь измерен по исходникам, а не написан в комментарии.",
    focus: "src/routes/compare/compare.page.tsx",
    link: linkOptions({ to: "/compare", search: {} }),
  },
  {
    title: "Импорт — только от предков",
    rule: "Т2 · Т3",
    text: "wizard-steps импортирует wizard.context.tsx — это файл предка, можно. Из projects/ нельзя: соседняя ветка. Родитель не берёт ничего у детей, а слои смотрят только вниз: app → routes → shared. Это проверяет pnpm lint, CI падает на нарушении.",
    focus: "src/routes/wizard/-components/wizard-steps/wizard-steps.tsx",
    link: linkOptions({ to: "/wizard", search: {} }),
  },
  {
    title: "Дальше — в своём проекте",
    rule: "Т1–Т11",
    text: "Все требования — в README, коротко и с проверками. Чтобы ассистент писал код по этим правилам, подключите llms.txt: скачайте его в репозиторий и сошлитесь из CLAUDE.md или AGENTS.md. Скрипт проверки архитектуры копируется в CI как есть.",
    focus: "src",
    link: linkOptions({ to: "/projects", search: {} }),
  },
];
