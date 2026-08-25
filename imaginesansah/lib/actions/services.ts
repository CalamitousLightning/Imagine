"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";
import { slugify } from "@/lib/utils";

export interface ServiceFormInput {
  id?: string;
  title: string;
  description: string;
  icon_media_id: string | null;
  is_published: boolean;
}

export async function saveService(input: ServiceFormInput): Promise<{ error?: string; id?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  if (!input.title.trim()) return { error: "Title is required." };

  const row = {
    title: input.title.trim(),
    slug: slugify(input.title),
    description: input.description.trim() || null,
    icon_media_id: input.icon_media_id,
    is_published: input.is_published,
  };

  let id = input.id;
  if (id) {
    const { error } = await supabase.from("services").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: maxOrder } = await supabase
      .from("services")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("services")
      .insert({ ...row, display_order: (maxOrder?.display_order ?? -1) + 1 })
      .select("id")
      .single();
    if (error) return { error: error.message };
    id = data.id;
  }

  await logActivity({
    action: input.id ? "service.updated" : "service.created",
    entity_type: "service",
    entity_id: id,
    summary: `${input.id ? "Updated" : "Created"} service "${row.title}"`,
  });

  revalidatePath("/control/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { id };
}

export async function deleteService(id: string, title: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "service.deleted",
    entity_type: "service",
    entity_id: id,
    summary: `Deleted service "${title}"`,
  });

  revalidatePath("/control/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}

export async function toggleServicePublished(id: string, value: boolean): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("services").update({ is_published: value }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/control/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}
