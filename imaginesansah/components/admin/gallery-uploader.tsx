"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia, MediaUploadError } from "@/lib/supabase/upload";
import { mediaUrl } from "@/lib/media";
import type { Media } from "@/types/domain";

interface GalleryUploaderProps {
  bucket: "portfolio" | "hero" | "profile" | "site-assets";
  value: Media[];
  onChange: (media: Media[]) => void;
}

export function GalleryUploader({ bucket, value, onChange }: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      const uploaded: Media[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadMedia(supabase, bucket, file));
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : "One or more uploads failed.");
    } finally {
      setUploading(false);
    }
  }

  function remove(id: string) {
    onChange(value.filter((m) => m.id !== id));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-admin-muted">
        Gallery ({value.length})
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((media, i) => {
          const url = mediaUrl(media);
          return (
            <div
              key={media.id}
              className="relative aspect-square overflow-hidden rounded-md border border-admin-border bg-admin-bg"
            >
              {url && <Image src={url} alt={media.alt_text || ""} fill className="object-cover" sizes="200px" />}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-admin-bg/90 px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="rounded p-0.5 text-admin-muted hover:text-admin-text disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(media.id)}
                  aria-label="Remove image"
                  className="rounded p-0.5 text-admin-muted hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move later"
                  className="rounded p-0.5 text-admin-muted hover:text-admin-text disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed border-admin-border text-admin-muted hover:text-admin-text"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="font-mono text-[11px]">{uploading ? "Uploading..." : "Add images"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 font-mono text-xs text-red-400">{error}</p>}
    </div>
  );
}
