import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedServices } from "@/lib/queries/public";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "Services",
  description: "Logo & brand identity, flyers, posters, social media design, and more.",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">Services</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-public-black lg:text-5xl">
        What I Do
      </h1>

      {services.length === 0 ? (
        <p className="mt-16 border-t border-public-black/10 pt-16 font-body text-public-black/50">
          Services will be listed here soon.
        </p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2">
          {services.map((service) => {
            const iconUrl = mediaUrl(service.icon);
            return (
              <div key={service.id} className="border-t border-public-black/10 pt-8">
                {iconUrl && (
                  <div className="relative mb-5 aspect-video w-full max-w-xs overflow-hidden">
                    <Image src={iconUrl} alt="" fill className="object-cover" sizes="320px" />
                  </div>
                )}
                <h2 className="font-display text-2xl text-public-black">{service.title}</h2>
                {service.description && (
                  <p className="mt-3 font-body text-public-black/60">{service.description}</p>
                )}
                <Link
                  href={`/start-a-project?service=${service.slug}`}
                  className="mt-5 inline-block font-body text-sm font-medium text-public-violet hover:underline"
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
