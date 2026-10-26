"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, Copy, Pencil, Tag, Trash2, UserRound, X } from "lucide-react";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { useDialogFocus } from "@/components/ui";
import { backdrop, scaleIn, transition } from "@/lib/motion";
import type { Priority, Task } from "./mock-data";
import { AvatarStack } from "./task-card";

const priorityStyles: Record<Priority, string> = {
  High: "bg-launch-orange",
  Medium: "bg-ink",
  Low: "bg-steel",
};

type TaskDetailsModalProps = {
  onClose: () => void;
  onDelete: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onEdit: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  status: string;
  task: Task | null;
};

export function TaskDetailsModal({
  onClose,
  onDelete,
  onDuplicate,
  onEdit,
  onUpdateTask,
  status,
  task,
}: TaskDetailsModalProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const taskId = task?.id;
  const dialogRef = useDialogFocus<HTMLElement>({
    active: Boolean(taskId),
    initialFocusRef: closeButtonRef,
    onClose,
  });

  const toggleSubtask = (index: number) => {
    if (!task) return;

    onUpdateTask({
      ...task,
      subtasks: task.subtasks.map((subtask, subtaskIndex) =>
        subtaskIndex === index ? { ...subtask, done: !subtask.done } : subtask,
      ),
    });
  };

  const panelVariants = isMobile
    ? {
        hidden: {
          opacity: 1,
          transform: "translate3d(0, 100%, 0)",
        },
        visible: {
          opacity: 1,
          transform: "translate3d(0, 0, 0)",
          transition: transition.base,
        },
        exit: {
          opacity: 1,
          transform: "translate3d(0, 100%, 0)",
          transition: transition.fast,
        },
      }
    : scaleIn;

  return (
    <AnimatePresence>
      {task ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper-frost/85 p-20 backdrop-blur-[20px] max-md:items-end max-md:p-0"
          variants={backdrop}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit="exit"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) onClose();
          }}
        >
          <motion.section
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-details-title"
            variants={panelVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            style={{ transformOrigin: isMobile ? "bottom center" : "center center" }}
            className="max-h-[88vh] w-full max-w-[760px] overflow-y-auto rounded-[28px] border border-hairline-silver bg-gallery-white p-28 max-md:max-h-[92vh] max-md:rounded-b-none max-md:border-b-0"
          >
            <div className="flex items-start justify-between gap-20">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-12">
                  <span className="font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-slate">
                    {status}
                  </span>
                  <span className="inline-flex items-center gap-8 font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-slate">
                    <span className={`size-4 rounded-full ${priorityStyles[task.priority]}`} />
                    {task.priority} priority
                  </span>
                </div>
                <h2
                  id="task-details-title"
                  className="mt-12 max-w-[580px] break-words font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink"
                >
                  {task.title}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close task details"
                onClick={onClose}
                className="grid size-[44px] shrink-0 place-items-center rounded-full bg-control-gray text-ink outline-none transition-colors hover:bg-hairline-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
              >
                <X aria-hidden="true" size={16} strokeWidth={1.8} />
              </button>
            </div>

            <div className="mt-32 grid grid-cols-[minmax(0,1fr)_220px] gap-32 max-md:grid-cols-1">
              <div>
                <section>
                  <h3 className="font-sf-pro-text text-compact-control font-semibold leading-compact-control tracking-compact-control text-ink">
                    Description
                  </h3>
                  <p className="mt-12 break-words font-sf-pro-text text-body leading-body tracking-body text-slate">
                    {task.description}
                  </p>
                </section>

                <section className="mt-32">
                  <div className="flex items-center justify-between gap-20">
                    <h3 className="font-sf-pro-text text-compact-control font-semibold leading-compact-control tracking-compact-control text-ink">
                      Subtasks
                    </h3>
                    <span className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                      {task.subtasks.filter((subtask) => subtask.done).length}/{task.subtasks.length}
                    </span>
                  </div>
                  <div className="mt-12 divide-y divide-hairline-silver border-y border-hairline-silver">
                    {task.subtasks.map((subtask, index) => (
                      <button
                        key={subtask.title}
                        type="button"
                        onClick={() => toggleSubtask(index)}
                        className="flex w-full items-center gap-12 py-16 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-apple-blue"
                      >
                        <span
                          className={`grid size-20 shrink-0 place-items-center rounded-full border ${subtask.done ? "border-ink bg-ink text-gallery-white" : "border-steel bg-gallery-white text-ink [&>svg]:opacity-0"}`}
                        >
                          <Check aria-hidden="true" size={12} strokeWidth={2.2} />
                        </span>
                        <span
                          className={`min-w-0 break-words font-sf-pro-text text-body-small leading-body-small tracking-body-small ${subtask.done ? "text-slate line-through" : "text-ink"}`}
                        >
                          {subtask.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="rounded-[20px] bg-paper-frost p-20">
                <DetailRow icon={CalendarDays} label="Due date">
                  {task.dueDate}
                </DetailRow>
                <DetailRow icon={UserRound} label="Assignees">
                  <AvatarStack assignees={task.assignees} />
                </DetailRow>
                <DetailRow icon={Tag} label="Tags" last>
                  <span className="flex flex-wrap gap-x-8 gap-y-4">
                    {task.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                </DetailRow>
              </aside>
            </div>

            <div className="mt-32 flex flex-wrap items-center justify-between gap-16 border-t border-hairline-silver pt-20">
              <div className="flex flex-wrap items-center gap-8">
                <ActionButton icon={Trash2} label="Delete" onClick={() => onDelete(task)} destructive />
                <ActionButton icon={Copy} label="Duplicate" onClick={() => onDuplicate(task)} />
              </div>
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="inline-flex min-h-[44px] items-center gap-8 rounded-[9999px] border border-pricing-blue bg-pricing-blue px-16 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-gallery-white outline-none transition-colors hover:border-apple-blue hover:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
              >
                <Pencil aria-hidden="true" size={13} strokeWidth={1.8} />
                Edit task
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailRow({
  children,
  icon: Icon,
  label,
  last = false,
}: Readonly<{
  children: React.ReactNode;
  icon: typeof CalendarDays;
  label: string;
  last?: boolean;
}>) {
  return (
    <div className={`py-16 ${last ? "" : "border-b border-hairline-silver"}`}>
      <span className="flex items-center gap-8 font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-slate">
        <Icon aria-hidden="true" size={13} strokeWidth={1.7} />
        {label}
      </span>
      <div className="mt-8 break-words font-sf-pro-text text-body-small font-medium leading-body-small tracking-body-small text-ink">
        {children}
      </div>
    </div>
  );
}

function ActionButton({
  destructive = false,
  icon: Icon,
  label,
  onClick,
}: {
  destructive?: boolean;
  icon: typeof CalendarDays;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center gap-8 rounded-[9999px] px-12 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control outline-none transition-colors hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue ${destructive ? "text-launch-orange" : "text-ink"}`}
    >
      <Icon aria-hidden="true" size={13} strokeWidth={1.8} />
      {label}
    </button>
  );
}
