"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import { motion, useReducedMotion } from "framer-motion";
import { MoreHorizontal, Plus, Share2, SlidersHorizontal } from "lucide-react";
import { ExplorePill, LaunchLabel, PricingBlueButton } from "@/components/ui";
import { boardColumns, initialTasks, type BoardColumn, type Task } from "./mock-data";
import { SortableTaskCard, TaskCard } from "./task-card";
import { TaskDetailsModal } from "./task-details-modal";

type TaskMap = Record<string, Task[]>;

export function TaskBoard({ boardTitle }: { boardTitle: string }) {
  const [tasks, setTasks] = useState<TaskMap>(() => cloneTaskMap(initialTasks));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dragSnapshotRef = useRef<TaskMap | null>(null);
  const justDraggedRef = useRef(false);
  const reduceMotion = useReducedMotion();

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
            <ExplorePill>
              <SlidersHorizontal aria-hidden="true" size={14} strokeWidth={1.8} />
              Filter
            </ExplorePill>
            <ExplorePill>
              <Share2 aria-hidden="true" size={14} strokeWidth={1.8} />
              Share
            </ExplorePill>
            <PricingBlueButton>
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
          <p className="hidden font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate md:block">
            Drag a card to update its status · Select a card for details
          </p>
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
                onOpenTask={handleOpenTask}
                tasks={tasks[column.id] ?? []}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={reduceMotion ? null : undefined}>
            {activeTask ? (
              <motion.div
                initial={reduceMotion ? false : { scale: 0.98, rotate: 0 }}
                animate={{ scale: 1.02, rotate: 0.6 }}
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
      />
    </section>
  );
}

function BoardColumnView({
  column,
  onOpenTask,
  tasks,
}: {
  column: BoardColumn;
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
                Drop a task here
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

function cloneTaskMap(source: TaskMap): TaskMap {
  return Object.fromEntries(
    Object.entries(source).map(([columnId, tasks]) => [columnId, [...tasks]]),
  );
}
