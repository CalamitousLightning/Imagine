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
import { Switch } from "@/components/ui/switch";
import { VideoUploadSlot } from "@/components/admin/video-upload-slot";
import { ImageUploadSlot } from "@/components/admin/image-upload-slot";
import { saveAdVideo } from "@/lib/actions/ad-videos";
import type { AdVideo, Media } from "@/types/domain";

interface AdVideoEditorDialogProps {
  video?: AdVideo;
  trigger: React.ReactNode;
}

export function AdVideoEditorDialog({ video, trigger }: AdVideoEditorDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [media, setMedia] = useState<Media | null>(video?.media ?? null);
  const [poster, setPoster] = useState<Media | null>(video?.poster_media ?? null);
  const [title, setTitle] = useState(video?.title ?? "");
  const [ctaLabel, setCtaLabel] = useState(video?.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(video?.cta_href ?? "");
  const [enabled, setEnabled] = useState(video?.is_enabled ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!media) {
      setError("Upload a video first.");
      return;
    }

    startTransition(async () => {
      const result = await saveAdVideo({
        id: video?.id,
        title,
        cta_label: ctaLabel,
        cta_href: ctaHref,
        media_id: media.id,
        poster_media_id: poster?.id ?? null,
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
          <DialogTitle className="text-admin-text">{video ? "Edit Ad Video" : "New Ad Video"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <VideoUploadSlot label="Ad video (20-60s, MP4/WebM/MOV)" value={media} onChange={setMedia} />
            <ImageUploadSlot
              label="Poster image (optional)"
              bucket="site-assets"
              value={poster}
              onChange={setPoster}
              aspect="aspect-video"
            />
          </div>

          <div>
            <Label htmlFor="title" className="text-admin-text">Caption (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. See what we've been shooting lately"
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cta-label" className="text-admin-text">Button label (optional)</Label>
              <Input
                id="cta-label"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="e.g. Start a project"
                className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
              />
            </div>
            <div>
              <Label htmlFor="cta-href" className="text-admin-text">Button link (optional)</Label>
              <Input
                id="cta-href"
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
                placeholder="/start-a-project"
                className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-admin-border p-3">
            <Label htmlFor="enabled" className="text-admin-text">Enabled (eligible to show in the popup)</Label>
            <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-admin-green text-admin-onPrimary hover:bg-admin-green/90"
          >
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Saving..." : "Save Video"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
