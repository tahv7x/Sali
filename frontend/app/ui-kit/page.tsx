import type { Metadata } from "next";
import { ArrowRight, Plus, SlidersHorizontal } from "lucide-react";
import {
  ExplorePill,
  LaunchLabel,
  PricingBlueButton,
  RoundedInput,
  SearchInput,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "UI Kit — Sali",
  description: "Sali design-system component preview.",
};

export default function UIKitPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-20 py-64 max-md:px-16">
      <div className="mb-48 max-w-[680px]">
        <LaunchLabel>DESIGN SYSTEM · EPIC 2</LaunchLabel>
        <h1 className="mt-12 font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
          Interface primitives, precisely tuned.
        </h1>
        <p className="mt-20 font-sf-pro-text text-body leading-body tracking-body text-slate">
          Compact controls, generous forms, and quiet status typography built
          from the Sali design tokens.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-20 max-lg:grid-cols-1">
        <PreviewCard title="Pill controls">
          <div className="flex flex-wrap items-center gap-12">
            <PricingBlueButton>
              <Plus aria-hidden="true" size={14} strokeWidth={2} />
              New board
            </PricingBlueButton>
            <ExplorePill>
              <SlidersHorizontal aria-hidden="true" size={14} strokeWidth={1.8} />
              Filter
            </ExplorePill>
            <PricingBlueButton>
              Continue
              <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
            </PricingBlueButton>
          </div>
          <div className="flex flex-wrap items-center gap-12">
            <PricingBlueButton disabled>Unavailable</PricingBlueButton>
            <ExplorePill disabled>Disabled</ExplorePill>
          </div>
        </PreviewCard>

        <PreviewCard title="Launch labels">
          <div className="flex flex-col items-start gap-16">
            <LaunchLabel>NEW</LaunchLabel>
            <LaunchLabel>COMING SOON</LaunchLabel>
            <LaunchLabel>EARLY ACCESS</LaunchLabel>
          </div>
        </PreviewCard>

        <PreviewCard title="Rounded inputs" className="col-span-2 max-lg:col-span-1">
          <div className="grid grid-cols-2 gap-20 max-md:grid-cols-1">
            <RoundedInput
              label="Board name"
              placeholder="Product launch"
              hint="Choose a short, memorable title."
            />
            <SearchInput label="Search" placeholder="Search boards and tasks" />
            <RoundedInput
              label="Workspace name"
              defaultValue="Sali Studio"
              error="This workspace name is already in use."
            />
            <RoundedInput
              label="Archived board"
              defaultValue="Q3 planning"
              disabled
            />
          </div>
        </PreviewCard>
      </div>
    </section>
  );
}

function PreviewCard({
  children,
  className = "",
  title,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <article
      className={`flex min-h-[240px] flex-col gap-28 rounded-[28px] bg-gallery-white p-28 ${className}`}
    >
      <h2 className="font-sf-pro-display text-product-nav-title font-semibold leading-product-nav-title tracking-product-nav-title text-ink">
        {title}
      </h2>
      <div className="flex flex-1 flex-col justify-center gap-24">{children}</div>
    </article>
  );
}
