import type { Metadata } from "next";
import { getPublishedServices, getSiteSettings } from "@/lib/queries/public";
import { StartAProjectForm } from "@/components/public/start-a-project-form";

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Tell ImagineSansah about your project — brand identity, flyers, social media, and more.",
};

export default async function StartAProjectPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const [services, settings] = await Promise.all([getPublishedServices(), getSiteSettings()]);
  const preselected = services.find((s) => s.slug === searchParams.service);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 lg:px-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">Start a Project</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-public-black lg:text-5xl">
        Let&apos;s build something.
      </h1>
      <p className="mt-4 font-body text-public-black/60">
        Fill this in with as much detail as you can — it helps me scope things properly before we talk.
      </p>

      <div className="mt-12">
        <StartAProjectForm
          services={services}
          preselectedServiceId={preselected?.id}
          whatsappNumber={settings.whatsapp_number}
          whatsappTemplate={settings.whatsapp_project_message_template}
        />
      </div>
    </div>
  );
}
