"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { HeroSlideEditorDialog } from "@/components/admin/hero-slide-editor-dialog";
import { toggleHeroSlideEnabled, deleteHeroSlide } from "@/lib/actions/hero-slides";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { HeroSlide, Project } from "@/types/domain";

export function HeroSlideCard({
  slide,
  projects,
}: {
  slide: HeroSlide;
  projects: Pick<Project, "id" | "title">[];
}) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const thumb = mediaUrl(slide.primary_media) || mediaUrl(slide.secondary_media);

  return (
    <div className="flex items-center gap-4 rounded-md border border-admin-border bg-admin-panel p-3">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-admin-bg">
        {thumb ? (
          <Image src={thumb} alt="" fill className="object-cover" sizes="128px" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] text-admin-muted">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm text-admin-text">
          {slide.headline || <span className="text-admin-muted">No headline</span>}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
          {slide.composition.replaceAll("_", " ")} · {slide.duration_ms}ms
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => startTransition(() => void toggleHeroSlideEnabled(slide.id, !slide.is_enabled))}
          disabled={pending}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase",
            slide.is_enabled ? "bg-admin-green/15 text-admin-green" : "bg-admin-amber/15 text-admin-amber"
          )}
        >
          {slide.is_enabled ? "Enabled" : "Disabled"}
        </button>

        <HeroSlideEditorDialog
          slide={slide}
          projects={projects}
          trigger={
            <button aria-label="Edit slide" className="text-admin-muted hover:text-admin-text">
              <Pencil className="h-4 w-4" />
            </button>
          }
        />

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => startTransition(() => void deleteHeroSlide(slide.id))}
              disabled={pending}
              className="font-mono text-[11px] text-red-400 hover:underline"
            >
              {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="font-mono text-[11px] text-admin-muted hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete slide"
            className="text-admin-muted hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
