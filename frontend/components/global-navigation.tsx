import Link from "next/link";
import { CheckCircle2, Search } from "lucide-react";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Boards", href: "/boards" },
  { label: "Components", href: "/ui-kit" },
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
          className="flex items-center gap-8 rounded-lg text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-apple-blue"
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
              className="flex h-full items-center rounded-lg font-sf-pro-text text-global-nav font-normal tracking-global-nav text-ink transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/boards"
          aria-label="Search boards"
          className="grid size-28 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-paper-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-blue"
        >
          <Search aria-hidden="true" size={16} strokeWidth={1.8} />
        </Link>
      </nav>
    </header>
  );
}
