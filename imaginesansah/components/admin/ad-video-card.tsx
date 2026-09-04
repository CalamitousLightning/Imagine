"use client";

import { useState, useTransition } from "react";
import { Play, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdVideoEditorDialog } from "@/components/admin/ad-video-editor-dialog";
import { toggleAdVideoEnabled, deleteAdVideo } from "@/lib/actions/ad-videos";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { AdVideo } from "@/types/domain";

export function AdVideoCard({ video }: { video: AdVideo }) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const poster = mediaUrl(video.poster_media);
  const videoUrl = mediaUrl(video.media);

  return (
    <div className="glow-card flex items-center gap-4 p-3">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-admin-bg">
        {poster ? (
          <img src={poster} alt="" className="h-full w-full object-cover" />
        ) : videoUrl ? (
          <video src={videoUrl} className="h-full w-full object-cover" muted preload="metadata" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] text-admin-muted">
            No video
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <Play className="h-5 w-5 text-white/90" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm text-admin-text">
          {video.title || <span className="text-admin-muted">No caption</span>}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
          {video.media?.file_name ?? "No file"}
          {video.cta_label ? ` · CTA: ${video.cta_label}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => startTransition(() => void toggleAdVideoEnabled(video.id, !video.is_enabled))}
          disabled={pending}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase",
            video.is_enabled ? "bg-admin-green/15 text-admin-green" : "bg-admin-amber/15 text-admin-amber"
          )}
        >
          {video.is_enabled ? "Enabled" : "Disabled"}
        </button>

        <AdVideoEditorDialog
          video={video}
          trigger={
            <button aria-label="Edit video" className="text-admin-muted hover:text-admin-text">
              <Pencil className="h-4 w-4" />
            </button>
          }
        />

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => startTransition(() => void deleteAdVideo(video.id))}
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
            aria-label="Delete video"
            className="text-admin-muted hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
