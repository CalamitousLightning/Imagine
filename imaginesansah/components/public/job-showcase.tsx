import { Paperclip } from "lucide-react";
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

export function JobShowcase({ items }: { items: JobShowcaseItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-public-black/10 bg-public-white py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="mb-12 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-public-violet opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-public-violet" />
            </span>
            <h2 className="font-display text-3xl font-medium text-public-black lg:text-4xl">
              Recent Requests
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={Math.min(i, 4) * 0.06}>
              <div className="glow-card-public flex h-full flex-col justify-between p-5">
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
                  <span className={`pill-badge-public ${STATUS_PILL_CLASS[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  <span className="font-body text-[11px] text-public-black/35">{timeAgo(item.created_at)}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
