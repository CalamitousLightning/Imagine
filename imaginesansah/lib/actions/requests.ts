"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";
import type { RequestStatus } from "@/types/domain";

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  clientName: string
): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const { error } = await supabase.from("client_requests").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  await logActivity({
    action: "request.status_changed",
    entity_type: "client_request",
    entity_id: id,
    summary: `Marked ${clientName}'s request as "${status.replace("_", " ")}"`,
  });

  revalidatePath("/control/requests");
  revalidatePath("/control");
  return {};
}
