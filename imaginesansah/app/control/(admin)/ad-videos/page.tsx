import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdVideoCard } from "@/components/admin/ad-video-card";
import { AdVideoEditorDialog } from "@/components/admin/ad-video-editor-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminAdVideosPage() {
  const supabase = createClient();

  const { data: videos } = await supabase
    .from("ad_videos")
    .select("*, media:media!ad_videos_media_id_fkey(*), poster_media:media!ad_videos_poster_media_id_fkey(*)")
    .order("display_order", { ascending: true });

  const enabledCount = (videos ?? []).filter((v: any) => v.is_enabled).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Ad Popup</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">Ad Videos</h1>
          <p className="mt-1 font-mono text-[12px] text-admin-muted">
            Shown to every visitor when they land on the site. One enabled video is picked at random each
            visit — add as many as you like.
          </p>
        </div>
        <AdVideoEditorDialog
          trigger={
            <Button className="bg-admin-green text-admin-onPrimary hover:bg-admin-green/90">
              <Plus className="mr-1.5 h-4 w-4" /> New Video
            </Button>
          }
        />
      </div>

      {enabledCount === 0 && (
        <div className="rounded-md border border-dashed border-admin-amber/50 bg-admin-amber/5 p-4">
          <p className="font-mono text-[12px] text-admin-amber">
            No videos are enabled — the popup won't show on the live site until at least one is.
          </p>
        </div>
      )}

      {!videos || videos.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            No ad videos yet. Add one — it goes live on the site immediately, no redeploy needed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video: any) => (
            <AdVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
