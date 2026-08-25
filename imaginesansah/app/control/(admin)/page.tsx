import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";
import { getDashboardStats, getRecentActivity } from "@/lib/queries/admin";
import { timeAgo } from "@/lib/utils";
import { FolderKanban, Star, Inbox, Sparkles, CheckCircle2 } from "lucide-react";

const STAT_CARDS = [
  { key: "totalProjects", label: "Total Projects", icon: FolderKanban, accent: "text-admin-cyan" },
  { key: "featuredProjects", label: "Featured Projects", icon: Star, accent: "text-admin-violet" },
  { key: "totalRequests", label: "Total Client Requests", icon: Inbox, accent: "text-admin-cyan" },
  { key: "newRequests", label: "New Requests", icon: Sparkles, accent: "text-admin-amber" },
  { key: "completedProjects", label: "Completed Projects", icon: CheckCircle2, accent: "text-admin-green" },
] as const;

export default async function AdminOverviewPage() {
  const [admin, stats, activity] = await Promise.all([
    getCurrentAdmin(),
    getDashboardStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">
          IMAGINESANSAH // CREATIVE CONTROL
        </p>
        <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">
          Welcome back{admin.full_name ? `, ${admin.full_name}` : ""}.
        </h1>
      </div>

      {/* SYSTEM PANEL */}
      <Card className="border-admin-border bg-admin-panel">
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3 p-5 font-mono text-xs">
          <span className="text-admin-muted">IMAGINESANSAH_OS</span>
          <span className="flex items-center gap-1.5 text-admin-green">
            <span className="h-1.5 w-1.5 rounded-full bg-admin-green" /> SYSTEM: ONLINE
          </span>
          <span className="flex items-center gap-1.5 text-admin-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-admin-cyan" /> DATABASE: CONNECTED
          </span>
          <span className="flex items-center gap-1.5 text-admin-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-admin-cyan" /> STORAGE: CONNECTED
          </span>
          <span className="flex items-center gap-1.5 text-admin-violet">
            <span className="h-1.5 w-1.5 rounded-full bg-admin-violet" /> PORTFOLIO: ONLINE
          </span>
        </CardContent>
      </Card>

      {/* STATISTICS — real Supabase counts, never faked */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STAT_CARDS.map(({ key, label, icon: Icon, accent }) => (
          <Card key={key} className="border-admin-border bg-admin-panel">
            <CardContent className="p-5">
              <Icon className={`h-4 w-4 ${accent}`} />
              <p className="mt-3 font-display text-2xl font-medium text-admin-text">{stats[key]}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-admin-muted">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="border-admin-border bg-admin-panel">
        <CardHeader>
          <CardTitle className="text-admin-text">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activity.length === 0 ? (
            <p className="font-mono text-xs text-admin-muted">
              Nothing yet — activity shows up here as projects, requests, and content change.
            </p>
          ) : (
            activity.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border-b border-admin-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm text-admin-text">{entry.summary}</p>
                <p className="font-mono text-[11px] text-admin-muted">{timeAgo(entry.created_at)}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
