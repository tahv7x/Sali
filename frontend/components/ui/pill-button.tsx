"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type PillButtonVariant = "pricing" | "outline";

type PillButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  variant?: PillButtonVariant;
};

const variantStyles: Record<PillButtonVariant, string> = {
  pricing:
    "border border-pricing-blue bg-pricing-blue text-gallery-white hover:border-apple-blue hover:bg-apple-blue disabled:border-control-gray disabled:bg-control-gray disabled:text-slate",
  outline:
    "border border-steel bg-transparent text-ink hover:bg-paper-frost disabled:border-hairline-silver disabled:text-steel",
};

export function PillButton({
  className = "",
  disabled,
  type = "button",
  variant = "pricing",
  ...props
}: PillButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      disabled={disabled}
      data-slot="pill-button"
      data-variant={variant}
      whileHover={disabled || reduceMotion ? undefined : { y: -1 }}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.5 }}
      className={`inline-flex min-h-[44px] items-center justify-center gap-8 rounded-[9999px] px-16 py-8 font-sf-pro-text text-compact-control font-normal leading-compact-control tracking-compact-control outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function PricingBlueButton(props: Omit<PillButtonProps, "variant">) {
  return <PillButton variant="pricing" {...props} />;
}

export function ExplorePill(props: Omit<PillButtonProps, "variant">) {
  return <PillButton variant="outline" {...props} />;
}
