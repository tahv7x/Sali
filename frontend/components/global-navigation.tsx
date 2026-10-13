import Link from "next/link";
import { CheckCircle2, Search } from "lucide-react";

const navigationItems = [
  { label: "Overview", href: "/" },
  { label: "Boards", href: "/boards" },
  { label: "Activity", href: "/activity" },
];

export function GlobalNavigation() {
  return (
    <header className="h-[44px] border-b border-control-gray bg-gallery-white">
      <nav
        aria-label="Global navigation"
        className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-20 max-md:px-16"
      >
        <Link
          href="/"
          aria-label="Sali home"
          className="flex items-center gap-8 text-ink outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-4"
        >
          <CheckCircle2 aria-hidden="true" size={17} strokeWidth={1.8} />
          <span className="font-sf-pro-display text-global-nav font-semibold tracking-global-nav">
            Sali
          </span>
        </Link>

        <div className="flex h-full items-center gap-28 max-sm:hidden">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-full items-center rounded-lg font-sf-pro-text text-global-nav font-normal tracking-global-nav text-ink transition-opacity duration-200 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Search"
          className="grid size-28 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-paper-frost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2"
        >
          <Search aria-hidden="true" size={16} strokeWidth={1.8} />
        </button>
      </nav>
    </header>
  );
}
