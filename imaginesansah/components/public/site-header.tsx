import Link from "next/link";

const NAV = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-public-black/10 bg-public-ivory/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-public-black"
        >
          {siteName}
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm tracking-wide text-public-black/70 transition-colors hover:text-public-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/start-a-project"
          className="hidden rounded-full bg-public-black px-5 py-2.5 font-body text-sm font-medium text-public-white transition-colors hover:bg-public-violet md:inline-block"
        >
          Start a Project
        </Link>

        {/* Mobile nav trigger — wired to a drawer component in a follow-up pass */}
        <button
          className="rounded-full border border-public-black/20 p-2 md:hidden"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
