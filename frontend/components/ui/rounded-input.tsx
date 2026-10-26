"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Search } from "lucide-react";

type InputKind = "text" | "search";

type RoundedInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  error?: string;
  hint?: string;
  inputKind?: InputKind;
  label: string;
  leadingIcon?: ReactNode;
};

const inputKindStyles: Record<InputKind, string> = {
  text: "font-sf-pro-text text-body-small leading-body-small tracking-body-small max-md:text-[16px]",
  search: "font-arial text-[13px] leading-[1.2] tracking-normal max-md:text-[16px]",
};

export const RoundedInput = forwardRef<HTMLInputElement, RoundedInputProps>(
  function RoundedInput(
    {
      className = "",
      disabled,
      error,
      hint,
      id,
      inputKind = "text",
      label,
      leadingIcon,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = hint || error ? `${inputId}-description` : undefined;

    return (
      <div data-slot="rounded-input" className="flex w-full flex-col gap-8">
        <label
          htmlFor={inputId}
          className="font-sf-pro-text text-compact-control font-medium leading-compact-control tracking-compact-control text-ink"
        >
          {label}
        </label>

        <div className="relative">
          {leadingIcon ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-20 flex items-center text-slate"
            >
              {leadingIcon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={descriptionId}
            className={`h-[44px] w-full rounded-[980px] border bg-gallery-white py-12 text-ink outline-none transition-colors duration-200 placeholder:text-slate focus-visible:border-apple-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue disabled:cursor-not-allowed disabled:border-control-gray disabled:bg-control-gray disabled:text-slate ${leadingIcon ? "pl-48" : "pl-24"} ${inputKind === "search" ? "pr-[45px]" : "pr-24"} ${error ? "border-launch-orange" : "border-steel"} ${inputKindStyles[inputKind]} ${className}`}
            {...props}
          />
        </div>

        {hint || error ? (
          <p
            id={descriptionId}
            className={`font-sf-pro-text text-compact-control leading-compact-control tracking-compact-control ${error ? "text-launch-orange" : "text-slate"}`}
          >
            {error ?? hint}
          </p>
        ) : null}
      </div>
    );
  },
);

RoundedInput.displayName = "RoundedInput";

type SearchInputProps = Omit<
  RoundedInputProps,
  "inputKind" | "leadingIcon" | "type"
>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    return (
      <RoundedInput
        ref={ref}
        type="search"
        inputKind="search"
        leadingIcon={<Search size={16} strokeWidth={1.8} />}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
