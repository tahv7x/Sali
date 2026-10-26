import { beforeEach, describe, expect, it } from "vitest";
import {
  cloneTaskMap,
  createStoredBoard,
  emptyTaskMap,
  getStoredBoards,
  getStoredTasks,
  initialBoards,
  saveStoredBoards,
  saveStoredTasks,
  type TaskMap,
} from "@/lib/board-store";
import type { Task } from "@/components/board/mock-data";

const boardsKey = "sali.boards.v1";
const taskKey = (boardId: string) => `sali.tasks.v1.${boardId}`;

const task: Task = {
  id: "task-test",
  title: "Regression task",
  description: "A task used to verify persistence behavior.",
  priority: "Medium",
  dueDate: "Today",
  tags: ["QA"],
  assignees: [{ name: "Alex Morgan", initials: "AM" }],
  subtasks: [{ title: "Verify storage", done: false }],
};

function taskMapWith(overrides: Record<string, Task[]> = {}): TaskMap {
  return { ...emptyTaskMap(), ...overrides };
}

describe("boardStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("falls back to the sample boards when stored board data is malformed", () => {
    window.localStorage.setItem(boardsKey, JSON.stringify([{ id: "broken" }]));

    expect(getStoredBoards()).toEqual(initialBoards);
  });

  it("ignores malformed task payloads instead of crashing the board", () => {
    window.localStorage.setItem(
      taskKey("broken-board"),
      JSON.stringify({ "to-do": [{ id: "missing-required-fields" }] }),
    );

    expect(getStoredTasks("broken-board")).toEqual(emptyTaskMap());
  });

  it("returns deep clones so task edits cannot mutate persisted snapshots", () => {
    const source = taskMapWith({ "to-do": [task] });
    const cloned = cloneTaskMap(source);

    cloned["to-do"][0].assignees[0].name = "Changed";
    cloned["to-do"][0].subtasks[0].done = true;
    cloned["to-do"][0].tags.push("New");

    expect(source["to-do"][0].assignees[0].name).toBe("Alex Morgan");
    expect(source["to-do"][0].subtasks[0].done).toBe(false);
    expect(source["to-do"][0].tags).toEqual(["QA"]);
  });

  it("updates board task counts and completion progress when tasks are saved", () => {
    expect(saveStoredBoards(initialBoards)).toBe(true);
    expect(
      saveStoredTasks(
        "product-launch",
        taskMapWith({ done: [task], "to-do": [{ ...task, id: "task-open" }] }),
      ),
    ).toBe(true);

    const board = getStoredBoards().find((item) => item.id === "product-launch");
    expect(board).toMatchObject({ progress: 50, tasks: 2, updated: "Just now" });
  });

  it("creates a board and initializes all of its columns", () => {
    expect(
      createStoredBoard({
        id: "qa-board",
        title: "QA board",
        description: "Hardening checks",
        progress: 0,
        tasks: 0,
        members: 1,
        updated: "Just now",
      }),
    ).toBe(true);

    expect(getStoredBoards()[0].id).toBe("qa-board");
    expect(getStoredTasks("qa-board")).toEqual(emptyTaskMap());
  });
});
