import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ServiceEditorDialog } from "@/components/admin/service-editor-dialog";
import { ServiceRowActions } from "@/components/admin/service-row-actions";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/media";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*, icon:media!services_icon_media_id_fkey(*)")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Services</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">Manage Services</h1>
        </div>
        <ServiceEditorDialog
          trigger={
            <Button className="bg-admin-green text-admin-onPrimary hover:bg-admin-green/90">
              <Plus className="mr-1.5 h-4 w-4" /> New Service
            </Button>
          }
        />
      </div>

      {!services || services.length === 0 ? (
        <div className="rounded-md border border-dashed border-admin-border p-12 text-center">
          <p className="font-mono text-sm text-admin-muted">
            No services yet. Add your first one — it'll appear on the public Services page and the
            homepage teaser once published.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any) => {
            const iconUrl = mediaUrl(service.icon);
            return (
              <div key={service.id} className="rounded-md border border-admin-border bg-admin-panel p-4">
                {iconUrl && (
                  <div className="relative mb-3 aspect-video overflow-hidden rounded bg-admin-bg">
                    <Image src={iconUrl} alt="" fill className="object-cover" sizes="300px" />
                  </div>
                )}
                <p className="font-display text-base text-admin-text">{service.title}</p>
                {service.description && (
                  <p className="mt-1 line-clamp-2 font-body text-sm text-admin-muted">{service.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={
                      service.is_published
                        ? "font-mono text-[11px] text-admin-green"
                        : "font-mono text-[11px] text-admin-amber"
                    }
                  >
                    {service.is_published ? "Published" : "Draft"}
                  </span>
                  <ServiceRowActions service={service} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
