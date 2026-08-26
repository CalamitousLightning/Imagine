"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Mail, FileText, ChevronDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateRequestStatus } from "@/lib/actions/requests";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatDate, timeAgo, cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/domain";
import type { AdminRequestFile } from "@/lib/queries/admin";

const STATUSES: RequestStatus[] = ["new", "reviewing", "in_progress", "completed", "cancelled"];

interface RequestCardProps {
  request: {
    id: string;
    full_name: string;
    whatsapp_number: string;
    email: string | null;
    project_type: string;
    description: string;
    preferred_deadline: string | null;
    budget_range: string | null;
    reference_notes: string | null;
    status: RequestStatus;
    created_at: string;
    service?: { title: string } | null;
    files: AdminRequestFile[];
  };
}

export function RequestCard({ request }: RequestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(request.status);

  function changeStatus(next: RequestStatus) {
    setStatus(next);
    startTransition(() => {
      void updateRequestStatus(request.id, next, request.full_name);
    });
  }

  return (
    <div className="glow-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-admin-text">{request.full_name}</p>
          <p className="mt-0.5 font-mono text-xs text-admin-muted">
            {request.project_type}
            {request.service?.title ? ` · ${request.service.title}` : ""} · {timeAgo(request.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-admin-muted" />}
          <select
            value={status}
            onChange={(e) => changeStatus(e.target.value as RequestStatus)}
            disabled={pending}
            className="rounded-full border border-admin-border bg-admin-bg px-3 py-1 font-mono text-xs text-admin-text"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
          <Badge variant={status as any}>{status.replace("_", " ")}</Badge>
        </div>
      </div>

      <p className={cn("mt-4 font-body text-sm text-admin-text/80", !expanded && "line-clamp-2")}>
        {request.description}
      </p>
      {request.description.length > 140 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 font-mono text-[11px] text-admin-cyan"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
        </button>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-admin-border pt-4 font-mono text-xs sm:grid-cols-4">
        <div>
          <dt className="text-admin-muted">Deadline</dt>
          <dd className="mt-0.5 text-admin-text">
            {request.preferred_deadline ? formatDate(request.preferred_deadline) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-admin-muted">Budget</dt>
          <dd className="mt-0.5 text-admin-text">{request.budget_range || "—"}</dd>
        </div>
        <div>
          <dt className="text-admin-muted">Submitted</dt>
          <dd className="mt-0.5 text-admin-text">{formatDate(request.created_at)}</dd>
        </div>
        <div>
          <dt className="text-admin-muted">References</dt>
          <dd className="mt-0.5 text-admin-text">{request.files.length}</dd>
        </div>
      </dl>

      {expanded && request.reference_notes && (
        <p className="mt-3 rounded-md bg-admin-bg p-3 font-body text-sm text-admin-text/70">
          <span className="font-mono text-[11px] uppercase text-admin-muted">Reference notes: </span>
          {request.reference_notes}
        </p>
      )}

      {expanded && request.files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {request.files.map((f) =>
            f.signedUrl ? (
              <a
                key={f.id}
                href={f.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-admin-border bg-admin-bg px-2.5 py-1.5 font-mono text-[11px] text-admin-cyan hover:underline"
              >
                <FileText className="h-3 w-3" /> {f.file_name}
              </a>
            ) : null
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={buildWhatsAppUrl(request.whatsapp_number)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-admin-green/15 px-3 py-1.5 font-mono text-[11px] text-admin-green hover:bg-admin-green/25"
        >
          <MessageCircle className="h-3 w-3" /> WhatsApp
        </a>
        {request.email && (
          <a
            href={`mailto:${request.email}`}
            className="flex items-center gap-1.5 rounded-full border border-admin-border px-3 py-1.5 font-mono text-[11px] text-admin-muted hover:text-admin-text"
          >
            <Mail className="h-3 w-3" /> Email
          </a>
        )}
      </div>
    </div>
  );
}
