"use client";

import { useState } from "react";

/**
 * Small, elegant, fixed signature — bottom-left of the admin only.
 * Not repeated anywhere else in the product. A quiet mark of origin,
 * not a decoration competing for attention with the actual UI.
 */
export function GhanaSignature() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-4 left-4 z-30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-full border border-admin-border bg-admin-panel text-sm shadow-sm transition-shadow"
        style={hovered ? { boxShadow: "0 0 12px rgba(57,255,136,0.25)" } : undefined}
        aria-hidden="true"
      >
        🇬🇭
      </div>
      {hovered && (
        <div
          role="tooltip"
          className="absolute bottom-9 left-0 whitespace-nowrap rounded-md border border-admin-border bg-admin-panel px-2.5 py-1 font-mono text-xs text-admin-text shadow-lg"
        >
          Designed in Ghana 🇬🇭
        </div>
      )}
    </div>
  );
}
