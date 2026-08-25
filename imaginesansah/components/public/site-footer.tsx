import Link from "next/link";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings, tagline }: { settings: SiteSettings; tagline?: string }) {
  const year = new Date().getFullYear();
  const socials = Object.entries(settings.social_links || {});

  return (
    <footer className="relative border-t border-public-black/10 bg-public-black text-public-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">{settings.site_name}</p>
            <p className="mt-3 max-w-xs font-body text-sm text-public-white/60">
              {tagline || "Bold, memorable, meaningful visual identities — for brands ready to look like themselves."}
            </p>
          </div>

          <div>
            <p className="font-body text-xs uppercase tracking-widest text-public-white/40">Contact</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-public-white/80">
              {settings.email && <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
              {settings.location && <li>{settings.location}</li>}
              <li><Link href="/start-a-project">Start a Project →</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-body text-xs uppercase tracking-widest text-public-white/40">Elsewhere</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-public-white/80">
              {socials.map(([platform, url]) => (
                <li key={platform}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-public-coral">
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 space-y-1">
          <p className="font-body text-xs text-public-white/40">
            © {year} {settings.site_name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-public-white/40">By Evoxera Technology</p>
        </div>
      </div>

      {/* Quiet mark of origin — three Ghana-flag hues, low-opacity, unlabeled. */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 flex h-[3px] w-10 opacity-40"
        aria-hidden="true"
      >
        <span className="h-full flex-1" style={{ backgroundColor: "#CE1126" }} />
        <span className="h-full flex-1" style={{ backgroundColor: "#FCD116" }} />
        <span className="h-full flex-1" style={{ backgroundColor: "#006B3F" }} />
      </div>
    </footer>
  );
}
