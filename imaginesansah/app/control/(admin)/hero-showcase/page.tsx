import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HeroShowcase } from "@/components/public/hero-showcase";
import { HeroSlideCard } from "@/components/admin/hero-slide-card";
import { HeroSlideEditorDialog } from "@/components/admin/hero-slide-editor-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminHeroShowcasePage() {
  const supabase = createClient();

  const [{ data: slides }, { data: projects }] = await Promise.all([
    supabase
      .from("hero_slides")
      .select(
        "*, primary_media:media!hero_slides_primary_media_id_fkey(*), secondary_media:media!hero_slides_secondary_media_id_fkey(*)"
      )
      .order("display_order", { ascending: true }),
    supabase.from("projects").select("id, title").order("title"),
  ]);

  const enabledSlides = (slides ?? []).filter((s: any) => s.is_enabled);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Hero Showcase</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">Manage Slides</h1>
        </div>
        <HeroSlideEditorDialog
          projects={projects ?? []}
          trigger={
            <Button className="bg-admin-green text-admin-onPrimary hover:bg-admin-green/90">
              <Plus className="mr-1.5 h-4 w-4" /> New Slide
            </Button>
          }
        />
      </div>

      {enabledSlides.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-admin-cyan">
            Live Preview (matches the public homepage)
          </p>
          <div className="overflow-hidden rounded-md border border-admin-border">
            <HeroShowcase slides={enabledSlides as any} />
          </div>
        </div>
      )}

      {!slides || slides.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            No slides yet. The homepage hero stays empty until you add at least one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide: any) => (
            <HeroSlideCard key={slide.id} slide={slide} projects={projects ?? []} />
          ))}
        </div>
      )}
    </div>
  );
}
