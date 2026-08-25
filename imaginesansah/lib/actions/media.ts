"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";

export async function deleteMedia(id: string, bucket: string, path: string): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const { error: storageError } = await supabase.storage.from(bucket).remove([path]);
  if (storageError) return { error: storageError.message };

  const { error: dbError } = await supabase.from("media").delete().eq("id", id);
  if (dbError) return { error: dbError.message };

  await logActivity({
    action: "media.deleted",
    entity_type: "media",
    entity_id: id,
    summary: "Deleted a file from the media library",
  });

  revalidatePath("/control/media");
  return {};
}
