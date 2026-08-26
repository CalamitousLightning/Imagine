"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { mediaUrl } from "@/lib/media";
import { toggleProjectField, deleteProject } from "@/lib/actions/portfolio";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/domain";

export function ProjectCardAdmin({ project }: { project: Project }) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const thumb = mediaUrl(project.thumbnail ?? project.cover);

  function toggle(field: "is_featured" | "is_published", current: boolean) {
    startTransition(() => {
      void toggleProjectField(project.id, field, !current);
    });
  }

  function handleDelete() {
    startTransition(() => {
      void deleteProject(project.id, project.title);
    });
  }

  return (
    <div className="glow-card group">
      <div className="relative aspect-[4/3] bg-admin-bg">
        {thumb ? (
          <Image src={thumb} alt={project.title} fill className="object-cover" sizes="300px" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-admin-muted">
            No cover image
          </div>
        )}

        <div className="absolute inset-0 flex items-start justify-between p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => toggle("is_featured", project.is_featured)}
            disabled={pending}
            aria-pressed={project.is_featured}
            aria-label="Toggle featured"
            className={cn(
              "rounded-full p-1.5 backdrop-blur-sm",
              project.is_featured ? "bg-admin-violet text-white" : "bg-admin-bg/80 text-admin-muted"
            )}
          >
            <Star className="h-3.5 w-3.5" fill={project.is_featured ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/control/portfolio/${project.id}/edit`}
            aria-label="Edit project"
            className="rounded-full bg-admin-bg/80 p-1.5 text-admin-muted backdrop-blur-sm hover:text-admin-text"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>

        <span
          className={cn(
            "absolute bottom-2 left-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            project.is_published ? "bg-admin-green/20 text-admin-green" : "bg-admin-amber/20 text-admin-amber"
          )}
        >
          {project.is_published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="p-[22px]">
        <p className="truncate font-display text-sm text-admin-text">{project.title}</p>
        <p className="mt-0.5 font-mono text-[11px] text-admin-muted">
          {project.category?.name ?? "Uncategorized"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => toggle("is_published", project.is_published)}
            disabled={pending}
            className="font-mono text-[11px] text-admin-cyan hover:underline"
          >
            {project.is_published ? "Unpublish" : "Publish"}
          </button>

          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={pending}
                className="font-mono text-[11px] text-red-400 hover:underline"
              >
                {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="font-mono text-[11px] text-admin-muted hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete project"
              className="text-admin-muted hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
