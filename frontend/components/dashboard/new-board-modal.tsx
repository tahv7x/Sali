"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { PricingBlueButton, RoundedInput, useDialogFocus } from "@/components/ui";
import { backdrop, scaleIn } from "@/lib/motion";

export function NewBoardModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (board: { description: string; title: string }) => void;
}) {
  const reduceMotion = useReducedMotion();
  const titleRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogFocus<HTMLElement>({ initialFocusRef: titleRef, onClose });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give your board a name.");
      return;
    }
    onCreate({ title: title.trim(), description: description.trim() || "A fresh space for focused work." });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-paper-frost/85 p-20 backdrop-blur-[20px]"
      variants={backdrop}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      exit="exit"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-board-title"
        variants={scaleIn}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        exit="exit"
        className="w-full max-w-[560px] rounded-[28px] border border-hairline-silver bg-gallery-white p-28"
      >
        <div className="flex items-start justify-between gap-20">
          <div>
            <p className="font-sf-pro-text text-compact-control font-semibold leading-compact-control tracking-compact-control text-launch-orange">NEW BOARD</p>
            <h2 id="new-board-title" className="mt-8 font-sf-pro-display text-[28px] font-semibold leading-[1.14] tracking-[-0.015em] text-ink">Make room for the next idea.</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close new board dialog" className="grid size-[44px] shrink-0 place-items-center rounded-full bg-control-gray text-ink outline-none hover:bg-hairline-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue">
            <X aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-32">
          <RoundedInput ref={titleRef} label="Board name" value={title} onChange={(event) => { setTitle(event.target.value); if (error) setError(""); }} placeholder="Website redesign" error={error || undefined} maxLength={80} />
          <div className="mt-20">
            <RoundedInput label="Short description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What will this board help you accomplish?" maxLength={240} />
          </div>
          <div className="mt-32 flex justify-end gap-12 border-t border-hairline-silver pt-20">
            <button type="button" onClick={onClose} className="min-h-[44px] rounded-[9999px] px-16 py-8 font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control text-ink outline-none hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue">Cancel</button>
            <PricingBlueButton type="submit">Create board</PricingBlueButton>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}
