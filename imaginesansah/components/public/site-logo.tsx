"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Drop the file at /public/imagine.jpeg to show it here. Until it exists (or
 * if it ever fails to load), this quietly falls back to the text wordmark —
 * plain <img> + onError rather than next/image, since we specifically want
 * "try to load, silently fall back" rather than a build-time guarantee that
 * the file exists.
 */
export function SiteLogo({ siteName }: { siteName: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link href="/" aria-label={siteName} className="flex items-center">
      {imageFailed ? (
        <span className="font-display text-xl font-medium tracking-tight text-public-black">
          {siteName}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/imagine.jpeg"
          alt={siteName}
          className="h-9 w-auto object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
    </Link>
  );
}
