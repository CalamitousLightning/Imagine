import type { SupabaseClient } from "@supabase/supabase-js";
import type { Media } from "@/types/domain";

const MAX_BYTES = 15 * 1024 * 1024; // matches storage.sql bucket limits
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class MediaUploadError extends Error {}

/**
 * Uploads a file to the given public Storage bucket, then inserts the
 * tracking row in `media` so the admin's Media Library can list/reuse it.
 * Runs in the browser (called from "use client" components) using the
 * caller's own authenticated Supabase session — RLS on both the bucket
 * and the `media` table is what actually enforces "admins only," this
 * function does no privilege checking of its own.
 */
export async function uploadMedia(
  supabase: SupabaseClient,
  bucket: "portfolio" | "hero" | "profile" | "site-assets",
  file: File,
  altText?: string
): Promise<Media> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new MediaUploadError("Only JPEG, PNG, WebP, or AVIF images are supported.");
  }
  if (file.size > MAX_BYTES) {
    throw new MediaUploadError("File is larger than 15MB.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw new MediaUploadError(uploadError.message);

  const dimensions = await readImageDimensions(file).catch(() => null);

  const { data, error: insertError } = await supabase
    .from("media")
    .insert({
      bucket,
      path,
      file_name: file.name,
      file_type: file.type,
      file_size_bytes: file.size,
      alt_text: altText ?? null,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
    })
    .select()
    .single();

  if (insertError) {
    // Best-effort cleanup so we don't leave orphaned storage objects behind.
    await supabase.storage.from(bucket).remove([path]);
    throw new MediaUploadError(insertError.message);
  }

  return data as Media;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions."));
    };
    img.src = url;
  });
}

const CLIENT_REFERENCE_MAX_BYTES = 20 * 1024 * 1024;
const CLIENT_REFERENCE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/**
 * Uploads a client's reference/inspiration file from the public "Start a
 * Project" form. Unlike uploadMedia(), this never reads the media row back
 * with .select() — anon visitors have INSERT-only access to `media` (see
 * policies.sql), so a post-insert SELECT would return nothing. Instead the
 * row's id is generated here and inserted explicitly, so the caller already
 * has everything it needs without a read-back.
 */
export async function uploadClientReferenceFile(
  supabase: SupabaseClient,
  file: File
): Promise<{ id: string; bucket: "client-files"; path: string; file_name: string }> {
  if (!CLIENT_REFERENCE_ALLOWED_TYPES.includes(file.type)) {
    throw new MediaUploadError("Only JPEG, PNG, WebP, or PDF files are supported.");
  }
  if (file.size > CLIENT_REFERENCE_MAX_BYTES) {
    throw new MediaUploadError("File is larger than 20MB.");
  }

  const id = crypto.randomUUID();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${id}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("client-files").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw new MediaUploadError(uploadError.message);

  const { error: insertError } = await supabase.from("media").insert({
    id,
    bucket: "client-files",
    path,
    file_name: file.name,
    file_type: file.type,
    file_size_bytes: file.size,
  });

  if (insertError) {
    await supabase.storage.from("client-files").remove([path]);
    throw new MediaUploadError(insertError.message);
  }

  return { id, bucket: "client-files", path, file_name: file.name };
}
