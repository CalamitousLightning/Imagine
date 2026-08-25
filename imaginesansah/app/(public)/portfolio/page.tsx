import type { Metadata } from "next";
import { getCategories, getPublishedProjects } from "@/lib/queries/public";
import { CategoryFilter } from "@/components/public/category-filter";
import { ProjectCard } from "@/components/public/project-card";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Branding, logo design, flyers, posters, and social media work by ImagineSansah.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, projects] = await Promise.all([
    getCategories(),
    getPublishedProjects(searchParams.category),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">Portfolio</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-public-black lg:text-5xl">
        Selected Work
      </h1>

      <div className="mt-10">
        <CategoryFilter categories={categories} active={searchParams.category} />
      </div>

      {projects.length === 0 ? (
        <div className="mt-20 border-t border-public-black/10 py-20 text-center">
          <p className="font-body text-public-black/50">
            {searchParams.category
              ? "No published work in this category yet."
              : "No published work yet — check back soon."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
