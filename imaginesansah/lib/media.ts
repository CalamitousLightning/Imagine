import type { Media } from "@/types/domain";

/**
 * Client-safe. Does NOT import next/headers or the Supabase server client,
 * so it can be imported from both Server and Client Components.
 */
export function mediaUrl(media: Media | null | undefined): string | null {
  if (!media) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${media.bucket}/${media.path}`;
}
