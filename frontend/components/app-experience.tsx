"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { fadeUp, transition } from "@/lib/motion";

type AppExperienceProps = {
  children: ReactNode;
  navigation: ReactNode;
};

function OpeningLoader({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Preparing Sali"
      className="fixed inset-0 z-[100] grid place-items-center bg-gallery-white px-24"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? transition.fast : transition.base}
    >
      <div className="flex w-full max-w-[280px] flex-col items-center text-center">
        <motion.div
          className="relative grid size-64 place-items-center rounded-full border border-control-gray bg-paper-frost text-apple-blue"
          initial={reduceMotion ? false : { transform: "scale(0.96)", opacity: 0 }}
          animate={{ transform: "scale(1)", opacity: 1 }}
          transition={transition.base}
        >
          <CheckCircle2 aria-hidden="true" size={28} strokeWidth={1.55} />
          <motion.span
            aria-hidden="true"
            className="absolute right-[7px] top-[7px] size-8 rounded-full bg-pricing-blue"
            initial={reduceMotion ? false : { transform: "scale(0.96)", opacity: 0 }}
            animate={{ transform: "scale(1)", opacity: 1 }}
            transition={{ ...transition.fast, delay: 0.38 }}
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          transition={{ ...transition.base, delay: reduceMotion ? 0 : 0.18 }}
        >
          <p className="mt-20 font-sf-pro-display text-product-kicker font-semibold tracking-product-kicker text-ink">
            Sali
          </p>
          <p className="mt-8 font-sf-pro-text text-body-small tracking-body-small text-steel">
            Preparing your workspace
          </p>
        </motion.div>

        <div className="mt-28 h-4 w-full overflow-hidden rounded-full-5 bg-control-gray">
          <motion.div
            className="h-full origin-left rounded-full-5 bg-pricing-blue"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={reduceMotion ? transition.fast : transition.slow}
          />
        </div>

        <motion.div
          className="mt-16 flex items-center gap-8 font-sf-pro-text text-compact-control tracking-compact-control text-slate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.fast, delay: reduceMotion ? 0 : 0.55 }}
        >
          <span className="grid size-16 place-items-center rounded-full bg-paper-frost text-apple-blue">
            <Check aria-hidden="true" size={11} strokeWidth={2} />
          </span>
          Everything is ready
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AppExperience({ children, navigation }: AppExperienceProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    let hasSeenOpening = false;
    try {
      hasSeenOpening = window.sessionStorage.getItem("sali.opening-seen") === "1";
    } catch {
      hasSeenOpening = false;
    }
    if (hasSeenOpening) {
      const skipTimer = window.setTimeout(() => setIsOpening(false), 0);
      return () => window.clearTimeout(skipTimer);
    }

    try {
      window.sessionStorage.setItem("sali.opening-seen", "1");
    } catch {
      // The opening still completes when session storage is unavailable.
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(
      () => setIsOpening(false),
      reduceMotion ? 180 : 950,
    );

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!isOpening) {
      document.body.style.overflow = "";
    }
  }, [isOpening]);

  return (
    <MotionConfig reducedMotion="user">
      <div aria-busy={isOpening}>
      <AnimatePresence>
        {isOpening ? <OpeningLoader reduceMotion={reduceMotion} /> : null}
      </AnimatePresence>

      <motion.div
        aria-hidden={isOpening}
        inert={isOpening ? true : undefined}
        className="fixed left-16 right-16 top-12 z-50 mx-auto max-w-[1120px]"
        initial={false}
        animate={
          isOpening
            ? {
                opacity: 0,
                transform: reduceMotion
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -8px, 0)",
              }
            : { opacity: 1, transform: "translate3d(0, 0, 0)" }
        }
        transition={{
          ...(reduceMotion ? transition.fast : transition.base),
          delay: isOpening ? 0 : reduceMotion ? 0 : 0.08,
        }}
      >
        {navigation}
      </motion.div>

      <motion.main
        key={`page-${pathname}`}
        aria-hidden={isOpening}
        inert={isOpening ? true : undefined}
        className="min-h-screen bg-studio-mist pt-[76px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={transition.fast}
      >
        {children}
      </motion.main>
      </div>
    </MotionConfig>
  );
}
