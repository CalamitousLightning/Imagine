import Link from "next/link";
import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import type { Project } from "@/types/domain";

export function ProjectCard({ project }: { project: Project }) {
  const cover = mediaUrl(project.thumbnail ?? project.cover);

  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="glow-card-public group aspect-[4/3]">
        {cover && (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {project.is_featured && (
          <span className="pill-badge-public pill-badge-public--accent absolute left-3 top-3">
            Featured
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg text-public-black transition-colors group-hover:text-public-violet">
          {project.title}
        </h3>
        {project.category && (
          <span className="font-body text-xs uppercase tracking-wide text-public-black/50">
            {project.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}
