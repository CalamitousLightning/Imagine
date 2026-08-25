import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalProjects: number;
  featuredProjects: number;
  totalRequests: number;
  newRequests: number;
  completedProjects: number;
}

export interface ActivityEntry {
  id: string;
  action: string;
  summary: string;
  created_at: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const [
    { count: totalProjects },
    { count: featuredProjects },
    { count: totalRequests },
    { count: newRequests },
    { count: completedProjects },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("client_requests").select("*", { count: "exact", head: true }),
    supabase.from("client_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("client_requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  return {
    totalProjects: totalProjects ?? 0,
    featuredProjects: featuredProjects ?? 0,
    totalRequests: totalRequests ?? 0,
    newRequests: newRequests ?? 0,
    completedProjects: completedProjects ?? 0,
  };
}

export async function getRecentActivity(limit = 8): Promise<ActivityEntry[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("activity_log")
    .select("id, action, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/**
 * Fire-and-forget style write, called from admin Server Actions after a
 * mutation (project created, request status changed, etc.) so the "Recent
 * Activity" panel is always real, never simulated.
 */
export async function logActivity(params: {
  action: string;
  entity_type: string;
  entity_id?: string;
  summary: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("activity_log").insert({
    actor: user?.id,
    action: params.action,
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    summary: params.summary,
  });
}

// ---------------- Portfolio admin views (includes drafts) ----------------

export async function getAllProjectsForAdmin() {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select(
      "*, category:categories(*), cover:media!projects_cover_media_id_fkey(*), thumbnail:media!projects_thumbnail_media_id_fkey(*)"
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProjectForEdit(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select(
      "*, cover:media!projects_cover_media_id_fkey(*), thumbnail:media!projects_thumbnail_media_id_fkey(*), gallery:project_images(media(*))"
    )
    .eq("id", id)
    .single();
  if (!data) return null;
  const gallery = ((data as any).gallery ?? [])
    .map((g: any) => g.media)
    .filter(Boolean);
  return { ...(data as any), gallery };
}

// ---------------- Client requests ----------------

export async function getClientRequests() {
  const supabase = createClient();
  const { data } = await supabase
    .from("client_requests")
    .select("*, service:services(title)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/**
 * Signed, time-limited URLs for a request's reference files. The
 * `client-files` bucket is private (see storage.sql) — this only succeeds
 * because the caller's session satisfies the `client_files_admin_read`
 * storage policy; a non-admin session gets an error per file instead.
 */
export async function getRequestReferenceFiles(requestId: string) {
  const supabase = createClient();
  const { data: links } = await supabase
    .from("client_request_files")
    .select("media_id, media(*)")
    .eq("request_id", requestId);

  const files = (links ?? []).map((l: any) => l.media).filter(Boolean);

  const withUrls = await Promise.all(
    files.map(async (file: any) => {
      const { data: signed } = await supabase.storage
        .from("client-files")
        .createSignedUrl(file.path, 60 * 10); // 10 minutes
      return { ...file, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return withUrls;
}

// ---------------- Client request admin views ----------------

export interface AdminRequestFile {
  id: string;
  file_name: string;
  signedUrl: string | null;
}

export async function getClientRequestsForAdmin(status?: string) {
  const supabase = createClient();

  let query = supabase
    .from("client_requests")
    .select("*, service:services(title)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: requests } = await query;
  if (!requests) return [];

  // client-files is a private bucket, so each reference file needs a
  // short-lived signed URL rather than a public one — generated here,
  // server-side, using the admin's own authenticated session.
  const withFiles = await Promise.all(
    requests.map(async (request: any) => {
      const { data: fileLinks } = await supabase
        .from("client_request_files")
        .select("media_id, media(id, path, bucket, file_name)")
        .eq("request_id", request.id);

      const files: AdminRequestFile[] = await Promise.all(
        (fileLinks ?? []).map(async (link: any) => {
          const media = link.media;
          if (!media) return null;
          const { data: signed } = await supabase.storage
            .from(media.bucket)
            .createSignedUrl(media.path, 3600);
          return { id: media.id, file_name: media.file_name, signedUrl: signed?.signedUrl ?? null };
        })
      ).then((arr) => arr.filter(Boolean) as AdminRequestFile[]);

      return { ...request, files };
    })
  );

  return withFiles;
}

// ---------------- Media Library ----------------

export interface MediaLibraryItem {
  id: string;
  bucket: string;
  path: string;
  file_name: string;
  file_type: string | null;
  file_size_bytes: number | null;
  created_at: string;
  referenced: boolean;
  url: string | null; // public URL, or a signed URL for the private client-files bucket
}

export async function getMediaLibrary(bucket?: string): Promise<MediaLibraryItem[]> {
  const supabase = createClient();

  let query = supabase.from("media").select("*").order("created_at", { ascending: false });
  if (bucket && bucket !== "all") query = query.eq("bucket", bucket);
  const { data: media } = await query;
  if (!media) return [];

  // Gather every place a media row could be referenced, in a handful of
  // queries rather than one per row, then mark membership client-side.
  const [
    { data: galleryRefs },
    { data: projectRefs },
    { data: serviceRefs },
    { data: heroRefs },
    { data: settingsRow },
  ] = await Promise.all([
    supabase.from("project_images").select("media_id"),
    supabase.from("projects").select("cover_media_id, thumbnail_media_id"),
    supabase.from("services").select("icon_media_id"),
    supabase.from("hero_slides").select("primary_media_id, secondary_media_id"),
    supabase.from("site_settings").select("logo_media_id, profile_media_id, og_image_media_id").single(),
  ]);

  const referenced = new Set<string>();
  (galleryRefs ?? []).forEach((r: any) => r.media_id && referenced.add(r.media_id));
  (projectRefs ?? []).forEach((r: any) => {
    if (r.cover_media_id) referenced.add(r.cover_media_id);
    if (r.thumbnail_media_id) referenced.add(r.thumbnail_media_id);
  });
  (serviceRefs ?? []).forEach((r: any) => r.icon_media_id && referenced.add(r.icon_media_id));
  (heroRefs ?? []).forEach((r: any) => {
    if (r.primary_media_id) referenced.add(r.primary_media_id);
    if (r.secondary_media_id) referenced.add(r.secondary_media_id);
  });
  if (settingsRow) {
    ["logo_media_id", "profile_media_id", "og_image_media_id"].forEach((key) => {
      const val = (settingsRow as any)[key];
      if (val) referenced.add(val);
    });
  }

  const items: MediaLibraryItem[] = await Promise.all(
    media.map(async (m: any) => {
      let url: string | null = null;
      if (m.bucket === "client-files") {
        const { data: signed } = await supabase.storage.from(m.bucket).createSignedUrl(m.path, 3600);
        url = signed?.signedUrl ?? null;
      } else {
        url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${m.bucket}/${m.path}`;
      }
      return {
        id: m.id,
        bucket: m.bucket,
        path: m.path,
        file_name: m.file_name,
        file_type: m.file_type,
        file_size_bytes: m.file_size_bytes,
        created_at: m.created_at,
        referenced: referenced.has(m.id),
        url,
      };
    })
  );

  return items;
}
