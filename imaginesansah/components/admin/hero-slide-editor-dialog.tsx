"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploadSlot } from "@/components/admin/image-upload-slot";
import { saveHeroSlide } from "@/lib/actions/hero-slides";
import type { HeroComposition, HeroSlide, Media, Project } from "@/types/domain";

const COMPOSITIONS: { value: HeroComposition; label: string }[] = [
  { value: "portrait_with_artwork", label: "Portrait with Artwork" },
  { value: "editorial", label: "Editorial" },
  { value: "portrait_beside_design", label: "Portrait Beside Design" },
  { value: "full_impact_showcase", label: "Full-Impact Showcase" },
  { value: "portrait_typography_branding", label: "Portrait + Typography" },
];

interface HeroSlideEditorDialogProps {
  slide?: HeroSlide;
  projects: Pick<Project, "id" | "title">[];
  trigger: React.ReactNode;
}

export function HeroSlideEditorDialog({ slide, projects, trigger }: HeroSlideEditorDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [composition, setComposition] = useState<HeroComposition>(
    slide?.composition ?? "portrait_with_artwork"
  );
  const [headline, setHeadline] = useState(slide?.headline ?? "");
  const [subtext, setSubtext] = useState(slide?.subtext ?? "");
  const [primary, setPrimary] = useState<Media | null>(slide?.primary_media ?? null);
  const [secondary, setSecondary] = useState<Media | null>(slide?.secondary_media ?? null);
  const [featuredProjectId, setFeaturedProjectId] = useState<string | null>(
    slide?.featured_project_id ?? null
  );
  const [durationMs, setDurationMs] = useState(slide?.duration_ms ?? 5000);
  const [enabled, setEnabled] = useState(slide?.is_enabled ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveHeroSlide({
        id: slide?.id,
        composition,
        headline,
        subtext,
        primary_media_id: primary?.id ?? null,
        secondary_media_id: secondary?.id ?? null,
        featured_project_id: featuredProjectId,
        duration_ms: durationMs,
        is_enabled: enabled,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="theme-admin max-h-[90vh] max-w-2xl overflow-y-auto border-admin-border bg-admin-panel text-admin-text">
        <DialogHeader>
          <DialogTitle className="text-admin-text">{slide ? "Edit Slide" : "New Slide"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <div>
            <Label className="text-admin-text">Composition</Label>
            <Select value={composition} onValueChange={(v) => setComposition(v as HeroComposition)}>
              <SelectTrigger className="mt-1.5 border-admin-border bg-admin-bg text-admin-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPOSITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="headline" className="text-admin-text">Headline (optional)</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div>
            <Label htmlFor="subtext" className="text-admin-text">Subtext (optional)</Label>
            <Textarea
              id="subtext"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              rows={2}
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploadSlot label="Primary (portrait)" bucket="hero" value={primary} onChange={setPrimary} />
            <ImageUploadSlot label="Secondary (artwork)" bucket="hero" value={secondary} onChange={setSecondary} />
          </div>

          {projects.length > 0 && (
            <div>
              <Label className="text-admin-text">Link to Featured Project (optional)</Label>
              <Select
                value={featuredProjectId ?? "none"}
                onValueChange={(v) => setFeaturedProjectId(v === "none" ? null : v)}
              >
                <SelectTrigger className="mt-1.5 border-admin-border bg-admin-bg text-admin-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration" className="text-admin-text">Duration (ms)</Label>
              <Input
                id="duration"
                type="number"
                min={2000}
                step={500}
                value={durationMs}
                onChange={(e) => setDurationMs(Number(e.target.value))}
                className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
              />
            </div>
            <div className="flex items-end justify-between pb-2">
              <Label htmlFor="enabled" className="text-admin-text">Enabled</Label>
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>

          <Button type="submit" disabled={pending} className="w-full bg-admin-green text-admin-onPrimary hover:bg-admin-green/90">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Saving..." : "Save Slide"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
