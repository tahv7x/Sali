import type { Transition, Variants, ViewportOptions } from "framer-motion";

export const ease = {
  apple: [0.28, 0.11, 0.32, 1] as const,
  inOut: [0.42, 0, 0.58, 1] as const,
};

export const duration = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  hero: 0.9,
} as const;

export const spring = {
  soft: { type: "spring", stiffness: 300, damping: 30 },
  snappy: { type: "spring", stiffness: 500, damping: 35 },
  drop: { type: "spring", stiffness: 400, damping: 28, mass: 0.8 },
} satisfies Record<string, Transition>;

export const transition = {
  fast: { duration: duration.fast, ease: ease.apple },
  base: { duration: duration.base, ease: ease.apple },
  slow: { duration: duration.slow, ease: ease.apple },
  hero: { duration: duration.hero, ease: ease.apple },
  inOut: { duration: duration.base, ease: ease.inOut },
} satisfies Record<string, Transition>;

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    transform: "translate3d(0, 24px, 0)",
  },
  visible: {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
    transition: transition.slow,
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    transform: "translate3d(0, 16px, 0) scale(0.96)",
  },
  visible: {
    opacity: 1,
    transform: "translate3d(0, 0, 0) scale(1)",
    transition: transition.base,
  },
  exit: {
    opacity: 0,
    transform: "translate3d(0, 8px, 0) scale(0.98)",
    transition: transition.fast,
  },
};

export const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
  exit: { opacity: 0, transition: transition.fast },
};

export const buttonMotion = {
  whileTap: { transform: "scale(0.97)" },
  transition: spring.snappy,
} as const;

export const cardMotion = {
  whileHover: { transform: "translate3d(0, -4px, 0)" },
  transition: spring.soft,
} as const;

export const revealViewport: ViewportOptions = {
  once: true,
  margin: "-80px",
};
