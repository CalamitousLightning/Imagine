import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ImagineSansah — WhatsApp, email, or start a project directly.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const socials = Object.entries(settings.social_links || {});

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-public-violet">Contact</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-public-black lg:text-5xl">
        Let&apos;s talk.
      </h1>
      <p className="mt-4 max-w-lg font-body text-public-black/60">
        The fastest way to reach me is WhatsApp. For anything more detailed, start a project brief instead.
      </p>

      <div className="mt-14 grid gap-x-10 gap-y-8 border-t border-public-black/10 pt-10 sm:grid-cols-2">
        {settings.whatsapp_number && (
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-public-black/40">WhatsApp</p>
            <a
              href={buildWhatsAppUrl(settings.whatsapp_number, settings.whatsapp_default_greeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-display text-xl text-public-black hover:text-public-violet"
            >
              Message on WhatsApp →
            </a>
          </div>
        )}

        {settings.email && (
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-public-black/40">Email</p>
            <a href={`mailto:${settings.email}`} className="mt-1 block font-display text-xl text-public-black hover:text-public-violet">
              {settings.email}
            </a>
          </div>
        )}

        {settings.location && (
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-public-black/40">Location</p>
            <p className="mt-1 font-display text-xl text-public-black">{settings.location}</p>
          </div>
        )}

        {socials.length > 0 && (
          <div>
            <p className="font-body text-xs uppercase tracking-wide text-public-black/40">Elsewhere</p>
            <div className="mt-1 flex flex-col gap-1">
              {socials.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xl capitalize text-public-black hover:text-public-violet"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        href="/start-a-project"
        className="mt-14 inline-block rounded-full bg-public-black px-6 py-3 font-body text-sm font-medium text-public-white hover:bg-public-violet"
      >
        Start a Project
      </Link>
    </div>
  );
}
