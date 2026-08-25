"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploadSlot } from "@/components/admin/image-upload-slot";
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { saveProject, type ProjectFormInput } from "@/lib/actions/portfolio";
import { slugify } from "@/lib/utils";
import type { Category, Media, Project } from "@/types/domain";

interface ProjectFormProps {
  categories: Category[];
  project?: Project & { gallery?: Media[] };
}

export function ProjectForm({ categories, project }: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [categoryId, setCategoryId] = useState<string | null>(project?.category_id ?? null);
  const [description, setDescription] = useState(project?.description ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [tools, setTools] = useState((project?.tools_used ?? []).join(", "));
  const [projectDate, setProjectDate] = useState(project?.project_date ?? "");
  const [cover, setCover] = useState<Media | null>(project?.cover ?? null);
  const [thumbnail, setThumbnail] = useState<Media | null>(project?.thumbnail ?? project?.cover ?? null);
  const [gallery, setGallery] = useState<Media[]>(project?.gallery ?? []);
  const [featured, setFeatured] = useState(project?.is_featured ?? false);
  const [published, setPublished] = useState(project?.is_published ?? false);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!cover) {
      setError("Add a cover image before saving.");
      return;
    }

    const input: ProjectFormInput = {
      id: project?.id,
      title,
      slug,
      category_id: categoryId,
      description,
      client,
      tools_used: tools.split(",").map((t) => t.trim()).filter(Boolean),
      project_date: projectDate || null,
      cover_media_id: cover.id,
      thumbnail_media_id: thumbnail?.id ?? cover.id,
      gallery_media_ids: gallery.map((g) => g.id),
      is_featured: featured,
      is_published: published,
    };

    startTransition(async () => {
      const result = await saveProject(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/control/portfolio");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: fields */}
        <div className="space-y-5 lg:col-span-2">
          <div>
            <Label htmlFor="title" className="text-admin-text">Project Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="text-admin-text">URL slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="mt-1.5 border-admin-border bg-admin-bg font-mono text-sm text-admin-muted"
            />
          </div>

          <div>
            <Label className="text-admin-text">Category</Label>
            <Select value={categoryId ?? undefined} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1.5 border-admin-border bg-admin-bg text-admin-text">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-admin-text">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="client" className="text-admin-text">Client (optional)</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-admin-text">Project Date</Label>
              <Input
                id="date"
                type="date"
                value={projectDate ?? ""}
                onChange={(e) => setProjectDate(e.target.value)}
                className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tools" className="text-admin-text">Tools Used</Label>
            <Input
              id="tools"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="Photoshop, Illustrator, Figma"
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
            <p className="mt-1 font-mono text-[11px] text-admin-muted">Comma-separated.</p>
          </div>

          <GalleryUploader bucket="portfolio" value={gallery} onChange={setGallery} />
        </div>

        {/* RIGHT: images + publish controls */}
        <div className="space-y-5">
          <ImageUploadSlot label="Cover Image" bucket="portfolio" value={cover} onChange={setCover} />
          <ImageUploadSlot label="Thumbnail" bucket="portfolio" value={thumbnail} onChange={setThumbnail} aspect="aspect-square" />

          <div className="space-y-4 rounded-md border border-admin-border bg-admin-panel p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured" className="text-admin-text">Featured</Label>
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="published" className="text-admin-text">Published</Label>
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={pending} className="bg-admin-green text-admin-bg hover:bg-admin-green/90">
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {pending ? "Saving..." : project ? "Save Changes" : "Create Project"}
            </Button>
            {project?.is_published && (
              <a
                href={`/portfolio/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-md border border-admin-border py-2 font-mono text-xs text-admin-muted hover:text-admin-text"
              >
                <Eye className="h-3.5 w-3.5" /> View Live
              </a>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
