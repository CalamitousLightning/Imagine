import { notFound } from "next/navigation";
import { getCategories } from "@/lib/queries/public";
import { getProjectForEdit } from "@/lib/queries/admin";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const [categories, project] = await Promise.all([
    getCategories(),
    getProjectForEdit(params.id),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-5xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Portfolio</p>
      <h1 className="mt-1 mb-6 font-display text-2xl font-medium text-admin-text">Edit Project</h1>
      <ProjectForm categories={categories} project={project} />
    </div>
  );
}
