"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";
import type { HeroComposition } from "@/types/domain";

export interface HeroSlideFormInput {
  id?: string;
  composition: HeroComposition;
  headline: string;
  subtext: string;
  primary_media_id: string | null;
  secondary_media_id: string | null;
  featured_project_id: string | null;
  duration_ms: number;
  is_enabled: boolean;
}

export async function saveHeroSlide(input: HeroSlideFormInput): Promise<{ error?: string; id?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const row = {
    composition: input.composition,
    headline: input.headline.trim() || null,
    subtext: input.subtext.trim() || null,
    primary_media_id: input.primary_media_id,
    secondary_media_id: input.secondary_media_id,
    featured_project_id: input.featured_project_id,
    duration_ms: input.duration_ms,
    is_enabled: input.is_enabled,
  };

  let id = input.id;
  if (id) {
    const { error } = await supabase.from("hero_slides").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: maxOrder } = await supabase
      .from("hero_slides")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data, error } = await supabase
      .from("hero_slides")
      .insert({ ...row, display_order: (maxOrder?.display_order ?? -1) + 1 })
      .select("id")
      .single();
    if (error) return { error: error.message };
    id = data.id;
  }

  await logActivity({
    action: input.id ? "hero_slide.updated" : "hero_slide.created",
    entity_type: "hero_slide",
    entity_id: id,
    summary: `${input.id ? "Updated" : "Created"} a hero slide`,
  });

  revalidatePath("/control/hero-showcase");
  revalidatePath("/");
  return { id };
}

export async function deleteHeroSlide(id: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "hero_slide.deleted",
    entity_type: "hero_slide",
    entity_id: id,
    summary: "Deleted a hero slide",
  });

  revalidatePath("/control/hero-showcase");
  revalidatePath("/");
  return {};
}

export async function toggleHeroSlideEnabled(id: string, value: boolean): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("hero_slides").update({ is_enabled: value }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/control/hero-showcase");
  revalidatePath("/");
  return {};
}

export async function reorderHeroSlides(orderedIds: string[]): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const updates = orderedIds.map((id, display_order) =>
    supabase.from("hero_slides").update({ display_order }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePath("/control/hero-showcase");
  revalidatePath("/");
  return {};
}
