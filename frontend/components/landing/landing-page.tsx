"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Focus, Move3d } from "lucide-react";
import { LaunchLabel } from "@/components/ui";
import {
  buttonMotion,
  cardMotion,
  fadeUp,
  revealViewport,
  stagger,
  transition,
} from "@/lib/motion";

const previewColumns = [
  {
    title: "To do",
    tasks: ["Write launch story", "Prepare press kit"],
  },
  {
    title: "In progress",
    tasks: ["Refine product page", "Review campaign"],
  },
  {
    title: "Done",
    tasks: ["Approve visual direction", "Set milestones"],
  },
];

const highlights = [
  {
    icon: Move3d,
    title: "Move work naturally.",
    copy: "A tactile board that keeps every transition clear, calm, and immediate.",
  },
  {
    icon: Focus,
    title: "See only what matters.",
    copy: "Purposeful hierarchy turns a busy project into a focused next step.",
  },
  {
    icon: CheckCircle2,
    title: "Finish with confidence.",
    copy: "Thoughtful detail views keep context close without interrupting momentum.",
  },
];

export function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section className="overflow-hidden bg-gallery-white px-20 pb-80 pt-76 max-md:px-16 max-md:pb-64 max-md:pt-52">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <motion.div
            variants={fadeUp}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <p className="font-sf-pro-display text-product-kicker font-semibold leading-product-kicker tracking-product-kicker text-ink">
              Sali Task Board
            </p>
            <h1 className="mx-auto mt-20 max-w-[920px] font-sf-pro-display text-[clamp(48px,7vw,80px)] font-semibold leading-[1.05] tracking-[-1.2px] text-ink">
              Make space for your best work.
            </h1>
            <p className="mx-auto mt-28 max-w-[640px] font-sf-pro-text text-body leading-body tracking-body text-slate">
              A beautifully simple workspace for planning, moving, and finishing
              meaningful work—without the noise.
            </p>

            <div className="mt-32 flex flex-wrap items-center justify-center gap-12">
              <motion.div
                whileTap={reduceMotion ? undefined : buttonMotion.whileTap}
                transition={buttonMotion.transition}
              >
                <Link
                  href="/boards"
                  className="inline-flex min-h-[44px] min-w-[156px] items-center justify-center gap-8 rounded-[9999px] border border-pricing-blue bg-pricing-blue px-24 py-8 font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-gallery-white outline-none hover:border-apple-blue hover:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
                >
                  Open workspace
                  <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
                </Link>
              </motion.div>
              <motion.div
                whileTap={reduceMotion ? undefined : buttonMotion.whileTap}
                transition={buttonMotion.transition}
              >
                <Link
                  href="/boards/product-launch"
                  className="inline-flex min-h-[44px] min-w-[156px] items-center justify-center rounded-[9999px] border border-steel bg-transparent px-24 py-8 font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-ink outline-none hover:border-ink hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
                >
                  View sample board
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    transform: "translate3d(0, 24px, 0) scale(0.985)",
                  }
            }
            animate={{
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
            }}
            transition={{ ...transition.hero, delay: 0.18 }}
            className="mt-64 w-full max-md:mt-48"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : cardMotion.whileHover}
              transition={cardMotion.transition}
              className="w-full rounded-[28px] border border-transparent bg-studio-mist p-20 text-left hover:border-hairline-silver max-md:overflow-x-auto"
            >
              <div className="mb-20 flex items-center justify-between px-8">
                <div>
                  <LaunchLabel>LIVE BOARD</LaunchLabel>
                  <p className="mt-4 font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
                    Product launch
                  </p>
                </div>
                <div className="flex items-center -space-x-8" aria-label="3 collaborators">
                  {["AM", "JT", "SK"].map((initials, index) => (
                    <span
                      key={initials}
                      className={`grid size-28 place-items-center rounded-full border-2 border-studio-mist font-sf-pro-text text-[10px] font-semibold ${index === 0 ? "bg-ink text-gallery-white" : "bg-gallery-white text-ink"}`}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid min-w-[760px] grid-cols-3 gap-12">
                {previewColumns.map((column) => (
                  <div key={column.title} className="rounded-[20px] bg-paper-frost p-12">
                    <div className="mb-12 flex items-center justify-between px-4">
                      <span className="font-sf-pro-text text-body-small font-medium leading-body-small tracking-body-small text-ink">
                        {column.title}
                      </span>
                      <span className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-8">
                      {column.tasks.map((task, taskIndex) => (
                        <motion.div
                          key={task}
                          whileHover={reduceMotion ? undefined : cardMotion.whileHover}
                          transition={cardMotion.transition}
                          className="rounded-[16px] border border-hairline-silver bg-gallery-white p-16 hover:border-steel"
                        >
                          <div className="mb-12 size-4 rounded-full bg-apple-blue" />
                          <p className="font-sf-pro-text text-body-small font-medium leading-body-small tracking-body-small text-ink">
                            {task}
                          </p>
                          <div className="mt-16 flex items-center justify-between">
                            <span className="font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-slate">
                              {taskIndex === 0 ? "Today" : "This week"}
                            </span>
                            <span className="grid size-20 place-items-center rounded-full bg-control-gray font-sf-pro-text text-[9px] font-semibold text-ink">
                              {taskIndex === 0 ? "AM" : "JT"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-studio-mist px-20 py-80 max-md:px-16 max-md:py-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-40 flex items-end justify-between gap-20 max-md:items-start max-md:flex-col">
            <h2 className="max-w-[620px] font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
              Everything you need.
            </h2>
            <Link
              href="/boards"
              className="font-sf-pro-text text-body font-normal leading-body tracking-body text-apple-blue outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
            >
              Explore your boards →
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-3 gap-20 max-lg:grid-cols-1"
            variants={stagger}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={revealViewport}
          >
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <motion.article
                  key={highlight.title}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : cardMotion.whileHover}
                  transition={cardMotion.transition}
                  className="min-h-[300px] rounded-[28px] border border-transparent bg-gallery-white p-28 hover:border-steel"
                >
                  <Icon aria-hidden="true" size={24} strokeWidth={1.5} className="text-ink" />
                  <h3 className="mt-64 font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink">
                    {highlight.title}
                  </h3>
                  <p className="mt-16 font-sf-pro-text text-body leading-feature-copy tracking-feature-copy text-slate">
                    {highlight.copy}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
