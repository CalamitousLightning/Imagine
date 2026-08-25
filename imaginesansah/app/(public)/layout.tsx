import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { FloatingWhatsAppButton } from "@/components/public/floating-whatsapp-button";
import { getSiteSettings, getSiteContent } from "@/lib/queries/public";
import { ThemeScopeProvider } from "@/lib/theme-scope";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(["footer.tagline"]),
  ]);

  return (
    <ThemeScopeProvider className="theme-public bg-public-ivory font-body text-public-black">
      <SiteHeader siteName={settings.site_name} />
      <main>{children}</main>
      <SiteFooter settings={settings} tagline={content["footer.tagline"]} />
      <FloatingWhatsAppButton
        whatsappNumber={settings.whatsapp_number}
        greeting={settings.whatsapp_default_greeting}
      />
    </ThemeScopeProvider>
  );
}
