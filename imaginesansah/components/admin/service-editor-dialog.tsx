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
import { Switch } from "@/components/ui/switch";
import { ImageUploadSlot } from "@/components/admin/image-upload-slot";
import { saveService } from "@/lib/actions/services";
import type { Media, Service } from "@/types/domain";

interface ServiceEditorDialogProps {
  service?: Service;
  trigger: React.ReactNode;
}

export function ServiceEditorDialog({ service, trigger }: ServiceEditorDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(service?.title ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [icon, setIcon] = useState<Media | null>(service?.icon ?? null);
  const [published, setPublished] = useState(service?.is_published ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveService({
        id: service?.id,
        title,
        description,
        icon_media_id: icon?.id ?? null,
        is_published: published,
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
      <DialogContent className="theme-admin border-admin-border bg-admin-panel text-admin-text">
        <DialogHeader>
          <DialogTitle className="text-admin-text">{service ? "Edit Service" : "New Service"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <div>
            <Label htmlFor="service-title" className="text-admin-text">Title</Label>
            <Input
              id="service-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div>
            <Label htmlFor="service-description" className="text-admin-text">Description</Label>
            <Textarea
              id="service-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <ImageUploadSlot label="Icon / Image" bucket="site-assets" value={icon} onChange={setIcon} aspect="aspect-video" />

          <div className="flex items-center justify-between">
            <Label htmlFor="service-published" className="text-admin-text">Published</Label>
            <Switch id="service-published" checked={published} onCheckedChange={setPublished} />
          </div>

          <Button type="submit" disabled={pending} className="w-full bg-admin-green text-admin-bg hover:bg-admin-green/90">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Saving..." : "Save Service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
