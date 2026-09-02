"use client";

import { useEffect, useMemo, useState } from "react";
import { Paperclip } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { JobShowcaseItem, RequestStatus } from "@/types/domain";

const STATUS_LABEL: Record<RequestStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  in_progress: "In Progress",
  completed: "Done",
  cancelled: "Cancelled",
};

const STATUS_PILL_CLASS: Record<RequestStatus, string> = {
  new: "pill-badge-public--accent",
  reviewing: "pill-badge-public--accent",
  in_progress: "pill-badge-public--coral",
  completed: "pill-badge-public--lime",
  cancelled: "pill-badge-public--coral",
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function RequestCard({ item }: { item: JobShowcaseItem }) {
  return (
    <div className="glow-card-public flex h-full w-72 shrink-0 flex-col justify-between p-5 sm:w-80">
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base text-public-black">{item.client_name}</p>
          {item.has_reference_file && (
            <Paperclip className="mt-0.5 h-3.5 w-3.5 shrink-0 text-public-black/30" aria-label="Reference file attached" />
          )}
        </div>
        <p className="mt-1.5 font-body text-sm text-public-black/60">{item.project_type}</p>
        {item.service?.title && (
          <p className="mt-0.5 font-body text-xs text-public-black/40">{item.service.title}</p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <span className={`pill-badge-public ${STATUS_PILL_CLASS[item.status]}`}>{STATUS_LABEL[item.status]}</span>
        <span className="font-body text-[11px] text-public-black/35">{timeAgo(item.created_at)}</span>
      </div>
    </div>
  );
}

/**
 * One self-scrolling marquee row. Content is rendered twice back-to-back
 * and the track animates exactly -50% so the loop is seamless regardless
 * of how many cards are in `row` — the fixed row height/width comes from
 * each card being a fixed w-72/w-80, so 4 cards always overflows the
 * viewport width and the illusion holds even on wide desktop screens.
 */
function MarqueeRow({ row, reverse }: { row: JobShowcaseItem[]; reverse: boolean }) {
  if (row.length === 0) return null;
  return (
    <div className="marquee-row">
      <div className={`marquee-track gap-5 py-1 ${reverse ? "marquee-track--reverse" : ""}`}>
        {[...row, ...row].map((item, i) => (
          <RequestCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

const VISIBLE_COUNT = 8; // 4 per row x 2 rows
const ROTATE_MS = 10000; // slower page-swap cadence, per request

export function JobShowcase({ items }: { items: JobShowcaseItem[] }) {
  const reduceMotion = useReducedMotion();

  // Split the fetched pool into pages of 8. If there are more than 8
  // requests, we rotate which page is on screen every few seconds instead
  // of showing all of them at once — still only ever 2 rows / 8 cards
  // visible, but everything in the pool surfaces over time.
  const pages = useMemo(() => {
    if (items.length <= VISIBLE_COUNT) return [items];
    const out: JobShowcaseItem[][] = [];
    for (let i = 0; i < items.length; i += VISIBLE_COUNT) out.push(items.slice(i, i + VISIBLE_COUNT));
    return out;
  }, [items]);

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pages.length <= 1 || reduceMotion) return;
    const id = setInterval(() => setPageIndex((i) => (i + 1) % pages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [pages.length, reduceMotion]);

  if (items.length === 0) return null;

  const current = pages[Math.min(pageIndex, pages.length - 1)] ?? [];
  const row1 = current.slice(0, 4);
  const row2 = current.slice(4, 8);

  return (
    <section className="border-t border-public-black/10 bg-public-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="mb-12 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-public-violet opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-public-violet" />
            </span>
            <h2 className="font-display text-3xl font-medium text-public-black lg:text-4xl">Recent Requests</h2>
          </div>
        </ScrollReveal>

        {/* Remounting on pageIndex change gets us a clean fade + restarts
            each row's marquee from the top of its loop for the new page. */}
        <div key={pageIndex} className="animate-in fade-in-0 duration-500 space-y-5">
          <MarqueeRow row={row1} reverse={false} />
          {row2.length > 0 && <MarqueeRow row={row2} reverse />}
        </div>
      </div>
    </section>
  );
}
