"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const appleEase = [0.22, 1, 0.36, 1] as const;

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
      transition={{ duration: reduceMotion ? 0.16 : 0.4, ease: appleEase }}
    >
      <div className="flex w-full max-w-[280px] flex-col items-center text-center">
        <motion.div
          className="relative grid size-64 place-items-center rounded-full border border-control-gray bg-paper-frost text-apple-blue"
          initial={reduceMotion ? false : { scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: appleEase }}
        >
          <CheckCircle2 aria-hidden="true" size={28} strokeWidth={1.55} />
          <motion.span
            aria-hidden="true"
            className="absolute right-[7px] top-[7px] size-8 rounded-full bg-pricing-blue"
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.38, duration: 0.3, ease: appleEase }}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.5, ease: appleEase }}
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
            transition={{
              duration: reduceMotion ? 0.2 : 1.12,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </div>

        <motion.div
          className="mt-16 flex items-center gap-8 font-sf-pro-text text-compact-control tracking-compact-control text-slate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.55, duration: 0.3 }}
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(
      () => setIsOpening(false),
      reduceMotion ? 300 : 1350,
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
    <div aria-busy={isOpening}>
      <AnimatePresence>
        {isOpening ? <OpeningLoader reduceMotion={reduceMotion} /> : null}
      </AnimatePresence>

      <motion.div
        aria-hidden={isOpening}
        initial={false}
        animate={
          isOpening
            ? { opacity: 0, y: reduceMotion ? 0 : -8 }
            : { opacity: 1, y: 0 }
        }
        transition={{
          delay: isOpening ? 0 : reduceMotion ? 0 : 0.08,
          duration: reduceMotion ? 0.12 : 0.45,
          ease: appleEase,
        }}
      >
        {navigation}
      </motion.div>

      <motion.main
        key={`page-${pathname}`}
        aria-hidden={isOpening}
        className="min-h-[calc(100vh-44px)] bg-studio-mist"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{
          duration: reduceMotion ? 0.12 : 0.2,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}
