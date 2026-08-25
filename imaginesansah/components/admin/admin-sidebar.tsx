"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Wrench,
  Inbox,
  FolderOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
  { href: "/control", label: "Overview", icon: LayoutDashboard },
  { href: "/control/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/control/hero-showcase", label: "Hero Showcase", icon: Sparkles },
  { href: "/control/content", label: "Content Control", icon: FileText },
  { href: "/control/services", label: "Services", icon: Wrench },
  { href: "/control/requests", label: "Client Requests", icon: Inbox },
  { href: "/control/media", label: "Media Library", icon: FolderOpen },
  { href: "/control/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ adminName }: { adminName: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/control/login");
    router.refresh();
  }

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-admin-border bg-admin-secondary md:flex">
      <div className="border-b border-admin-border p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">System</p>
          <ThemeToggle surface="admin" />
        </div>
        <p className="mt-1 font-display text-base font-medium text-admin-text">
          ImagineSansah <span className="text-admin-green">//</span> Creative Control
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-[13px] transition-colors",
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
      </nav>

      <div className="border-t border-admin-border p-3">
        {adminName && (
          <p className="mb-2 truncate px-3 font-mono text-xs text-admin-muted">{adminName}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 font-mono text-[13px] text-admin-muted transition-colors hover:bg-admin-panel hover:text-admin-text"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
