"use client";

import { motion, useReducedMotion } from "framer-motion";

const appleEase = [0.22, 1, 0.36, 1] as const;

export function PageLoading() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[calc(100vh-44px)] items-center justify-center bg-studio-mist px-24"
    >
      <motion.div
        className="flex flex-col items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: appleEase }}
      >
        <div className="flex items-center gap-8" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="size-8 rounded-full bg-apple-blue"
              animate={
                reduceMotion
                  ? { opacity: 0.65 }
                  : { y: [0, -6, 0], opacity: [0.35, 1, 0.35] }
              }
              transition={{
                duration: 0.8,
                delay: item * 0.12,
                ease: "easeInOut",
                repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </div>
        <p className="mt-16 font-sf-pro-text text-body-small tracking-body-small text-steel">
          Loading your view
        </p>
      </motion.div>
    </div>
  );
}
