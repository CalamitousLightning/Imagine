"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Radix's Select/Dialog primitives portal their popup content straight to
 * document.body by default — which sits OUTSIDE the `.theme-public` /
 * `.theme-admin` wrapper divs that define this app's CSS variables (see
 * globals.css). With no bare `:root` fallback defined, that meant every
 * portaled dropdown and dialog rendered with undefined --background,
 * --foreground, --border, etc. — effectively unstyled, on both the admin
 * and public surfaces.
 *
 * Fix: expose a ref to the current theme scope's DOM node via context, and
 * pass it as Radix's `container` prop so portaled content mounts *inside*
 * the themed subtree instead of at document.body.
 */
const ThemeScopeContext = createContext<HTMLElement | null>(null);

export function useThemeScopeContainer(): HTMLElement | undefined {
  const container = useContext(ThemeScopeContext);
  return container ?? undefined;
}

export type ThemeMode = "light" | "dark";
export type ThemeAccent = "violet" | "cyan" | "gold";
export type ThemeSurface = "public" | "admin";

interface ThemeControls {
  mode: ThemeMode;
  accent: ThemeAccent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
}

const ThemeControlsContext = createContext<ThemeControls | null>(null);

/** Reads/writes the current surface's toggle state — used by ThemeToggle. */
export function useThemeControls(): ThemeControls {
  const ctx = useContext(ThemeControlsContext);
  if (!ctx) throw new Error("useThemeControls must be used inside a ThemeScopeProvider");
  return ctx;
}

const DEFAULT_MODE: Record<ThemeSurface, ThemeMode> = { public: "light", admin: "dark" };

function storageKey(surface: ThemeSurface, kind: "mode" | "accent") {
  return `imaginesansah:${surface}:${kind}`;
}

/**
 * Wraps one surface's tree (public site or admin control room), scoping
 * both the Radix portal container (above) and the light/dark + accent
 * toggle state. State is persisted to localStorage per-surface, so a
 * visitor's public-site preference never affects the admin's control
 * room and vice versa. The matching inline script in app/layout.tsx
 * applies the stored value to `<html data-{surface}-mode/accent>` before
 * first paint so there's no flash of the wrong theme; this provider just
 * keeps React state in sync with that after hydration.
 */
export function ThemeScopeProvider({
  as: Tag = "div",
  className,
  surface,
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  className: string;
  surface: ThemeSurface;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE[surface]);
  const [accent, setAccentState] = useState<ThemeAccent>("violet");

  // Ref is only populated after the first render; push it into state so
  // consumers re-render once a real container node exists.
  useEffect(() => {
    setNode(ref.current);
  }, []);

  // Pick up whatever the no-flash inline script already applied to <html>
  // (or fall back to localStorage directly) once mounted.
  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(storageKey(surface, "mode")) as ThemeMode | null;
      const storedAccent = localStorage.getItem(storageKey(surface, "accent")) as ThemeAccent | null;
      if (storedMode) setModeState(storedMode);
      if (storedAccent) setAccentState(storedAccent);
    } catch {
      // localStorage unavailable (privacy mode, etc.) — silently keep defaults.
    }
  }, [surface]);

  const applyToHtml = useCallback(
    (key: "mode" | "accent", value: string, isDefault: boolean) => {
      const attr = `data-${surface}-${key}`;
      if (isDefault) {
        document.documentElement.removeAttribute(attr);
      } else {
        document.documentElement.setAttribute(attr, value);
      }
    },
    [surface]
  );

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      try {
        localStorage.setItem(storageKey(surface, "mode"), next);
      } catch {
        // ignore
      }
      applyToHtml("mode", next, next === DEFAULT_MODE[surface]);
    },
    [surface, applyToHtml]
  );

  const setAccent = useCallback(
    (next: ThemeAccent) => {
      setAccentState(next);
      try {
        localStorage.setItem(storageKey(surface, "accent"), next);
      } catch {
        // ignore
      }
      applyToHtml("accent", next, next === "violet");
    },
    [applyToHtml]
  );

  const controls = useMemo<ThemeControls>(
    () => ({ mode, accent, setMode, setAccent }),
    [mode, accent, setMode, setAccent]
  );

  const Component = Tag as any;

  return (
    <Component ref={ref} className={className}>
      <ThemeScopeContext.Provider value={node}>
        <ThemeControlsContext.Provider value={controls}>{children}</ThemeControlsContext.Provider>
      </ThemeScopeContext.Provider>
    </Component>
  );
}
