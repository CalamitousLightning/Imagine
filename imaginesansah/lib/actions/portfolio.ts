"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";
import { slugify } from "@/lib/utils";

export interface ProjectFormInput {
  id?: string;
  title: string;
  slug?: string;
  category_id: string | null;
  description: string;
  client: string;
  tools_used: string[];
  project_date: string | null;
  cover_media_id: string | null;
  thumbnail_media_id: string | null;
  gallery_media_ids: string[];
  is_featured: boolean;
  is_published: boolean;
}

export interface SaveResult {
  error?: string;
  projectId?: string;
  slug?: string;
}

export async function saveProject(input: ProjectFormInput): Promise<SaveResult> {
  await getCurrentAdmin(); // redirects if not an authorized admin
  const supabase = createClient();

  if (!input.title.trim()) return { error: "Title is required." };

  const slug = slugify(input.slug?.trim() || input.title);

  const row = {
    title: input.title.trim(),
    slug,
    category_id: input.category_id,
    description: input.description.trim() || null,
    client: input.client.trim() || null,
    tools_used: input.tools_used.filter(Boolean),
    project_date: input.project_date || null,
    cover_media_id: input.cover_media_id,
    thumbnail_media_id: input.thumbnail_media_id ?? input.cover_media_id,
    is_featured: input.is_featured,
    is_published: input.is_published,
  };

  let projectId = input.id;

  if (projectId) {
    const { error } = await supabase.from("projects").update(row).eq("id", projectId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("projects").insert(row).select("id").single();
    if (error) return { error: error.message };
    projectId = data.id;
  }

  // Replace the gallery wholesale — simplest correct way to persist order and removals.
  await supabase.from("project_images").delete().eq("project_id", projectId);
  if (input.gallery_media_ids.length > 0) {
    const galleryRows = input.gallery_media_ids.map((media_id, i) => ({
      project_id: projectId,
      media_id,
      display_order: i,
    }));
    const { error: galleryError } = await supabase.from("project_images").insert(galleryRows);
    if (galleryError) return { error: galleryError.message };
  }

  await logActivity({
    action: input.id ? "project.updated" : "project.created",
    entity_type: "project",
    entity_id: projectId,
    summary: `${input.id ? "Updated" : "Created"} project "${row.title}"`,
  });

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/");

  return { projectId, slug };
}

export async function deleteProject(id: string, title: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "project.deleted",
    entity_type: "project",
    entity_id: id,
    summary: `Deleted project "${title}"`,
  });

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return {};
}

export async function toggleProjectField(
  id: string,
  field: "is_featured" | "is_published",
  value: boolean
): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: `project.${field === "is_published" ? (value ? "published" : "unpublished") : "featured_toggled"}`,
    entity_type: "project",
    entity_id: id,
    summary: `${field === "is_published" ? (value ? "Published" : "Unpublished") : value ? "Featured" : "Unfeatured"} a project`,
  });

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return {};
}
