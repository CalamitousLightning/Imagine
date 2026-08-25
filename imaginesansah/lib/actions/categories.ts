"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";
import { slugify } from "@/lib/utils";

export async function createCategory(name: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required." };

  const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });

  const { error } = await supabase.from("categories").insert({
    name: trimmed,
    slug: slugify(trimmed),
    display_order: count ?? 0,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "A category with that name already exists." : error.message,
    };
  }

  await logActivity({
    action: "category.created",
    entity_type: "category",
    summary: `Added category "${trimmed}"`,
  });

  revalidatePath("/control/portfolio");
  revalidatePath("/control/portfolio/new");
  revalidatePath("/portfolio");
  return {};
}

export async function renameCategory(id: string, name: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required." };

  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id);

  if (error) {
    return {
      error: error.code === "23505" ? "A category with that name already exists." : error.message,
    };
  }

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  return {};
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  // Projects reference categories with ON DELETE SET NULL, so this is safe —
  // affected projects fall back to "Uncategorized" rather than failing.
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "category.deleted",
    entity_type: "category",
    summary: "Deleted a category",
  });

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  return {};
}

export async function reorderCategories(orderedIds: string[]): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const updates = orderedIds.map((id, i) =>
    supabase.from("categories").update({ display_order: i }).eq("id", id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };

  revalidatePath("/control/portfolio");
  revalidatePath("/portfolio");
  return {};
}
