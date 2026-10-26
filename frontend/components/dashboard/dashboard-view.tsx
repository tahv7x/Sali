"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, Plus, Users } from "lucide-react";
import { PricingBlueButton, SearchInput } from "@/components/ui";
import {
  boardStoreEvent,
  createStoredBoard,
  getStoredBoards,
  initialBoards,
  type BoardSummary,
} from "@/lib/board-store";
import { cardMotion, fadeUp, revealViewport, stagger } from "@/lib/motion";
import { NewBoardModal } from "./new-board-modal";

export function DashboardView() {
  const [boards, setBoards] = useState<BoardSummary[]>(initialBoards);
  const [query, setQuery] = useState("");
  const [showNewBoard, setShowNewBoard] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const filteredBoards = useMemo(
    () => boards.filter((board) => `${board.title} ${board.description}`.toLowerCase().includes(query.toLowerCase())),
    [boards, query],
  );

  useEffect(() => {
    const syncBoards = () => setBoards(getStoredBoards());
    syncBoards();
    window.addEventListener(boardStoreEvent, syncBoards);
    window.addEventListener("storage", syncBoards);

    if (window.location.hash === "#board-search") {
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }

    return () => {
      window.removeEventListener(boardStoreEvent, syncBoards);
      window.removeEventListener("storage", syncBoards);
    };
  }, []);

  const createBoard = ({ description, title }: { description: string; title: string }) => {
    const baseId = slugify(title) || "untitled-board";
    const id = boards.some((board) => board.id === baseId)
      ? `${baseId}-${Date.now()}`
      : baseId;

    createStoredBoard({
      id,
      title,
      description,
      progress: 0,
      tasks: 0,
      members: 1,
      updated: "Just now",
    });
    setBoards(getStoredBoards());
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
          ref={searchRef}
          id="board-search"
          label="Search boards"
          placeholder="Search by name or description"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <motion.div
        className="mt-40 grid grid-cols-2 gap-20 max-md:grid-cols-1"
        variants={stagger}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={revealViewport}
      >
        {filteredBoards.map((board) => (
          <motion.div
            key={board.id}
            variants={fadeUp}
          >
            <motion.div
              whileHover={reduceMotion ? undefined : cardMotion.whileHover}
              transition={cardMotion.transition}
            >
              <Link
                href={`/boards/${board.id}`}
                className="group flex min-h-[270px] flex-col rounded-[28px] border border-transparent bg-gallery-white p-28 outline-none transition-colors duration-200 hover:border-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
              >
                <div className="flex items-start justify-between gap-20">
                  <div className="min-w-0">
                    <h2 className="break-words font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink">
                      {board.title}
                    </h2>
                    <p className="mt-12 break-words font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
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
                  <div
                    role="progressbar"
                    aria-label={`${board.title} completion`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={board.progress}
                    className="mt-8 h-4 overflow-hidden rounded-full bg-control-gray"
                  >
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{ width: `${Math.min(100, Math.max(0, board.progress))}%` }}
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
      </motion.div>

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
