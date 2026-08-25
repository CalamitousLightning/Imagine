import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { GhanaSignature } from "@/components/admin/ghana-signature";
import { getCurrentAdmin } from "@/lib/supabase/get-admin";

export default async function ControlLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already blocked non-admins from reaching
  // here, but this Server Component re-verifies before rendering anything.
  const admin = await getCurrentAdmin();

  return (
    <div className="theme-admin admin-scope flex min-h-screen bg-admin-bg font-body text-admin-text">
      <AdminSidebar adminName={admin.full_name} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
      <GhanaSignature />
    </div>
  );
}
