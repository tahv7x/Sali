"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Focus, Move3d } from "lucide-react";
import { LaunchLabel } from "@/components/ui";

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
  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <>
      <section className="overflow-hidden bg-gallery-white px-20 pb-80 pt-76 max-md:px-16 max-md:pb-64 max-md:pt-52">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <motion.div
            {...reveal}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                <Link
                  href="/boards"
                  className="inline-flex min-h-[36px] items-center gap-8 rounded-[9999px] border border-pricing-blue bg-pricing-blue px-20 py-8 font-sf-pro-text text-compact-control font-normal leading-compact-control tracking-compact-control text-gallery-white outline-none transition-colors hover:border-apple-blue hover:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
                >
                  Open workspace
                  <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
                </Link>
              </motion.div>
              <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                <Link
                  href="/boards/product-launch"
                  className="inline-flex min-h-[36px] items-center rounded-[9999px] border border-steel bg-transparent px-20 py-8 font-sf-pro-text text-compact-control font-normal leading-compact-control tracking-compact-control text-ink outline-none transition-colors hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
                >
                  View sample board
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.985 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-64 w-full rounded-[28px] bg-studio-mist p-20 text-left max-md:mt-48 max-md:overflow-x-auto"
          >
            <div className="mb-20 flex items-center justify-between px-8">
              <div>
                <LaunchLabel>LIVE BOARD</LaunchLabel>
                <p className="mt-4 font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
                  Product launch
                </p>
              </div>
              <div className="flex items-center -space-x-8" aria-label="3 collaborators">
                {['AM', 'JT', 'SK'].map((initials, index) => (
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
                      <div
                        key={task}
                        className="rounded-[16px] border border-hairline-silver bg-gallery-white p-16"
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-studio-mist px-20 py-80 max-md:px-16 max-md:py-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-40 flex items-end justify-between gap-20 max-md:items-start max-md:flex-col">
            <h2 className="max-w-[620px] font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
              Everything you need. Nothing you don’t.
            </h2>
            <Link
              href="/boards"
              className="font-sf-pro-text text-body font-normal leading-body tracking-body text-apple-blue outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
            >
              Explore your boards →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-20 max-lg:grid-cols-1">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.article
                  key={highlight.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="min-h-[300px] rounded-[28px] bg-gallery-white p-28"
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
          </div>
        </div>
      </section>
    </>
  );
}
