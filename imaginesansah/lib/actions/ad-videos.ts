"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";

export interface AdVideoFormInput {
  id?: string;
  title: string;
  cta_label: string;
  cta_href: string;
  media_id: string | null;
  poster_media_id: string | null;
  is_enabled: boolean;
}

export async function saveAdVideo(input: AdVideoFormInput): Promise<{ error?: string; id?: string }> {
  await getCurrentAdmin();

  if (!input.media_id) {
    return { error: "Upload a video before saving." };
  }

  const supabase = createClient();

  const row = {
    title: input.title.trim() || null,
    cta_label: input.cta_label.trim() || null,
    cta_href: input.cta_href.trim() || null,
    media_id: input.media_id,
    poster_media_id: input.poster_media_id,
    is_enabled: input.is_enabled,
  };

  let id = input.id;
  if (id) {
    const { error } = await supabase.from("ad_videos").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: maxOrder } = await supabase
      .from("ad_videos")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("ad_videos")
      .insert({ ...row, display_order: (maxOrder?.display_order ?? -1) + 1 })
      .select("id")
      .single();
    if (error) return { error: error.message };
    id = data.id;
  }

  await logActivity({
    action: input.id ? "ad_video.updated" : "ad_video.created",
    entity_type: "ad_video",
    entity_id: id,
    summary: `${input.id ? "Updated" : "Added"} an ad popup video`,
  });

  revalidatePath("/control/ad-videos");
  revalidatePath("/", "layout");
  return { id };
}

export async function deleteAdVideo(id: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("ad_videos").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "ad_video.deleted",
    entity_type: "ad_video",
    entity_id: id,
    summary: "Deleted an ad popup video",
  });

  revalidatePath("/control/ad-videos");
  revalidatePath("/", "layout");
  return {};
}

export async function toggleAdVideoEnabled(id: string, value: boolean): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("ad_videos").update({ is_enabled: value }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/control/ad-videos");
  revalidatePath("/", "layout");
  return {};
}

export async function reorderAdVideos(orderedIds: string[]): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const updates = orderedIds.map((id, display_order) =>
    supabase.from("ad_videos").update({ display_order }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePath("/control/ad-videos");
  revalidatePath("/", "layout");
  return {};
}
