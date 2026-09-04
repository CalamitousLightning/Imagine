"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadAdVideo } from "@/lib/supabase/upload";
import { MediaUploadError } from "@/lib/supabase/upload";
import { mediaUrl } from "@/lib/media";
import type { Media } from "@/types/domain";

interface VideoUploadSlotProps {
  label: string;
  value: Media | null;
  onChange: (media: Media | null) => void;
}

export function VideoUploadSlot({ label, value, onChange }: VideoUploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const media = await uploadAdVideo(supabase, file);
      onChange(media);
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const url = mediaUrl(value);

  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-admin-muted">{label}</p>
      <div className="relative aspect-video overflow-hidden rounded-md border border-dashed border-admin-border bg-admin-bg">
        {url ? (
          <>
            <video src={url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="h-8 w-8 text-white/90" />
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className="absolute right-2 top-2 rounded-full bg-admin-bg/90 p-1.5 text-admin-text hover:bg-red-500/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {value?.file_name && (
              <p className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 font-mono text-[10px] text-white/90">
                {value.file_name}
              </p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-admin-muted hover:text-admin-text"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="font-mono text-xs">{uploading ? "Uploading..." : "Click to upload video"}</span>
            <span className="font-mono text-[10px] text-admin-muted/70">MP4, WebM, or MOV · up to 100MB</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 font-mono text-xs text-red-400">{error}</p>}
    </div>
  );
}
