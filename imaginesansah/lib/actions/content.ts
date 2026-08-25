"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";

export async function saveSiteContent(values: Record<string, string>): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) return { error: error.message };

  await logActivity({
    action: "content.updated",
    entity_type: "site_content",
    summary: "Updated site content copy",
  });

  revalidatePath("/", "layout");
  revalidatePath("/control/content");
  return {};
}
