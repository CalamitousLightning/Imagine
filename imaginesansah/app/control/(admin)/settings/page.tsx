import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select(
      "*, logo:media!site_settings_logo_media_id_fkey(*), profile:media!site_settings_profile_media_id_fkey(*), og_image:media!site_settings_og_image_media_id_fkey(*)"
    )
    .single();

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Settings</p>
      <h1 className="mt-1 mb-8 font-display text-2xl font-medium text-admin-text">Site Settings</h1>
      <SiteSettingsForm settings={settings as any} />
    </div>
  );
}
