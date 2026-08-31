import Link from "next/link";
import { HeroShowcase } from "@/components/public/hero-showcase";
import { ProjectCard } from "@/components/public/project-card";
import {
  getEnabledHeroSlides,
  getFeaturedProjects,
  getPublishedServices,
  getSiteContent,
} from "@/lib/queries/public";

export default async function HomePage() {
  const [slides, featured, services, content] = await Promise.all([
    getEnabledHeroSlides(),
    getFeaturedProjects(4),
    getPublishedServices(),
    getSiteContent(["intro.philosophy", "intro.difference", "cta.closing_headline"]),
  ]);

  return (
    <>
      <HeroShowcase slides={slides} />

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden px-6 py-28 lg:px-10">
        {/* Contained radial glow — a restrained nod to a more contemporary
            product feel, without turning the editorial layout into a SaaS page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl">
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
        </div>
      </section>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="border-t border-public-black/10 bg-public-white py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-display text-3xl font-medium text-public-black lg:text-4xl">
                Featured Work
              </h2>
              <Link href="/portfolio" className="font-body text-sm text-public-black/60 transition-colors hover:text-public-violet">
                View all →
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
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
                  className="group rounded-lg border border-public-black/10 bg-public-white p-8 shadow-[0_2px_16px_rgba(17,17,17,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-public-violet/40 hover:shadow-[0_16px_36px_rgba(124,58,237,0.14)]"
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
      <section className="relative overflow-hidden bg-public-black py-28 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF5A36, transparent 70%)" }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl px-6 font-display text-3xl font-medium text-public-white lg:text-5xl">
            {content["cta.closing_headline"] || "Have an idea worth designing?"}
          </h2>
          <Link
            href="/start-a-project"
            className="mt-8 inline-block rounded-full bg-public-coral px-8 py-3 font-body text-sm font-medium text-public-black shadow-[0_10px_30px_rgba(255,90,54,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(255,90,54,0.55)] motion-reduce:transition-none"
          >
            Fill a Form
          </Link>
        </div>
      </section>
    </>
  );
}
