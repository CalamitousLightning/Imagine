"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { ServiceEditorDialog } from "@/components/admin/service-editor-dialog";
import { deleteService, toggleServicePublished } from "@/lib/actions/services";
import type { Service } from "@/types/domain";

export function ServiceRowActions({ service }: { service: Service }) {
  const [pending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => startTransition(() => void toggleServicePublished(service.id, !service.is_published))}
        disabled={pending}
        className="font-mono text-[11px] text-admin-cyan hover:underline"
      >
        {service.is_published ? "Unpublish" : "Publish"}
      </button>

      <ServiceEditorDialog
        service={service}
        trigger={
          <button aria-label="Edit service" className="text-admin-muted hover:text-admin-text">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        }
      />

      {confirmingDelete ? (
        <>
          <button
            onClick={() => startTransition(() => void deleteService(service.id, service.title))}
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
        </>
      ) : (
        <button
          onClick={() => setConfirmingDelete(true)}
          aria-label="Delete service"
          className="text-admin-muted hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
