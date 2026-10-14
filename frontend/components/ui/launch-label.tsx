import type { HTMLAttributes } from "react";

type LaunchLabelProps = HTMLAttributes<HTMLSpanElement>;

export function LaunchLabel({
  children,
  className = "",
  ...props
}: LaunchLabelProps) {
  return (
    <span
      data-slot="launch-label"
      className={`font-sf-pro-text text-compact-control font-semibold leading-compact-control tracking-compact-control text-launch-orange ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
