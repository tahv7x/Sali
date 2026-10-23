"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import type { Assignee, Priority } from "./mock-data";

type BoardFiltersProps = {
  assignees: Assignee[];
  onClear: () => void;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onToggleAssignee: (name: string) => void;
  onTogglePriority: (priority: Priority) => void;
  query: string;
  resultCount: number;
  selectedAssignees: string[];
  selectedPriorities: Priority[];
  totalCount: number;
};

const priorities: Priority[] = ["High", "Medium", "Low"];
const appleEase = [0.22, 1, 0.36, 1] as const;

export function BoardFilters({
  assignees,
  onClear,
  onClose,
  onQueryChange,
  onToggleAssignee,
  onTogglePriority,
  query,
  resultCount,
  selectedAssignees,
  selectedPriorities,
  totalCount,
}: BoardFiltersProps) {
  const reduceMotion = useReducedMotion();
  const hasFilters =
    query.trim().length > 0 ||
    selectedPriorities.length > 0 ||
    selectedAssignees.length > 0;

  return (
    <motion.section
      role="dialog"
      aria-label="Board filters"
      className="fixed left-12 right-12 top-[92px] z-40 rounded-[28px] border border-hairline-silver bg-gallery-white p-24 md:absolute md:left-auto md:right-0 md:top-[calc(100%+8px)] md:w-[380px]"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.985 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: appleEase }}
    >
      <div className="flex items-start justify-between gap-20">
        <div>
          <p className="font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
            Find the right tasks
          </p>
          <p className="mt-4 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
            Showing {resultCount} of {totalCount} tasks
          </p>
        </div>
        <button
          type="button"
          aria-label="Close filters"
          onClick={onClose}
          className="grid size-44 shrink-0 place-items-center rounded-full text-slate outline-none transition-colors hover:bg-paper-frost hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        >
          <X aria-hidden="true" size={15} strokeWidth={1.8} />
        </button>
      </div>

      <label className="relative mt-20 block">
        <span className="sr-only">Search tasks</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 text-slate"
          size={16}
          strokeWidth={1.8}
        />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search title, tag, or person"
          className="h-[44px] w-full rounded-[980px] border border-steel bg-gallery-white py-12 pl-44 pr-20 font-arial text-[13px] leading-[1.2] text-ink outline-none transition-colors placeholder:text-slate focus-visible:border-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        />
      </label>

      <fieldset className="mt-24 border-0 p-0">
        <legend className="font-sf-pro-text text-body-small font-semibold leading-body-small tracking-body-small text-ink">
          Priority
        </legend>
        <div className="mt-12 flex flex-wrap gap-8">
          {priorities.map((priority) => {
            const selected = selectedPriorities.includes(priority);
            return (
              <FilterChip
                key={priority}
                label={priority}
                selected={selected}
                onClick={() => onTogglePriority(priority)}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-24 border-0 p-0">
        <legend className="font-sf-pro-text text-body-small font-semibold leading-body-small tracking-body-small text-ink">
          Assignee
        </legend>
        <div className="mt-12 grid grid-cols-2 gap-8">
          {assignees.map((assignee) => {
            const selected = selectedAssignees.includes(assignee.name);
            return (
              <button
                key={assignee.name}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleAssignee(assignee.name)}
                className={`flex min-h-[44px] items-center gap-8 rounded-[20px] border px-12 py-8 text-left outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue ${selected ? "border-ink bg-ink text-gallery-white" : "border-hairline-silver bg-gallery-white text-ink hover:bg-paper-frost"}`}
              >
                <span
                  className={`grid size-24 shrink-0 place-items-center rounded-full font-sf-pro-text text-[9px] font-semibold ${selected ? "bg-gallery-white text-ink" : "bg-control-gray text-ink"}`}
                >
                  {assignee.initials}
                </span>
                <span className="min-w-0 flex-1 truncate font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control">
                  {assignee.name}
                </span>
                {selected ? <Check aria-hidden="true" size={13} strokeWidth={2} /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-24 flex items-center justify-between border-t border-control-gray pt-16">
        <button
          type="button"
          disabled={!hasFilters}
          onClick={onClear}
          className="min-h-[44px] rounded-lg px-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-apple-blue outline-none transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue disabled:cursor-default disabled:text-steel disabled:opacity-50"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] rounded-[9999px] border border-pricing-blue bg-pricing-blue px-16 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-gallery-white outline-none transition-colors hover:border-apple-blue hover:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        >
          Done
        </button>
      </div>
    </motion.section>
  );
}

function FilterChip({
  label,
  onClick,
  selected,
}: {
  label: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center gap-8 rounded-[9999px] border px-16 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue ${selected ? "border-ink bg-ink text-gallery-white" : "border-steel bg-gallery-white text-ink hover:bg-paper-frost"}`}
    >
      {selected ? <Check aria-hidden="true" size={12} strokeWidth={2} /> : null}
      {label}
    </button>
  );
}
