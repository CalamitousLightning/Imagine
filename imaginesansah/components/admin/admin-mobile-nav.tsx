"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Wrench,
  Inbox,
  FolderOpen,
  Settings,
  LogOut,
  Clapperboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
  { href: "/control", label: "Overview", icon: LayoutDashboard },
  { href: "/control/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/control/hero-showcase", label: "Hero Showcase", icon: Sparkles },
  { href: "/control/ad-videos", label: "Ad Popup", icon: Clapperboard },
  { href: "/control/content", label: "Content Control", icon: FileText },
  { href: "/control/services", label: "Services", icon: Wrench },
  { href: "/control/requests", label: "Client Requests", icon: Inbox },
  { href: "/control/media", label: "Media Library", icon: FolderOpen },
  { href: "/control/settings", label: "Settings", icon: Settings },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/control/login");
    router.refresh();
  }

  return (
    <div className="border-b border-admin-border bg-admin-secondary md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-display text-sm font-medium text-admin-text">
          ImagineSansah <span className="text-admin-green">//</span> Control
        </p>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-md p-2 text-admin-text hover:bg-admin-panel"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-admin-border p-3">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-admin-muted">Appearance</span>
            <ThemeToggle surface="admin" />
          </div>
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2.5 font-mono text-sm transition-colors",
                  active
                    ? "bg-admin-green/10 text-admin-green"
                    : "text-admin-muted hover:bg-admin-panel hover:text-admin-text"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 font-mono text-sm text-admin-muted hover:bg-admin-panel hover:text-admin-text"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </nav>
      )}
    </div>
  );
}
