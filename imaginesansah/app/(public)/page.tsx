import Link from "next/link";
import Image from "next/image";
import { HeroShowcase } from "@/components/public/hero-showcase";
import {
  getEnabledHeroSlides,
  getFeaturedProjects,
  getPublishedServices,
  getSiteContent,
  mediaUrl,
} from "@/lib/queries/public";

export default async function HomePage() {
  const [slides, featured, services, content] = await Promise.all([
    getEnabledHeroSlides(),
    getFeaturedProjects(4),
    getPublishedServices(),
    getSiteContent(["intro.philosophy", "intro.difference"]),
  ]);

  return (
    <>
      <HeroShowcase slides={slides} />

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">
          Who I Am
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-[1.15] text-public-black lg:text-5xl">
          {content["intro.philosophy"] ||
            "A Ghanaian graphic designer building visual identities that people actually remember."}
        </h2>
        <p className="mt-6 max-w-xl font-body text-public-black/70">
          {content["intro.difference"] ||
            "Every brief starts with a question: what does this brand look like when it's confident in itself? The answer is never a template."}
        </p>
      </section>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="border-t border-public-black/10 bg-public-white py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-display text-3xl font-medium text-public-black lg:text-4xl">
                Featured Work
              </h2>
              <Link href="/portfolio" className="font-body text-sm text-public-black/60 hover:text-public-violet">
                View all →
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((project) => {
                const cover = mediaUrl(project.cover);
                return (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-public-ivory">
                      {cover && (
                        <Image
                          src={cover}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <h3 className="font-display text-xl text-public-black">{project.title}</h3>
                      {project.category && (
                        <span className="font-body text-xs uppercase tracking-wide text-public-black/50">
                          {project.category.name}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES TEASER */}
      {services.length > 0 && (
        <section className="border-t border-public-black/10 py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="mb-12 font-display text-3xl font-medium text-public-black lg:text-4xl">
              What I Do
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/start-a-project?service=${service.slug}`}
                  className="group rounded-sm border border-public-black/10 p-8 transition-colors hover:border-public-violet"
                >
                  <h3 className="font-display text-lg text-public-black">{service.title}</h3>
                  {service.description && (
                    <p className="mt-2 font-body text-sm text-public-black/60">{service.description}</p>
                  )}
                  <span className="mt-6 inline-block font-body text-sm text-public-violet opacity-0 transition-opacity group-hover:opacity-100">
                    Request this service →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING CTA */}
      <section className="bg-public-black py-28 text-center">
        <h2 className="mx-auto max-w-2xl px-6 font-display text-3xl font-medium text-public-white lg:text-5xl">
          {content["cta.closing_headline"] || "Have an idea worth designing?"}
        </h2>
        <Link
          href="/start-a-project"
          className="mt-8 inline-block rounded-full bg-public-coral px-8 py-3 font-body text-sm font-medium text-public-black transition-transform hover:scale-105 motion-reduce:transition-none"
        >
          Start a Project
        </Link>
      </section>
    </>
  );
}
