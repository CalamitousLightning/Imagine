import Link from "next/link";
import { HeroShowcase } from "@/components/public/hero-showcase";
import { ProjectCard } from "@/components/public/project-card";
import { JobShowcase } from "@/components/public/job-showcase";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { SectionEyebrow } from "@/components/public/section-eyebrow";
import {
  getEnabledHeroSlides,
  getFeaturedProjects,
  getPublishedServices,
  getSiteContent,
  getJobShowcase,
} from "@/lib/queries/public";

export default async function HomePage() {
  const [slides, featured, services, content, jobShowcase] = await Promise.all([
    getEnabledHeroSlides(),
    getFeaturedProjects(4),
    getPublishedServices(),
    getSiteContent(["intro.philosophy", "intro.difference", "cta.closing_headline"]),
    getJobShowcase(),
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
          <ScrollReveal>
            <SectionEyebrow index="01">Who I Am</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-[1.15] text-public-black lg:text-5xl">
              {content["intro.philosophy"] ||
                "A Ghanaian graphic designer building visual identities that people actually remember."}
            </h2>
            <p className="mt-6 max-w-xl font-body text-public-black/70">
              {content["intro.difference"] ||
                "Every brief starts with a question: what does this brand look like when it's confident in itself? The answer is never a template."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURED WORK */}
      {featured.length > 0 && (
        <section className="relative border-t border-public-black/10 bg-public-white py-28">
          <span aria-hidden="true" className="absolute left-6 top-0 h-px w-16 bg-public-violet shadow-[0_0_12px_rgba(124,58,237,0.6)] lg:left-10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-12 flex items-end justify-between">
            <ScrollReveal>
              <SectionEyebrow index="02">Selected Work</SectionEyebrow>
              <h2 className="mt-3 font-display text-3xl font-medium text-public-black lg:text-4xl">
                Featured Work
              </h2>
            </ScrollReveal>
            <Link href="/portfolio" className="font-body text-sm text-public-black/60 transition-colors hover:text-public-violet">
              View all →
            </Link>
          </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((project, i) => (
                <ScrollReveal key={project.id} delay={Math.min(i, 4) * 0.08}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES TEASER */}
      {services.length > 0 && (
        <section className="relative border-t border-public-black/10 py-28">
          <span aria-hidden="true" className="absolute left-6 top-0 h-px w-16 bg-public-coral shadow-[0_0_12px_rgba(255,90,54,0.6)] lg:left-10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <ScrollReveal>
              <SectionEyebrow index="03">Capabilities</SectionEyebrow>
              <h2 className="mb-12 mt-3 font-display text-3xl font-medium text-public-black lg:text-4xl">
                What I Do
              </h2>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={Math.min(i, 5) * 0.06}>
                  <Link
                    href={`/start-a-project?service=${service.slug}`}
                    className="glow-card-public group block h-full p-8"
                  >
                    <h3 className="font-display text-lg text-public-black">{service.title}</h3>
                    {service.description && (
                      <p className="mt-2 font-body text-sm text-public-black/60">{service.description}</p>
                    )}
                    <span className="mt-6 inline-block font-body text-sm text-public-violet opacity-0 transition-opacity group-hover:opacity-100">
                      Request this service →
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RECENT REQUESTS — comes before the closing CTA, deliberately far from the hero */}
      <JobShowcase items={jobShowcase} />

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden bg-public-black py-28 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF5A36, transparent 70%)" }}
        />
        <div className="relative">
          <ScrollReveal>
            <h2 className="mx-auto max-w-2xl px-6 font-display text-3xl font-medium text-public-white lg:text-5xl">
              {content["cta.closing_headline"] || "Have an idea worth designing?"}
            </h2>
            <Link
              href="/start-a-project"
              className="mt-8 inline-block rounded-full bg-public-coral px-8 py-3 font-body text-sm font-medium text-public-black shadow-[0_10px_30px_rgba(255,90,54,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(255,90,54,0.55)] motion-reduce:transition-none"
            >
              Fill a Form
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
