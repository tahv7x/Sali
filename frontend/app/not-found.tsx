import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[calc(100vh-44px)] place-items-center bg-studio-mist px-20 py-64">
      <div className="w-full max-w-[560px] rounded-[28px] bg-gallery-white p-40 text-center">
        <p className="font-sf-pro-text text-body-small leading-body-small tracking-body-small text-slate">
          Page not found
        </p>
        <h1 className="mt-12 font-sf-pro-display text-feature-heading font-semibold leading-feature-heading tracking-feature-heading text-ink">
          This space doesn’t exist.
        </h1>
        <p className="mt-16 font-sf-pro-text text-body leading-body tracking-body text-slate">
          Return to your boards and keep the work moving.
        </p>
        <Link
          href="/boards"
          className="mx-auto mt-28 inline-flex min-h-[44px] items-center gap-8 rounded-[9999px] border border-pricing-blue bg-pricing-blue px-20 py-8 font-sf-pro-text text-compact-control tracking-compact-control text-gallery-white outline-none transition-colors hover:border-apple-blue hover:bg-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        >
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={2} />
          Back to boards
        </Link>
      </div>
    </section>
  );
}
