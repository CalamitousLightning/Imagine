"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-public-black/15 p-2 text-public-black transition-colors hover:border-public-violet hover:text-public-violet md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-public-white p-6 shadow-[-20px_0_60px_rgba(17,17,17,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-public-black">Menu</span>
              <div className="flex items-center gap-2">
                <ThemeToggle surface="public" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full border border-public-black/15 p-2 text-public-black hover:border-public-violet hover:text-public-violet"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-public-black/8 py-4 font-display text-xl text-public-black transition-colors hover:text-public-violet"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/start-a-project"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-public-black py-3.5 text-center font-body text-sm font-medium text-public-white shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition-colors hover:bg-public-violet"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
