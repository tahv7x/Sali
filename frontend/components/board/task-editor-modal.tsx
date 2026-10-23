"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { PricingBlueButton, RoundedInput, useDialogFocus } from "@/components/ui";
import { useMediaQuery } from "@/components/ui/use-media-query";
import type { BoardColumn, Priority, Task } from "./mock-data";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];
const drawerEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

type TaskEditorModalProps = {
  columns: BoardColumn[];
  initialColumnId: string;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (task: Task, columnId: string) => void;
  task?: Task;
};

export function TaskEditorModal({
  columns,
  initialColumnId,
  mode,
  onClose,
  onSubmit,
  task,
}: TaskEditorModalProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const titleRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogFocus<HTMLElement>({ initialFocusRef: titleRef, onClose });
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "Medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");
  const [assignees, setAssignees] = useState(
    task?.assignees.map((assignee) => assignee.name).join(", ") ?? "",
  );
  const [subtasks, setSubtasks] = useState(
    task?.subtasks.map((subtask) => subtask.title).join("\n") ?? "",
  );
  const [columnId, setColumnId] = useState(initialColumnId);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give this task a clear title.");
      return;
    }

    const parsedAssignees = assignees
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name, initials: makeInitials(name) }));

    onSubmit(
      {
        id: task?.id ?? `task-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || "No description yet.",
        priority,
        dueDate: dueDate.trim() || "No date",
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        assignees: parsedAssignees.length
          ? parsedAssignees
          : [{ name: "You", initials: "YO" }],
        subtasks: subtasks
          .split("\n")
          .map((title) => title.trim())
          .filter(Boolean)
          .map((title) => ({
            title,
            done: task?.subtasks.find((subtask) => subtask.title === title)?.done ?? false,
          })),
      },
      columnId,
    );
  };

  const panelInitial = reduceMotion
    ? { opacity: 0, transform: "none" }
    : isMobile
      ? { opacity: 1, transform: "translateY(100%) scale(1) rotate(0deg)" }
      : { opacity: 0, transform: "translateY(16px) scale(0.97)" };
  const panelAnimate = reduceMotion
    ? {
        opacity: 1,
        transform: "none",
        transition: { duration: 0.16, ease: easeOut },
      }
    : isMobile
      ? {
          opacity: 1,
          transform: "translateY(0%) scale(1) rotate(0deg)",
          transition: { duration: 0.32, ease: drawerEase },
        }
      : {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          transition: { duration: 0.28, ease: easeOut },
        };
  const panelExit = reduceMotion
    ? {
        opacity: 0,
        transform: "none",
        transition: { duration: 0.12, ease: easeOut },
      }
    : isMobile
      ? {
          opacity: 1,
          transform: "translateY(100%) scale(1) rotate(0deg)",
          transition: { duration: 0.24, ease: drawerEase },
        }
      : {
          opacity: 0,
          transform: "translateY(12px) scale(0.985)",
          transition: { duration: 0.2, ease: easeOut },
        };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-paper-frost/85 p-20 backdrop-blur-[20px] max-md:items-end max-md:p-0"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: reduceMotion ? 0.16 : 0.2, ease: easeOut },
      }}
      exit={{
        opacity: 0,
        transition: { duration: reduceMotion ? 0.12 : 0.16, ease: easeOut },
      }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-editor-title"
        initial={panelInitial}
        animate={panelAnimate}
        exit={panelExit}
        style={{ transformOrigin: isMobile ? "bottom center" : "center center" }}
        className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-hairline-silver bg-gallery-white p-28 max-md:max-h-[94vh] max-md:rounded-b-none"
      >
        <div className="flex items-start justify-between gap-20">
          <div>
            <p className="font-sf-pro-text text-compact-control font-semibold leading-compact-control tracking-compact-control text-launch-orange">
              {mode === "create" ? "NEW TASK" : "EDIT TASK"}
            </p>
            <h2
              id="task-editor-title"
              className="mt-8 font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink"
            >
              {mode === "create" ? "Add something meaningful." : "Refine the details."}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task editor"
            className="grid size-44 shrink-0 place-items-center rounded-full bg-control-gray text-ink outline-none hover:bg-hairline-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            <X aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-32">
          <RoundedInput
            ref={titleRef}
            label="Task title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (error) setError("");
            }}
            placeholder="What needs to happen?"
            maxLength={120}
            error={error || undefined}
          />

          <label className="mt-20 block font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-ink">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add the context your team needs"
              rows={4}
              maxLength={2000}
              className="mt-8 w-full resize-none rounded-[20px] border border-steel bg-gallery-white px-20 py-16 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-ink outline-none placeholder:text-slate focus-visible:border-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
            />
          </label>

          <div className="mt-20 grid grid-cols-2 gap-20 max-sm:grid-cols-1">
            <SelectField label="Status" value={columnId} onChange={setColumnId}>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </SelectField>
            <SelectField label="Priority" value={priority} onChange={(value) => setPriority(value as Priority)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </SelectField>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-20 max-sm:grid-cols-1">
            <RoundedInput label="Due date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} placeholder="Today, Oct 31…" maxLength={40} />
            <RoundedInput label="Tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Design, Launch" hint="Separate tags with commas." maxLength={250} />
          </div>

          <div className="mt-20">
            <RoundedInput label="Assignees" value={assignees} onChange={(event) => setAssignees(event.target.value)} placeholder="Alex Morgan, Sam Kim" hint="Separate names with commas." maxLength={250} />
          </div>

          <label className="mt-20 block font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-ink">
            Subtasks
            <textarea
              value={subtasks}
              onChange={(event) => setSubtasks(event.target.value)}
              placeholder={"Draft the outline\nRequest review\nPublish the final version"}
              rows={4}
              maxLength={1200}
              className="mt-8 w-full resize-y rounded-[20px] border border-steel bg-gallery-white px-20 py-16 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-ink outline-none placeholder:text-slate focus-visible:border-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
            />
            <span className="mt-8 block font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
              Add one subtask per line.
            </span>
          </label>

          <div className="mt-32 flex items-center justify-end gap-12 border-t border-hairline-silver pt-20">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-[9999px] px-16 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-ink outline-none hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
            >
              Cancel
            </button>
            <PricingBlueButton type="submit">
              {mode === "create" ? "Create task" : "Save changes"}
            </PricingBlueButton>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

function SelectField({
  children,
  label,
  onChange,
  value,
}: Readonly<{
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}>) {
  return (
    <label className="block font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-8 h-[44px] w-full rounded-[980px] border border-steel bg-gallery-white px-20 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-ink outline-none focus-visible:border-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
      >
        {children}
      </select>
    </label>
  );
}

function makeInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
