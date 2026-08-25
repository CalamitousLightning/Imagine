"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadSlot } from "@/components/admin/image-upload-slot";
import { saveSiteSettings, type SiteSettingsInput } from "@/lib/actions/settings";
import type { Media, SiteSettings } from "@/types/domain";

interface SiteSettingsFormProps {
  settings: SiteSettings & { logo?: Media | null; profile?: Media | null; og_image?: Media | null };
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [siteName, setSiteName] = useState(settings.site_name);
  const [logo, setLogo] = useState<Media | null>(settings.logo ?? null);
  const [profile, setProfile] = useState<Media | null>(settings.profile ?? null);
  const [email, setEmail] = useState(settings.email ?? "");
  const [location, setLocation] = useState(settings.location ?? "");
  const [socialLinks, setSocialLinks] = useState<[string, string][]>(
    Object.entries(settings.social_links || {})
  );

  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number ?? "");
  const [greeting, setGreeting] = useState(settings.whatsapp_default_greeting);
  const [template, setTemplate] = useState(settings.whatsapp_project_message_template);

  const [seoTitle, setSeoTitle] = useState(settings.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(settings.seo_description ?? "");
  const [ogImage, setOgImage] = useState<Media | null>(settings.og_image ?? null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const input: SiteSettingsInput = {
      site_name: siteName,
      logo_media_id: logo?.id ?? null,
      profile_media_id: profile?.id ?? null,
      email,
      whatsapp_number: whatsappNumber,
      whatsapp_default_greeting: greeting,
      whatsapp_project_message_template: template,
      location,
      social_links: Object.fromEntries(socialLinks.filter(([k]) => k.trim())),
      seo_title: seoTitle,
      seo_description: seoDescription,
      og_image_media_id: ogImage?.id ?? null,
    };

    startTransition(async () => {
      const result = await saveSiteSettings(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && <p className="mb-4 font-mono text-xs text-red-400">{error}</p>}

      <Tabs defaultValue="site">
        <TabsList className="bg-admin-panel">
          <TabsTrigger value="site">Site</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-6 pt-6">
          <div>
            <Label htmlFor="site_name" className="text-admin-text">Website Name</Label>
            <Input id="site_name" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploadSlot label="Logo" bucket="site-assets" value={logo} onChange={setLogo} aspect="aspect-video" />
            <ImageUploadSlot label="Profile Image" bucket="profile" value={profile} onChange={setProfile} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="email" className="text-admin-text">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
            </div>
            <div>
              <Label htmlFor="location" className="text-admin-text">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kumasi, Ghana" className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
            </div>
          </div>

          <div>
            <Label className="text-admin-text">Social Links</Label>
            <div className="mt-1.5 space-y-2">
              {socialLinks.map(([platform, url], i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={platform}
                    onChange={(e) => {
                      const next = [...socialLinks];
                      next[i] = [e.target.value, next[i][1]];
                      setSocialLinks(next);
                    }}
                    placeholder="instagram"
                    className="w-32 border-admin-border bg-admin-bg text-admin-text"
                  />
                  <Input
                    value={url}
                    onChange={(e) => {
                      const next = [...socialLinks];
                      next[i] = [next[i][0], e.target.value];
                      setSocialLinks(next);
                    }}
                    placeholder="https://instagram.com/..."
                    className="flex-1 border-admin-border bg-admin-bg text-admin-text"
                  />
                  <button
                    type="button"
                    onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))}
                    aria-label="Remove social link"
                    className="text-admin-muted hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSocialLinks([...socialLinks, ["", ""]])}
                className="flex items-center gap-1.5 font-mono text-xs text-admin-cyan"
              >
                <Plus className="h-3.5 w-3.5" /> Add social link
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6 pt-6">
          <div>
            <Label htmlFor="whatsapp_number" className="text-admin-text">WhatsApp Number</Label>
            <Input
              id="whatsapp_number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="233XXXXXXXXX"
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
            <p className="mt-1 font-mono text-[11px] text-admin-muted">
              Used everywhere on the site — the floating button, contact page, and every project CTA.
            </p>
          </div>
          <div>
            <Label htmlFor="greeting" className="text-admin-text">Default Greeting</Label>
            <Input id="greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
          </div>
          <div>
            <Label htmlFor="template" className="text-admin-text">Project Request Message Template</Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={3}
              className="mt-1.5 border-admin-border bg-admin-bg text-admin-text"
            />
            <p className="mt-1 font-mono text-[11px] text-admin-muted">
              Use {"{name}"}, {"{project_type}"}, and {"{budget}"} as placeholders.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 pt-6">
          <div>
            <Label htmlFor="seo_title" className="text-admin-text">SEO Title</Label>
            <Input id="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
          </div>
          <div>
            <Label htmlFor="seo_description" className="text-admin-text">SEO Description</Label>
            <Textarea id="seo_description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className="mt-1.5 border-admin-border bg-admin-bg text-admin-text" />
          </div>
          <ImageUploadSlot label="Open Graph Image" bucket="site-assets" value={ogImage} onChange={setOgImage} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center gap-3">
        <Button type="submit" disabled={pending} className="bg-admin-green text-admin-bg hover:bg-admin-green/90">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-admin-green">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
