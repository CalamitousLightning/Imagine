import { getCategories } from "@/lib/queries/public";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-5xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Portfolio</p>
      <h1 className="mt-1 mb-6 font-display text-2xl font-medium text-admin-text">New Project</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
