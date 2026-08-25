import { getMediaLibrary } from "@/lib/queries/admin";
import { MediaLibraryGrid } from "@/components/admin/media-library-grid";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: { bucket?: string };
}) {
  const activeBucket = searchParams.bucket ?? "all";
  const items = await getMediaLibrary(activeBucket);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-admin-muted">Media Library</p>
        <h1 className="mt-1 font-display text-2xl font-medium text-admin-text">All Uploads</h1>
        <p className="mt-1 font-mono text-xs text-admin-muted">
          Files upload automatically wherever you use them (portfolio, hero, services, settings) — this
          is just a searchable view of everything you've uploaded, for reuse and cleanup.
        </p>
      </div>
      <MediaLibraryGrid items={items} activeBucket={activeBucket} />
    </div>
  );
}
