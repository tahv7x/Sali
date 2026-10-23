"use client";

import { RotateCcw } from "lucide-react";
import { PricingBlueButton } from "@/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100vh-44px)] place-items-center bg-studio-mist px-20 py-64">
      <div className="w-full max-w-[560px] rounded-[28px] bg-gallery-white p-40 text-center">
        <p className="font-sf-pro-text text-body-small leading-body-small tracking-body-small text-launch-orange">
          Something went wrong
        </p>
        <h1 className="mt-12 font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
          Your work is still here.
        </h1>
        <p className="mt-16 font-sf-pro-text text-body leading-body tracking-body text-slate">
          Try loading this view again. Your local boards and tasks will remain saved on this device.
        </p>
        <PricingBlueButton className="mt-28" onClick={reset}>
          <RotateCcw aria-hidden="true" size={14} strokeWidth={1.9} />
          Try again
        </PricingBlueButton>
      </div>
    </section>
  );
}
