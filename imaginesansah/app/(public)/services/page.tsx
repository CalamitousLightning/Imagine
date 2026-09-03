import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedServices } from "@/lib/queries/public";
import { SectionEyebrow } from "@/components/public/section-eyebrow";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "Services",
  description: "Logo & brand identity, flyers, posters, social media design, and more.",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <SectionEyebrow index="02">Capabilities</SectionEyebrow>
      <h1 className="mt-3 font-display text-4xl font-medium text-public-black lg:text-5xl">
        What I Do
      </h1>

      {services.length === 0 ? (
        <p className="mt-16 border-t border-public-black/10 pt-16 font-body text-public-black/50">
          Services will be listed here soon.
        </p>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const iconUrl = mediaUrl(service.icon);
            return (
              <div key={service.id} className="glow-card-public p-7">
                {iconUrl && (
                  <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl bg-public-ivory">
                    <Image src={iconUrl} alt="" fill className="object-contain" sizes="320px" />
                  </div>
                )}
                <h2 className="font-display text-2xl text-public-black">{service.title}</h2>
                {service.description && (
                  <p className="mt-3 font-body text-public-black/60">{service.description}</p>
                )}
                <Link
                  href={`/start-a-project?service=${service.slug}`}
                  className="pill-badge-public pill-badge-public--accent mt-6 inline-flex px-5 py-2.5 text-sm normal-case tracking-normal"
                >
                  Request this service →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
