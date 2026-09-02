import { createClient } from "@/lib/supabase/server";
import type { Project, Service, HeroSlide, SiteSettings, Category, JobShowcaseItem } from "@/types/domain";

// Re-exported for convenience so existing imports of `mediaUrl` from this module keep working;
// the actual implementation lives in lib/media.ts because it must also be importable from
// Client Components, which this file (server-only, uses next/headers) cannot be.
export { mediaUrl } from "@/lib/media";

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data as unknown as SiteSettings;
}

export async function getEnabledHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select(
      "*, primary_media:media!hero_slides_primary_media_id_fkey(*), secondary_media:media!hero_slides_secondary_media_id_fkey(*)"
    )
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });
  return (data as unknown as HeroSlide[]) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("display_order");
  return (data as Category[]) ?? [];
}

export async function getPublishedProjects(categorySlug?: string): Promise<Project[]> {
  const supabase = createClient();
  let query = supabase
    .from("projects")
    .select("*, category:categories(*), cover:media!projects_cover_media_id_fkey(*), thumbnail:media!projects_thumbnail_media_id_fkey(*)")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data } = await query;
  return (data as unknown as Project[]) ?? [];
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, category:categories(*), cover:media!projects_cover_media_id_fkey(*), thumbnail:media!projects_thumbnail_media_id_fkey(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);
  return (data as unknown as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select(
      "*, category:categories(*), cover:media!projects_cover_media_id_fkey(*), gallery:project_images(media(*))"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (!data) return null;
  const gallery = ((data as any).gallery ?? []).map((g: any) => g.media);
  return { ...(data as any), gallery } as Project;
}

export async function getPublishedServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select("*, icon:media!services_icon_media_id_fkey(*)")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  return (data as unknown as Service[]) ?? [];
}

export async function getRelatedProjects(
  currentProjectId: string,
  categoryId: string | null,
  limit = 3
): Promise<Project[]> {
  const supabase = createClient();
  let query = supabase
    .from("projects")
    .select("*, category:categories(*), cover:media!projects_cover_media_id_fkey(*), thumbnail:media!projects_thumbnail_media_id_fkey(*)")
    .eq("is_published", true)
    .neq("id", currentProjectId)
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data } = await query;
  return (data as unknown as Project[]) ?? [];
}

export async function getSiteContent(keys: string[]): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data } = await supabase.from("site_content").select("key, value").in("key", keys);
  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => (map[row.key] = row.value));
  return map;
}

/**
 * Homepage "Recent Requests" feed. Reads from job_showcase (a narrow,
 * privacy-safe mirror of client_requests — see supabase/schema.sql), never
 * the client_requests table directly. Excludes cancelled requests here at
 * the query layer; the RLS policy itself allows reading any status.
 *
 * Fetches up to 16 (not just the 8 that are visible at once) so the
 * JobShowcase marquee has a pool to rotate through — it only ever shows
 * 8 at a time (2 rows of 4), but with more than 8 in the pool it cycles
 * to a new page of 8 every few seconds so everything surfaces eventually.
 */
export async function getJobShowcase(limit = 16): Promise<JobShowcaseItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("job_showcase")
    .select("id, client_name, project_type, status, has_reference_file, created_at, service:services(title)")
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as unknown as JobShowcaseItem[]) ?? [];
}
