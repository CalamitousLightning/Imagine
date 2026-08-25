import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getRelatedProjects,
  getSiteSettings,
  mediaUrl,
} from "@/lib/queries/public";
import { GalleryLightbox } from "@/components/public/gallery-lightbox";
import { ProjectCard } from "@/components/public/project-card";
import { buildWhatsAppUrl, fillProjectMessageTemplate } from "@/lib/whatsapp";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description ?? `${project.title} — a project by ImagineSansah.`,
    openGraph: {
      images: mediaUrl(project.cover) ? [mediaUrl(project.cover)!] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProjects(project.id, project.category_id),
    getSiteSettings(),
  ]);

  const cover = mediaUrl(project.cover);
  const whatsappMessage = settings.whatsapp_number
    ? fillProjectMessageTemplate({
        template: settings.whatsapp_project_message_template,
        name: "there",
        projectType: project.category?.name ?? "a project like this",
      })
    : null;

  return (
    <article>
      {/* HERO */}
      <header className="mx-auto max-w-5xl px-6 pt-16 lg:px-10">
        {project.category && (
          <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">
            {project.category.name}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] text-public-black lg:text-6xl">
          {project.title}
        </h1>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-public-black/10 pt-6 font-body text-sm">
          {project.client && (
            <div>
              <dt className="text-public-black/40">Client</dt>
              <dd className="mt-0.5 text-public-black">{project.client}</dd>
            </div>
          )}
          {project.project_date && (
            <div>
              <dt className="text-public-black/40">Date</dt>
              <dd className="mt-0.5 text-public-black">{formatDate(project.project_date)}</dd>
            </div>
          )}
          {project.tools_used?.length > 0 && (
            <div>
              <dt className="text-public-black/40">Tools</dt>
              <dd className="mt-0.5 text-public-black">{project.tools_used.join(", ")}</dd>
            </div>
          )}
        </dl>
      </header>

      {cover && (
        <div className="relative mx-auto mt-12 aspect-[16/9] max-w-6xl overflow-hidden px-6 lg:px-10">
          <Image src={cover} alt={project.title} fill priority className="object-cover" sizes="100vw" />
        </div>
      )}

      {/* DESCRIPTION */}
      {project.description && (
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
          <p className="font-body text-lg leading-relaxed text-public-black/80">{project.description}</p>
        </div>
      )}

      {/* GALLERY */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pb-16 lg:px-10">
          <GalleryLightbox images={project.gallery} title={project.title} />
        </div>
      )}

      {/* CTA */}
      <div className="border-y border-public-black/10 bg-public-white py-16 text-center">
        <h2 className="font-display text-2xl text-public-black lg:text-3xl">
          Want something like this for your brand?
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/start-a-project"
            className="rounded-full bg-public-black px-6 py-3 font-body text-sm font-medium text-public-white hover:bg-public-violet"
          >
            Start a Project
          </Link>
          {settings.whatsapp_number && whatsappMessage && (
            <a
              href={buildWhatsAppUrl(settings.whatsapp_number, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-public-black px-6 py-3 font-body text-sm font-medium text-public-black hover:bg-public-black hover:text-public-white"
            >
              WhatsApp Me
            </a>
          )}
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <h2 className="mb-10 font-display text-2xl font-medium text-public-black">More Work</h2>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
