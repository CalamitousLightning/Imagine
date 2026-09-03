"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { mediaUrl } from "@/lib/media";
import type { Media } from "@/types/domain";

export function GalleryLightbox({ images, title }: { images: Media[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => {
          const url = mediaUrl(img);
          if (!url) return null;
          return (
            <button
              key={img.id}
              onClick={() => setOpenIndex(i)}
              className="relative aspect-[4/3] overflow-hidden bg-public-ivory"
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              <Image
                src={url}
                alt={img.alt_text || `${title} — image ${i + 1}`}
                fill
                className="object-contain transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {mediaUrl(images[openIndex]) && (
              <Image
                src={mediaUrl(images[openIndex])!}
                alt={images[openIndex].alt_text || title}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
