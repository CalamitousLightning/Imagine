"use client";

import { useState } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import { useThemeControls, type ThemeAccent, type ThemeSurface } from "@/lib/theme-scope";
import { cn } from "@/lib/utils";

const ACCENTS: { value: ThemeAccent; label: string; swatch: string }[] = [
  { value: "violet", label: "Violet", swatch: "#7C3AED" },
  { value: "cyan", label: "Cyan", swatch: "#22D3EE" },
  { value: "gold", label: "Gold", swatch: "#F5B942" },
];

interface ThemeToggleProps {
  surface: ThemeSurface;
  className?: string;
}

/**
 * Compact popover: mode (light/dark) + accent (violet/cyan/gold), scoped
 * to whichever surface it's rendered inside (public site vs admin control
 * room) via useThemeControls — each surface remembers its own preference.
 */
export function ThemeToggle({ surface, className }: ThemeToggleProps) {
  const { mode, accent, setMode, setAccent } = useThemeControls();
  const [open, setOpen] = useState(false);
  const isAdmin = surface === "admin";

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme settings"
        aria-expanded={open}
        className={
          isAdmin
            ? "flex items-center gap-1.5 rounded-md border border-admin-border p-2 text-admin-muted transition-colors hover:text-admin-text"
            : "flex items-center gap-1.5 rounded-full border border-public-black/15 p-2 text-public-black transition-colors hover:border-public-violet hover:text-public-violet"
        }
      >
        {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className={
              isAdmin
                ? "absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-admin-border bg-admin-panel p-3 font-mono text-xs shadow-xl"
                : "absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-public-black/10 bg-public-white p-3 font-body text-sm shadow-xl"
            }
          >
            <p className={isAdmin ? "mb-2 text-[10px] uppercase tracking-wide text-admin-muted" : "mb-2 text-xs uppercase tracking-wide text-public-black/40"}>
              Appearance
            </p>
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md border py-1.5 capitalize transition-colors",
                    isAdmin
                      ? mode === m
                        ? "border-admin-green/40 bg-admin-green/10 text-admin-green"
                        : "border-admin-border text-admin-muted hover:text-admin-text"
                      : mode === m
                      ? "border-public-violet/40 bg-public-violet/10 text-public-violet"
                      : "border-public-black/15 text-public-black/60 hover:text-public-black"
                  )}
                >
                  {m === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                  {m}
                </button>
              ))}
            </div>

            <p className={isAdmin ? "mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-admin-muted" : "mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-public-black/40"}>
              <Palette className="h-3 w-3" /> Accent
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAccent(a.value)}
                  aria-label={`${a.label} accent`}
                  aria-pressed={accent === a.value}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-md border py-2 transition-colors",
                    isAdmin
                      ? accent === a.value
                        ? "border-admin-green/50"
                        : "border-admin-border hover:border-admin-muted"
                      : accent === a.value
                      ? "border-public-black/60"
                      : "border-public-black/15 hover:border-public-black/30"
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: a.swatch }}
                    aria-hidden="true"
                  />
                  <span className={isAdmin ? "text-[9px] text-admin-muted" : "text-[10px] text-public-black/50"}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
