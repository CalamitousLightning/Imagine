"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia, MediaUploadError } from "@/lib/supabase/upload";
import { mediaUrl } from "@/lib/media";
import type { Media } from "@/types/domain";
import { cn } from "@/lib/utils";

interface ImageUploadSlotProps {
  label: string;
  bucket: "portfolio" | "hero" | "profile" | "site-assets";
  value: Media | null;
  onChange: (media: Media | null) => void;
  aspect?: string; // tailwind aspect-* class
}

export function ImageUploadSlot({
  label,
  bucket,
  value,
  onChange,
  aspect = "aspect-[4/3]",
}: ImageUploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const media = await uploadMedia(supabase, bucket, file);
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
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-dashed border-admin-border bg-admin-bg",
          aspect
        )}
      >
        {url ? (
          <>
            <Image src={url} alt={value?.alt_text || ""} fill className="object-cover" sizes="300px" />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className="absolute right-2 top-2 rounded-full bg-admin-bg/90 p-1.5 text-admin-text hover:bg-red-500/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-admin-muted hover:text-admin-text"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="font-mono text-xs">{uploading ? "Uploading..." : "Click to upload"}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
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
