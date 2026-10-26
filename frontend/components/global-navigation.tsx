"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buttonMotion, transition } from "@/lib/motion";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Boards", href: "/boards" },
];

export function GlobalNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 8);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header
      data-global-navigation
      data-navigation-material
      data-scrolled={isScrolled || undefined}
      className="relative isolate h-[52px] overflow-hidden rounded-full-5 border border-[rgba(134,134,139,0.32)] bg-[rgba(245,245,247,0.68)] backdrop-blur-[24px] backdrop-saturate-[180%]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(245,245,247,0.48)_100%)]"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] border border-[rgba(134,134,139,0.46)] bg-[rgba(250,250,252,0.78)]"
        initial={false}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={transition.fast}
      />
      <nav
        aria-label="Global navigation"
        className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center justify-between px-20 max-md:px-16"
      >
        <motion.div
          whileTap={reduceMotion ? undefined : buttonMotion.whileTap}
          transition={buttonMotion.transition}
        >
          <Link
            href="/"
            aria-label="Sali home"
            className="flex min-h-[36px] items-center gap-8 rounded-[10px] px-8 text-ink outline-none hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            <CheckCircle2 aria-hidden="true" size={17} strokeWidth={1.8} />
            <span className="font-sf-pro-display text-global-nav font-semibold tracking-global-nav">
              Sali
            </span>
          </Link>
        </motion.div>

        <div className="flex h-full items-center gap-28 max-sm:hidden">
          {navigationItems.map((item) => (
            <motion.div
              key={item.href}
              className="flex h-full items-center"
              whileTap={reduceMotion ? undefined : buttonMotion.whileTap}
              transition={buttonMotion.transition}
            >
              <Link
                href={item.href}
                className="flex min-h-[36px] items-center rounded-[10px] px-12 font-sf-pro-text text-global-nav font-normal tracking-global-nav text-ink outline-none hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          whileTap={reduceMotion ? undefined : buttonMotion.whileTap}
          transition={buttonMotion.transition}
        >
          <Link
            href="/boards#board-search"
            aria-label="Search boards"
            className="grid size-[44px] place-items-center rounded-full text-ink outline-none hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
          >
            <Search aria-hidden="true" size={16} strokeWidth={1.8} />
          </Link>
        </motion.div>
      </nav>
    </header>
  );
}
