import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getSiteSettings, mediaUrl } from "@/lib/queries/public";
import { SectionEyebrow } from "@/components/public/section-eyebrow";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About",
  description: "Get to know ImagineSansah — a Ghanaian graphic designer's story, skills, and philosophy.",
};

export default async function AboutPage() {
  const [content, settings] = await Promise.all([
    getSiteContent([
      "about.biography",
      "about.philosophy",
      "about.skills",
      "about.tools",
      "about.experience",
    ]),
    getSiteSettings(),
  ]);

  const supabase = createClient();
  const { data: profileMedia } = settings.profile_media_id
    ? await supabase.from("media").select("*").eq("id", settings.profile_media_id).single()
    : { data: null };
  const profileUrl = mediaUrl(profileMedia as any);

  const hasContent = Object.values(content).some(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
      <SectionEyebrow index="04">The Designer</SectionEyebrow>

      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
        {profileUrl && (
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden bg-public-ivory lg:max-w-none">
            <Image src={profileUrl} alt="ImagineSansah" fill className="object-contain" sizes="280px" priority />
          </div>
        )}

        <div>
          <h1 className="font-display text-4xl font-medium leading-[1.05] text-public-black lg:text-5xl">
            {settings.site_name}
          </h1>

          {!hasContent ? (
            <p className="mt-8 font-body text-public-black/50">
              This page is ready for content — add a biography, skills, and philosophy from Content Control.
            </p>
          ) : (
            <div className="mt-8 space-y-10">
              {content["about.biography"] && (
                <p className="font-body text-lg leading-relaxed text-public-black/80">
                  {content["about.biography"]}
                </p>
              )}

              {content["about.philosophy"] && (
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-public-black/40">
                    Creative Philosophy
                  </p>
                  <p className="mt-2 font-body text-public-black/70">{content["about.philosophy"]}</p>
                </div>
              )}

              <div className="grid gap-8 sm:grid-cols-2">
                {content["about.skills"] && (
                  <div>
                    <p className="font-body text-xs uppercase tracking-wide text-public-black/40">Skills</p>
                    <p className="mt-2 font-body text-public-black/70">{content["about.skills"]}</p>
                  </div>
                )}
                {content["about.tools"] && (
                  <div>
                    <p className="font-body text-xs uppercase tracking-wide text-public-black/40">
                      Software &amp; Tools
                    </p>
                    <p className="mt-2 font-body text-public-black/70">{content["about.tools"]}</p>
                  </div>
                )}
              </div>

              {content["about.experience"] && (
                <div>
                  <p className="font-body text-xs uppercase tracking-wide text-public-black/40">Experience</p>
                  <p className="mt-2 font-body text-public-black/70">{content["about.experience"]}</p>
                </div>
              )}
            </div>
          )}

          <Link
            href="/start-a-project"
            className="mt-10 inline-block rounded-full bg-public-black px-6 py-3 font-body text-sm font-medium text-public-white hover:bg-public-violet"
          >
            Fill a Form
          </Link>
        </div>
      </div>
    </div>
  );
}
