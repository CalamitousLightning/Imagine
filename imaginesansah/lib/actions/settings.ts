"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { logActivity } from "@/lib/queries/admin";

export interface SiteSettingsInput {
  site_name: string;
  logo_media_id: string | null;
  profile_media_id: string | null;
  email: string;
  whatsapp_number: string;
  whatsapp_default_greeting: string;
  whatsapp_project_message_template: string;
  location: string;
  social_links: Record<string, string>;
  seo_title: string;
  seo_description: string;
  og_image_media_id: string | null;
}

export async function saveSiteSettings(input: SiteSettingsInput): Promise<{ error?: string }> {
  await getCurrentAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: input.site_name.trim() || "ImagineSansah",
      logo_media_id: input.logo_media_id,
      profile_media_id: input.profile_media_id,
      email: input.email.trim() || null,
      whatsapp_number: input.whatsapp_number.trim() || null,
      whatsapp_default_greeting: input.whatsapp_default_greeting,
      whatsapp_project_message_template: input.whatsapp_project_message_template,
      location: input.location.trim() || null,
      social_links: input.social_links,
      seo_title: input.seo_title.trim() || null,
      seo_description: input.seo_description.trim() || null,
      og_image_media_id: input.og_image_media_id,
    })
    .eq("id", true);

  if (error) return { error: error.message };

  await logActivity({
    action: "settings.updated",
    entity_type: "site_settings",
    summary: "Updated site settings",
  });

  revalidatePath("/", "layout");
  revalidatePath("/control/settings");
  return {};
}
