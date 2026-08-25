import Link from "next/link";
import { getClientRequestsForAdmin } from "@/lib/queries/admin";
import { RequestCard } from "@/components/admin/request-card";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types/domain";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Reviewing", value: "reviewing" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const activeStatus = searchParams.status ?? "all";
  const requests = await getClientRequestsForAdmin(activeStatus);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Client Requests</p>
        <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">Project Requests</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/control/requests" : `/control/requests?status=${f.value}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-xs",
              activeStatus === f.value
                ? "border-admin-green bg-admin-green/10 text-admin-green"
                : "border-admin-border text-admin-muted hover:text-admin-text"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            {activeStatus === "all"
              ? "No project requests yet. They'll show up here the moment someone submits the Start a Project form."
              : "No requests with this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
}
