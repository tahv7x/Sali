"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import type { Priority, Task } from "./mock-data";

const priorityStyles: Record<Priority, string> = {
  High: "bg-launch-orange",
  Medium: "bg-ink",
  Low: "bg-steel",
};

type TaskCardProps = {
  overlay?: boolean;
  task: Task;
};

export function TaskCard({ overlay = false, task }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.done).length;

  return (
    <article
      className={`rounded-[28px] border bg-gallery-white p-20 ${overlay ? "border-steel" : "border-hairline-silver"}`}
    >
      <div className="flex items-center justify-between gap-12">
        <span className="inline-flex items-center gap-8 font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-slate">
          <span className={`size-4 rounded-full ${priorityStyles[task.priority]}`} />
          {task.priority}
        </span>
        {task.subtasks.length > 0 ? (
          <span className="inline-flex items-center gap-4 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
            <CheckCircle2 aria-hidden="true" size={13} strokeWidth={1.8} />
            {completedSubtasks}/{task.subtasks.length}
          </span>
        ) : null}
      </div>

      <h3 className="mt-16 break-words font-sf-pro-text text-body-small font-semibold leading-body-small tracking-body-small text-ink">
        {task.title}
      </h3>

      <div className="mt-16 flex flex-wrap gap-4">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="border-b border-hairline-silver pb-4 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-20 flex items-center justify-between gap-12">
        <span className="inline-flex items-center gap-4 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
          <CalendarDays aria-hidden="true" size={13} strokeWidth={1.7} />
          {task.dueDate}
        </span>
        <AvatarStack assignees={task.assignees} />
      </div>
    </article>
  );
}

type SortableTaskCardProps = {
  columnId: string;
  onOpen: (task: Task) => void;
  task: Task;
};

export function SortableTaskCard({ columnId, onOpen, task }: SortableTaskCardProps) {
  const reduceMotion = useReducedMotion();
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: { type: "task", columnId, task },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: reduceMotion ? undefined : transition,
    opacity: isDragging ? 0.32 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  const { onKeyDown: sortableKeyDown, ...pointerListeners } = listeners ?? {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...pointerListeners}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Press Space to move or Enter to open.`}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onOpen(task);
          return;
        }
        sortableKeyDown?.(event);
      }}
      className="cursor-grab rounded-[28px] outline-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
    >
      <motion.div
        whileHover={
          isDragging || reduceMotion
            ? undefined
            : {
                transform: "translateY(-2px)",
                transition: {
                  duration: 0.14,
                  ease: [0.23, 1, 0.32, 1],
                },
              }
        }
        transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
      >
        <TaskCard task={task} />
      </motion.div>
    </div>
  );
}

export function AvatarStack({ assignees }: { assignees: Task["assignees"] }) {
  return (
    <span className="flex items-center -space-x-8" aria-label={assignees.map((assignee) => assignee.name).join(", ")}>
      {assignees.map((assignee, index) => (
        <span
          key={assignee.name}
          aria-hidden="true"
          className={`grid size-24 place-items-center rounded-full border-2 border-gallery-white font-sf-pro-text text-[9px] font-semibold ${index === 0 ? "bg-ink text-gallery-white" : "bg-control-gray text-ink"}`}
        >
          {assignee.initials}
        </span>
      ))}
    </span>
  );
}
