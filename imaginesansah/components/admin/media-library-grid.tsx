"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, Search, FileText } from "lucide-react";
import { deleteMedia } from "@/lib/actions/media";
import { cn } from "@/lib/utils";
import type { MediaLibraryItem } from "@/lib/queries/admin";

const BUCKETS = [
  { label: "All", value: "all" },
  { label: "Portfolio", value: "portfolio" },
  { label: "Hero", value: "hero" },
  { label: "Profile", value: "profile" },
  { label: "Site Assets", value: "site-assets" },
  { label: "Client Files", value: "client-files" },
];

export function MediaLibraryGrid({
  items,
  activeBucket,
}: {
  items: MediaLibraryItem[];
  activeBucket: string;
}) {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => items.filter((i) => i.file_name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  function handleDelete(item: MediaLibraryItem) {
    startTransition(() => {
      void deleteMedia(item.id, item.bucket, item.path);
    });
    setConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {BUCKETS.map((b) => (
            <Link
              key={b.value}
              href={b.value === "all" ? "/control/media" : `/control/media?bucket=${b.value}`}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs",
                activeBucket === b.value
                  ? "border-admin-green bg-admin-green/10 text-admin-green"
                  : "border-admin-border text-admin-muted hover:text-admin-text"
              )}
            >
              {b.label}
            </Link>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filename..."
            className="rounded-full border border-admin-border bg-admin-bg py-1.5 pl-8 pr-3 font-mono text-xs text-admin-text placeholder:text-admin-muted"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            {items.length === 0 ? "No files here yet." : "No files match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => {
            const isImage = item.file_type?.startsWith("image/");
            const confirming = confirmId === item.id;

            return (
              <div key={item.id} className="overflow-hidden rounded-md border border-admin-border bg-admin-panel">
                <div className="relative aspect-square bg-admin-bg">
                  {isImage && item.url ? (
                    <Image src={item.url} alt={item.file_name} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-6 w-6 text-admin-muted" />
                    </div>
                  )}
                  {item.referenced && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-admin-cyan/20 px-2 py-0.5 font-mono text-[9px] text-admin-cyan">
                      In use
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate font-mono text-[11px] text-admin-text">{item.file_name}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-admin-muted">
                      {item.file_size_bytes ? `${Math.round(item.file_size_bytes / 1024)}KB` : ""}
                    </span>
                    {confirming ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={pending}
                          className="font-mono text-[10px] text-red-400 hover:underline"
                        >
                          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="font-mono text-[10px] text-admin-muted hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item.id)}
                        aria-label="Delete file"
                        className="text-admin-muted hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {confirming && item.referenced && (
                    <p className="mt-1 font-mono text-[10px] text-admin-amber">
                      This file is in use elsewhere on the site. Deleting it will break that image.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
