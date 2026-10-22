"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MoreHorizontal, Plus, Share2, SlidersHorizontal } from "lucide-react";
import { ExplorePill, LaunchLabel, PricingBlueButton } from "@/components/ui";
import { boardColumns, initialTasks, type BoardColumn, type Task } from "./mock-data";
import { BoardFilters } from "./board-filters";
import { SortableTaskCard, TaskCard } from "./task-card";
import { TaskDetailsModal } from "./task-details-modal";
import { TaskEditorModal } from "./task-editor-modal";
import { UndoToast, type UndoNotice } from "./undo-toast";

type TaskMap = Record<string, Task[]>;

type EditorState = {
  columnId: string;
  key: number;
  mode: "create" | "edit";
  task?: Task;
};

type UndoState = {
  notice: UndoNotice;
  snapshot: TaskMap;
};

export function TaskBoard({ boardTitle }: { boardTitle: string }) {
  const [tasks, setTasks] = useState<TaskMap>(() => cloneTaskMap(initialTasks));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [priorityFilters, setPriorityFilters] = useState<Task["priority"][]>([]);
  const [assigneeFilters, setAssigneeFilters] = useState<string[]>([]);
  const dragSnapshotRef = useRef<TaskMap | null>(null);
  const justDraggedRef = useRef(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const totalTaskCount = useMemo(
    () => Object.values(tasks).reduce((total, items) => total + items.length, 0),
    [tasks],
  );

  const assignees = useMemo(() => {
    const people = new Map<string, Task["assignees"][number]>();
    Object.values(tasks).flat().forEach((task) => {
      task.assignees.forEach((assignee) => people.set(assignee.name, assignee));
    });
    return [...people.values()].sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [tasks]);

  const hasActiveFilters =
    filterQuery.trim().length > 0 ||
    priorityFilters.length > 0 ||
    assigneeFilters.length > 0;

  const activeFilterCount =
    (filterQuery.trim() ? 1 : 0) + priorityFilters.length + assigneeFilters.length;

  const visibleTasks = useMemo(() => {
    const normalizedQuery = filterQuery.trim().toLowerCase();

    return Object.fromEntries(
      Object.entries(tasks).map(([columnId, items]) => [
        columnId,
        items.filter((task) => {
          const searchableText = [
            task.title,
            task.description,
            task.dueDate,
            task.priority,
            ...task.tags,
            ...task.assignees.flatMap((assignee) => [assignee.name, assignee.initials]),
          ]
            .join(" ")
            .toLowerCase();

          const matchesQuery =
            normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
          const matchesPriority =
            priorityFilters.length === 0 || priorityFilters.includes(task.priority);
          const matchesAssignee =
            assigneeFilters.length === 0 ||
            task.assignees.some((assignee) => assigneeFilters.includes(assignee.name));

          return matchesQuery && matchesPriority && matchesAssignee;
        }),
      ]),
    ) as TaskMap;
  }, [assigneeFilters, filterQuery, priorityFilters, tasks]);

  const visibleTaskCount = useMemo(
    () => Object.values(visibleTasks).reduce((total, items) => total + items.length, 0),
    [visibleTasks],
  );

  const showUndo = useCallback((message: string, snapshot: TaskMap) => {
    setUndoState({
      notice: { id: Date.now(), message },
      snapshot,
    });
  }, []);

  useEffect(() => {
    if (!undoState) return;
    const timeout = window.setTimeout(() => setUndoState(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [undoState]);

  useEffect(() => {
    if (!isFiltersOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!filterMenuRef.current?.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFiltersOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFiltersOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeTask = useMemo(
    () => (activeId ? findTask(tasks, activeId) : null),
    [activeId, tasks],
  );

  const selectedStatus = useMemo(() => {
    if (!selectedTask) return "Task";
    const column = boardColumns.find((item) =>
      tasks[item.id]?.some((task) => task.id === selectedTask.id),
    );
    return column?.title ?? "Task";
  }, [selectedTask, tasks]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    dragSnapshotRef.current = cloneTaskMap(tasks);
    justDraggedRef.current = true;
    setActiveId(String(active.id));
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    setTasks((current) => {
      const activeContainer = findContainer(current, active.id);
      const overContainer = findContainer(current, over.id);

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return current;
      }

      const activeItems = current[activeContainer];
      const overItems = current[overContainer];
      const activeIndex = activeItems.findIndex((task) => task.id === String(active.id));
      const overIndex = overItems.findIndex((task) => task.id === String(over.id));
      const movingTask = activeItems[activeIndex];

      if (!movingTask) return current;

      const insertAt = overIndex >= 0 ? overIndex : overItems.length;

      return {
        ...current,
        [activeContainer]: activeItems.filter((task) => task.id !== movingTask.id),
        [overContainer]: [
          ...overItems.slice(0, insertAt),
          movingTask,
          ...overItems.slice(insertAt),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const snapshot = dragSnapshotRef.current;
    if (over) {
      setTasks((current) => {
        const activeContainer = findContainer(current, active.id);
        const overContainer = findContainer(current, over.id);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
          return current;
        }

        const items = current[activeContainer];
        const activeIndex = items.findIndex((task) => task.id === String(active.id));
        const overIndex = items.findIndex((task) => task.id === String(over.id));

        if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) return current;

        return { ...current, [activeContainer]: arrayMove(items, activeIndex, overIndex) };
      });
      if (snapshot) showUndo("Task moved", snapshot);
    }

    dragSnapshotRef.current = null;
    setActiveId(null);
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 0);
  };

  const handleDragCancel = () => {
    if (dragSnapshotRef.current) setTasks(dragSnapshotRef.current);
    dragSnapshotRef.current = null;
    setActiveId(null);
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 0);
  };

  const handleOpenTask = useCallback((task: Task) => {
    if (!justDraggedRef.current) setSelectedTask(task);
  }, []);

  const handleCloseTask = useCallback(() => setSelectedTask(null), []);

  const openCreateTask = useCallback((columnId = "to-do") => {
    setEditor({ mode: "create", columnId, key: Date.now() });
  }, []);

  const openEditTask = useCallback((task: Task) => {
    const columnId = findContainerForTask(tasks, task.id) ?? "to-do";
    setSelectedTask(null);
    setEditor({ mode: "edit", columnId, task, key: Date.now() });
  }, [tasks]);

  const handleEditorSubmit = (nextTask: Task, columnId: string) => {
    const snapshot = cloneTaskMap(tasks);
    const isEditing = editor?.mode === "edit";

    setTasks((current) => {
      const withoutTask = Object.fromEntries(
        Object.entries(current).map(([id, items]) => [
          id,
          items.filter((item) => item.id !== nextTask.id),
        ]),
      ) as TaskMap;

      return {
        ...withoutTask,
        [columnId]: [...(withoutTask[columnId] ?? []), nextTask],
      };
    });
    setEditor(null);
    setSelectedTask(nextTask);
    showUndo(isEditing ? "Task updated" : "Task created", snapshot);
  };

  const handleUpdateTask = useCallback((nextTask: Task) => {
    setTasks((current) =>
      Object.fromEntries(
        Object.entries(current).map(([columnId, items]) => [
          columnId,
          items.map((item) => (item.id === nextTask.id ? nextTask : item)),
        ]),
      ),
    );
    setSelectedTask(nextTask);
  }, []);

  const handleDuplicateTask = (task: Task) => {
    const snapshot = cloneTaskMap(tasks);
    const columnId = findContainerForTask(tasks, task.id) ?? "to-do";
    const duplicate: Task = {
      ...task,
      id: `${task.id}-copy-${Date.now()}`,
      title: `${task.title} copy`,
      subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
    };

    setTasks((current) => ({
      ...current,
      [columnId]: [...current[columnId], duplicate],
    }));
    setSelectedTask(duplicate);
    showUndo("Task duplicated", snapshot);
  };

  const removeTask = (task: Task, action: "archived" | "deleted") => {
    const snapshot = cloneTaskMap(tasks);
    setTasks((current) =>
      Object.fromEntries(
        Object.entries(current).map(([columnId, items]) => [
          columnId,
          items.filter((item) => item.id !== task.id),
        ]),
      ),
    );
    setSelectedTask(null);
    showUndo(`Task ${action}`, snapshot);
  };

  const handleUndo = () => {
    if (!undoState) return;
    setTasks(cloneTaskMap(undoState.snapshot));
    setSelectedTask(null);
    setUndoState(null);
  };

  const togglePriorityFilter = (priority: Task["priority"]) => {
    setPriorityFilters((current) =>
      current.includes(priority)
        ? current.filter((item) => item !== priority)
        : [...current, priority],
    );
  };

  const toggleAssigneeFilter = (name: string) => {
    setAssigneeFilters((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  };

  const clearFilters = () => {
    setFilterQuery("");
    setPriorityFilters([]);
    setAssigneeFilters([]);
  };

  return (
    <section className="min-h-[calc(100vh-44px)] bg-studio-mist pb-28">
      <div className="sticky top-0 z-30 px-20 pt-20 max-md:px-12 max-md:pt-12">
        <div className="mx-auto flex min-h-[64px] max-w-[1600px] items-center justify-between gap-20 rounded-[20px] border border-hairline-silver bg-gallery-white px-20 py-12 max-md:items-start max-md:flex-col">
          <div className="flex items-center gap-16">
            <div>
              <LaunchLabel>ACTIVE BOARD</LaunchLabel>
              <h1 className="mt-4 font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
                {boardTitle}
              </h1>
            </div>
            <div className="hidden items-center -space-x-8 sm:flex" aria-label="Project collaborators">
              {['AM', 'JT', 'SK', 'NP'].map((initials, index) => (
                <span
                  key={initials}
                  className={`grid size-28 place-items-center rounded-full border-2 border-gallery-white font-sf-pro-text text-[9px] font-semibold ${index === 0 ? "bg-ink text-gallery-white" : "bg-control-gray text-ink"}`}
                >
                  {initials}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div ref={filterMenuRef} className="relative">
              <ExplorePill
                aria-expanded={isFiltersOpen}
                aria-haspopup="dialog"
                onClick={() => setIsFiltersOpen((current) => !current)}
                className={hasActiveFilters ? "border-apple-blue bg-paper-frost text-apple-blue" : ""}
              >
                <SlidersHorizontal aria-hidden="true" size={14} strokeWidth={1.8} />
                Filter
                {activeFilterCount > 0 ? (
                  <span className="grid size-16 place-items-center rounded-full bg-ink font-sf-pro-text text-[9px] font-semibold text-gallery-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </ExplorePill>

              <AnimatePresence>
                {isFiltersOpen ? (
                  <BoardFilters
                    assignees={assignees}
                    query={filterQuery}
                    selectedPriorities={priorityFilters}
                    selectedAssignees={assigneeFilters}
                    resultCount={visibleTaskCount}
                    totalCount={totalTaskCount}
                    onQueryChange={setFilterQuery}
                    onTogglePriority={togglePriorityFilter}
                    onToggleAssignee={toggleAssigneeFilter}
                    onClear={clearFilters}
                    onClose={() => setIsFiltersOpen(false)}
                  />
                ) : null}
              </AnimatePresence>
            </div>
            <ExplorePill>
              <Share2 aria-hidden="true" size={14} strokeWidth={1.8} />
              Share
            </ExplorePill>
            <PricingBlueButton onClick={() => openCreateTask()}>
              <Plus aria-hidden="true" size={14} strokeWidth={2} />
              Add task
            </PricingBlueButton>
            <button
              type="button"
              aria-label="More board options"
              className="grid size-32 place-items-center rounded-full text-ink outline-none transition-colors hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
            >
              <MoreHorizontal aria-hidden="true" size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1640px] px-20 pt-28 max-md:px-12">
        <div className="mb-20 flex items-end justify-between gap-20 px-8">
          <div>
            <p className="font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
              Launch workspace
            </p>
            <h2 className="mt-8 font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink">
              Keep the launch moving.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            {hasActiveFilters ? (
              <p className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-apple-blue">
                {visibleTaskCount} matching {visibleTaskCount === 1 ? "task" : "tasks"}
              </p>
            ) : null}
            <p className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
              Drag a card to update its status · Select a card for details
            </p>
          </div>
        </div>

        <DndContext
          id="sali-board-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex min-h-[620px] gap-16 overflow-x-auto pb-20">
            {boardColumns.map((column) => (
              <BoardColumnView
                key={column.id}
                column={column}
                isFiltered={hasActiveFilters}
                onAddTask={openCreateTask}
                onOpenTask={handleOpenTask}
                tasks={visibleTasks[column.id] ?? []}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={reduceMotion ? null : undefined}>
            {activeTask ? (
              <motion.div
                initial={
                  reduceMotion
                    ? {
                        opacity: 0,
                        transform:
                          "translate3d(0, 0, 0) scale(1) rotate(0deg)",
                      }
                    : {
                        opacity: 1,
                        transform:
                          "translate3d(0, 0, 0) scale(0.98) rotate(0deg)",
                      }
                }
                animate={
                  reduceMotion
                    ? {
                        opacity: 1,
                        transform:
                          "translate3d(0, 0, 0) scale(1) rotate(0deg)",
                      }
                    : {
                        opacity: 1,
                        transform:
                          "translate3d(0, 0, 0) scale(1.02) rotate(0.6deg)",
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.12, ease: [0.23, 1, 0.32, 1] }
                    : { type: "spring", duration: 0.5, bounce: 0.2 }
                }
                className="w-[300px] cursor-grabbing"
              >
                <TaskCard task={activeTask} overlay />
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        status={selectedStatus}
        onClose={handleCloseTask}
        onEdit={openEditTask}
        onDuplicate={handleDuplicateTask}
        onArchive={(task) => removeTask(task, "archived")}
        onDelete={(task) => removeTask(task, "deleted")}
        onUpdateTask={handleUpdateTask}
      />

      <AnimatePresence>
        {editor ? (
          <TaskEditorModal
            key={editor.key}
            mode={editor.mode}
            task={editor.task}
            columns={boardColumns}
            initialColumnId={editor.columnId}
            onClose={() => setEditor(null)}
            onSubmit={handleEditorSubmit}
          />
        ) : null}
      </AnimatePresence>

      <UndoToast
        notice={undoState?.notice ?? null}
        onUndo={handleUndo}
        onDismiss={() => setUndoState(null)}
      />
    </section>
  );
}

function BoardColumnView({
  column,
  isFiltered,
  onAddTask,
  onOpenTask,
  tasks,
}: {
  column: BoardColumn;
  isFiltered: boolean;
  onAddTask: (columnId: string) => void;
  onOpenTask: (task: Task) => void;
  tasks: Task[];
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`${column.id}-title`}
      className={`flex w-[300px] shrink-0 flex-col rounded-[28px] p-12 transition-colors duration-200 ${isOver ? "bg-control-gray" : "bg-paper-frost"}`}
    >
      <header className="flex items-center justify-between gap-12 px-8 py-8">
        <div className="flex items-center gap-8">
          <h3
            id={`${column.id}-title`}
            className="font-sf-pro-text text-body-small font-semibold leading-body-small tracking-body-small text-ink"
          >
            {column.title}
          </h3>
          <span className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Add task to ${column.title}`}
          onClick={() => onAddTask(column.id)}
          className="grid size-28 place-items-center rounded-full text-slate outline-none transition-colors hover:bg-gallery-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        >
          <Plus aria-hidden="true" size={15} strokeWidth={1.8} />
        </button>
      </header>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-8 flex min-h-[120px] flex-1 flex-col gap-8">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              onOpen={onOpenTask}
            />
          ))}
          {tasks.length === 0 ? (
            <div className="grid min-h-[120px] place-items-center rounded-[20px] border border-dashed border-hairline-silver px-20 text-center">
              <p className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                {isFiltered ? "No matching tasks" : "Drop a task here"}
              </p>
            </div>
          ) : null}
        </div>
      </SortableContext>
    </section>
  );
}

function findContainer(containers: TaskMap, id: UniqueIdentifier) {
  const stringId = String(id);
  if (stringId in containers) return stringId;

  return Object.keys(containers).find((containerId) =>
    containers[containerId].some((task) => task.id === stringId),
  );
}

function findTask(containers: TaskMap, taskId: string) {
  for (const items of Object.values(containers)) {
    const task = items.find((item) => item.id === taskId);
    if (task) return task;
  }
  return null;
}

function findContainerForTask(containers: TaskMap, taskId: string) {
  return Object.keys(containers).find((columnId) =>
    containers[columnId].some((task) => task.id === taskId),
  );
}

function cloneTaskMap(source: TaskMap): TaskMap {
  return Object.fromEntries(
    Object.entries(source).map(([columnId, tasks]) => [columnId, [...tasks]]),
  );
}
