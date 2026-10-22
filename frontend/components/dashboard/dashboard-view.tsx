"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, Plus, Users } from "lucide-react";
import { PricingBlueButton, SearchInput } from "@/components/ui";
import { NewBoardModal } from "./new-board-modal";

const initialBoards = [
  {
    id: "product-launch",
    title: "Product launch",
    description: "Positioning, creative, and go-to-market milestones.",
    progress: 72,
    tasks: 18,
    members: 4,
    updated: "12 min ago",
  },
  {
    id: "brand-refresh",
    title: "Brand refresh",
    description: "A clear home for identity decisions and rollout work.",
    progress: 48,
    tasks: 14,
    members: 3,
    updated: "Yesterday",
  },
  {
    id: "mobile-app",
    title: "Mobile app",
    description: "Interaction details for the next Sali mobile release.",
    progress: 86,
    tasks: 22,
    members: 5,
    updated: "2 days ago",
  },
  {
    id: "research-sprint",
    title: "Research sprint",
    description: "Customer interviews, patterns, and opportunity areas.",
    progress: 35,
    tasks: 11,
    members: 2,
    updated: "4 days ago",
  },
];

export function DashboardView() {
  const [boards, setBoards] = useState(initialBoards);
  const [query, setQuery] = useState("");
  const [showNewBoard, setShowNewBoard] = useState(false);
  const reduceMotion = useReducedMotion();
  const filteredBoards = useMemo(
    () => boards.filter((board) => `${board.title} ${board.description}`.toLowerCase().includes(query.toLowerCase())),
    [boards, query],
  );

  const createBoard = ({ description, title }: { description: string; title: string }) => {
    const baseId = slugify(title) || "untitled-board";
    const id = boards.some((board) => board.id === baseId)
      ? `${baseId}-${Date.now()}`
      : baseId;

    setBoards((current) => [
      {
        id,
        title,
        description,
        progress: 0,
        tasks: 0,
        members: 1,
        updated: "Just now",
      },
      ...current,
    ]);
    setShowNewBoard(false);
  };

  return (
    <section className="mx-auto min-h-[calc(100vh-44px)] max-w-[1200px] px-20 py-64 max-md:px-16 max-md:py-48">
      <div className="flex items-end justify-between gap-32 max-md:items-start max-md:flex-col">
        <div>
          <p className="font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
            Workspace
          </p>
          <h1 className="mt-8 font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
            Your boards
          </h1>
          <p className="mt-16 max-w-[560px] font-sf-pro-text text-body leading-body tracking-body text-slate">
            Pick up where you left off, or make room for something new.
          </p>
        </div>
        <PricingBlueButton aria-label="Create a new board" onClick={() => setShowNewBoard(true)}>
          <Plus aria-hidden="true" size={14} strokeWidth={2} />
          New board
        </PricingBlueButton>
      </div>

      <div className="mt-40 max-w-[420px]">
        <SearchInput
          label="Search boards"
          placeholder="Search by name or description"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="mt-40 grid grid-cols-2 gap-20 max-md:grid-cols-1">
        {filteredBoards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, transform: "translateY(14px)" }
            }
            animate={
              reduceMotion
                ? {
                    opacity: 1,
                    transition: {
                      duration: 0.12,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  }
                : {
                    opacity: 1,
                    transform: "translateY(0px)",
                    transition: {
                      duration: 0.22,
                      delay: index * 0.05,
                      ease: [0.23, 1, 0.32, 1],
                    },
                  }
            }
          >
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { transform: "translateY(0px)" }
              }
              whileHover={
                reduceMotion
                  ? undefined
                  : { transform: "translateY(-2px)" }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.14,
                      delay: 0,
                      ease: [0.25, 0.1, 0.25, 1],
                    }
              }
            >
              <Link
                href={`/boards/${board.id}`}
                className="group flex min-h-[270px] flex-col rounded-[28px] bg-gallery-white p-28 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
              >
                <div className="flex items-start justify-between gap-20">
                  <div>
                    <h2 className="font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink">
                      {board.title}
                    </h2>
                    <p className="mt-12 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
                      {board.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.6}
                    className="shrink-0 text-slate transition-colors group-hover:text-ink"
                  />
                </div>

                <div className="mt-auto pt-40">
                  <div className="flex items-center justify-between font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                    <span>{board.progress}% complete</span>
                    <span>{board.tasks} tasks</span>
                  </div>
                  <div className="mt-8 h-4 overflow-hidden rounded-full bg-control-gray">
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{ width: `${board.progress}%` }}
                    />
                  </div>
                  <div className="mt-20 flex items-center gap-20 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                    <span className="inline-flex items-center gap-4">
                      <Users aria-hidden="true" size={13} strokeWidth={1.7} />
                      {board.members}
                    </span>
                    <span className="inline-flex items-center gap-4">
                      <Clock3 aria-hidden="true" size={13} strokeWidth={1.7} />
                      {board.updated}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {filteredBoards.length === 0 ? (
        <div className="mt-40 rounded-[28px] bg-gallery-white p-40 text-center">
          <p className="font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
            No boards found
          </p>
          <p className="mt-8 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
            Try a different search term.
          </p>
        </div>
      ) : null}

      <AnimatePresence>
        {showNewBoard ? (
          <NewBoardModal
            key="new-board"
            onClose={() => setShowNewBoard(false)}
            onCreate={createBoard}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
