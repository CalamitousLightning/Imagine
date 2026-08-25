"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

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

export function ThemeScopeProvider({
  as: Tag = "div",
  className,
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);

  // Ref is only populated after the first render; push it into state so
  // consumers re-render once a real container node exists.
  useEffect(() => {
    setNode(ref.current);
  }, []);

  const Component = Tag as any;

  return (
    <Component ref={ref} className={className}>
      <ThemeScopeContext.Provider value={node}>{children}</ThemeScopeContext.Provider>
    </Component>
  );
}
