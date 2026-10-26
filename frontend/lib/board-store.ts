import { boardColumns, initialTasks, type Task } from "@/components/board/mock-data";

export type TaskMap = Record<string, Task[]>;

export type BoardSummary = {
  description: string;
  id: string;
  members: number;
  progress: number;
  tasks: number;
  title: string;
  updated: string;
};

const BOARDS_KEY = "sali.boards.v1";
const TASKS_KEY_PREFIX = "sali.tasks.v1.";

export const boardStoreEvent = "sali:boards-updated";

export const initialBoards: BoardSummary[] = [
  {
    id: "product-launch",
    title: "Product launch",
    description: "Positioning, creative, and go-to-market milestones.",
    progress: 18,
    tasks: 11,
    members: 4,
    updated: "Sample board",
  },
  {
    id: "brand-refresh",
    title: "Brand refresh",
    description: "A clear home for identity decisions and rollout work.",
    progress: 0,
    tasks: 0,
    members: 1,
    updated: "Ready to start",
  },
  {
    id: "mobile-app",
    title: "Mobile app",
    description: "Interaction details for the next Sali mobile release.",
    progress: 0,
    tasks: 0,
    members: 1,
    updated: "Ready to start",
  },
  {
    id: "research-sprint",
    title: "Research sprint",
    description: "Customer interviews, patterns, and opportunity areas.",
    progress: 0,
    tasks: 0,
    members: 1,
    updated: "Ready to start",
  },
];

export function cloneTaskMap(tasks: TaskMap): TaskMap {
  return Object.fromEntries(
    boardColumns.map((column) => [
      column.id,
      (tasks[column.id] ?? []).map((task) => ({
        ...task,
        assignees: task.assignees.map((assignee) => ({ ...assignee })),
        subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
        tags: [...task.tags],
      })),
    ]),
  );
}

export function emptyTaskMap(): TaskMap {
  return Object.fromEntries(boardColumns.map((column) => [column.id, []]));
}

export function getStoredBoards(): BoardSummary[] {
  if (typeof window === "undefined") return initialBoards;

  try {
    const value = window.localStorage.getItem(BOARDS_KEY);
    if (!value) return initialBoards;
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return initialBoards;

    const validBoards = parsed.filter(isBoardSummary);
    return validBoards.length > 0 ? validBoards : initialBoards;
  } catch {
    return initialBoards;
  }
}

export function saveStoredBoards(boards: BoardSummary[]) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
    window.dispatchEvent(new Event(boardStoreEvent));
    return true;
  } catch {
    return false;
  }
}

export function getStoredTasks(boardId: string): TaskMap {
  const fallback = boardId === "product-launch" ? cloneTaskMap(initialTasks) : emptyTaskMap();
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(`${TASKS_KEY_PREFIX}${boardId}`);
    if (!value) return fallback;
    const parsed: unknown = JSON.parse(value);
    return isTaskMap(parsed) ? cloneTaskMap(parsed) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredTasks(boardId: string, tasks: TaskMap) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(`${TASKS_KEY_PREFIX}${boardId}`, JSON.stringify(tasks));
  } catch {
    return false;
  }

  const taskCount = Object.values(tasks).reduce((total, items) => total + items.length, 0);
  const completedCount = tasks.done?.length ?? 0;
  const boards = getStoredBoards();
  const nextBoards = boards.map((board) =>
    board.id === boardId
      ? {
          ...board,
          progress: taskCount === 0 ? 0 : Math.round((completedCount / taskCount) * 100),
          tasks: taskCount,
          updated: "Just now",
        }
      : board,
  );
  return saveStoredBoards(nextBoards);
}

export function createStoredBoard(board: BoardSummary) {
  const boards = getStoredBoards();
  const savedBoard = saveStoredBoards([
    board,
    ...boards.filter((item) => item.id !== board.id),
  ]);
  return savedBoard && saveStoredTasks(board.id, emptyTaskMap());
}

export function ensureStoredBoard(boardId: string, title: string) {
  const boards = getStoredBoards();
  if (boards.some((board) => board.id === boardId)) return true;
  return saveStoredBoards([
    {
      id: boardId,
      title,
      description: "A focused space for your team’s work.",
      progress: 0,
      tasks: 0,
      members: 1,
      updated: "Just now",
    },
    ...boards,
  ]);
}

function isBoardSummary(value: unknown): value is BoardSummary {
  if (!value || typeof value !== "object") return false;
  const board = value as Partial<BoardSummary>;
  return (
    typeof board.id === "string" &&
    typeof board.title === "string" &&
    typeof board.description === "string" &&
    typeof board.progress === "number" &&
    Number.isFinite(board.progress) &&
    board.progress >= 0 &&
    board.progress <= 100 &&
    typeof board.tasks === "number" &&
    Number.isInteger(board.tasks) &&
    board.tasks >= 0 &&
    typeof board.members === "number" &&
    Number.isInteger(board.members) &&
    board.members >= 0 &&
    typeof board.updated === "string"
  );
}

function isTaskMap(value: unknown): value is TaskMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const taskMap = value as Record<string, unknown>;

  return boardColumns.every((column) => {
    const tasks = taskMap[column.id];
    return tasks === undefined || (Array.isArray(tasks) && tasks.every(isTask));
  });
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const task = value as Partial<Task>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.dueDate === "string" &&
    (task.priority === "High" || task.priority === "Medium" || task.priority === "Low") &&
    Array.isArray(task.tags) &&
    task.tags.every((tag) => typeof tag === "string") &&
    Array.isArray(task.assignees) &&
    task.assignees.every(
      (assignee) =>
        Boolean(assignee) &&
        typeof assignee === "object" &&
        typeof assignee.name === "string" &&
        typeof assignee.initials === "string",
    ) &&
    Array.isArray(task.subtasks) &&
    task.subtasks.every(
      (subtask) =>
        Boolean(subtask) &&
        typeof subtask === "object" &&
        typeof subtask.title === "string" &&
        typeof subtask.done === "boolean",
    )
  );
}
