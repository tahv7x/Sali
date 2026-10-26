"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { transition } from "@/lib/motion";

export type UndoNotice = {
  id: number;
  message: string;
};

export function UndoToast({
  notice,
  onDismiss,
  onUndo,
}: {
  notice: UndoNotice | null;
  onDismiss: () => void;
  onUndo: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {notice ? (
        <motion.div
          key={notice.id}
          role="status"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  transform: "translate3d(0, 16px, 0) scale(0.98)",
                }
          }
          animate={{
            opacity: 1,
            transform: "translate3d(0, 0, 0) scale(1)",
            transition: transition.base,
          }}
          exit={
            reduceMotion
              ? undefined
              : {
                  opacity: 0,
                  transform: "translate3d(0, 10px, 0) scale(0.99)",
                  transition: transition.fast,
                }
          }
          className="fixed bottom-20 left-1/2 z-[80] flex w-[min(420px,calc(100%-32px))] -translate-x-1/2 items-center gap-16 rounded-[20px] border border-hairline-silver bg-gallery-white px-20 py-16"
        >
          <p className="min-w-0 flex-1 font-sf-pro-text text-body-small leading-body-small tracking-body-small text-ink">
            {notice.message}
          </p>
          <button
            type="button"
            onClick={onUndo}
            className="min-h-[44px] rounded-lg px-8 font-sf-pro-text text-body-small font-medium leading-body-small tracking-body-small text-apple-blue outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="grid size-[44px] shrink-0 place-items-center rounded-full text-slate outline-none hover:bg-paper-frost hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            <X aria-hidden="true" size={13} strokeWidth={1.8} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
