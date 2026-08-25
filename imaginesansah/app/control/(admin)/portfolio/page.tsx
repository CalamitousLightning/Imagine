import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProjectsForAdmin } from "@/lib/queries/admin";
import { ProjectCardAdmin } from "@/components/admin/project-card-admin";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Portfolio</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">Manage Projects</h1>
        </div>
        <Link href="/control/portfolio/new">
          <Button className="bg-admin-green text-admin-bg hover:bg-admin-green/90">
            <Plus className="mr-1.5 h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            No projects yet. Create your first one to see it here — and on the public site once published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project: any) => (
            <ProjectCardAdmin key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
