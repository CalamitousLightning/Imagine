import { getSiteContent } from "@/lib/queries/public";
import { CONTENT_FIELDS } from "@/lib/content-keys";
import { ContentControlForm } from "@/components/admin/content-control-form";

export const dynamic = "force-dynamic";

export default async function ContentControlPage() {
  const values = await getSiteContent(CONTENT_FIELDS.map((f) => f.key));

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Content Control</p>
      <h1 className="mt-1 mb-8 font-display text-2xl font-medium text-admin-text">Edit Site Copy</h1>
      <ContentControlForm initialValues={values} />
    </div>
  );
}
