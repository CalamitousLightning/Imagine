import Link from "next/link";
import { MobileNav } from "@/components/public/mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-public-black/10 bg-public-ivory/80 backdrop-blur-md">
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
              className="group relative font-body text-sm tracking-wide text-public-black/70 transition-colors hover:text-public-black"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-public-violet transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <Link
          href="/start-a-project"
          className="hidden rounded-full bg-public-black px-5 py-2.5 font-body text-sm font-medium text-public-white shadow-[0_6px_20px_rgba(17,17,17,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-public-violet hover:shadow-[0_10px_28px_rgba(124,58,237,0.4)] md:inline-block"
        >
          Start a Project
        </Link>

        <div className="hidden items-center md:flex">
          <ThemeToggle surface="public" className="ml-3" />
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
