import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CurrentAdmin {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

/**
 * Middleware already blocks unauthenticated/non-admin users from reaching
 * /control/*, but every admin Server Component re-checks so a page never
 * renders without a valid admin row — defense in depth, and it hands back
 * the admin's own data for the UI (e.g. "Welcome back, X").
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/control/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/control/login?error=not_authorized");

  return { user_id: admin.user_id, full_name: admin.full_name, email: user.email ?? null };
}
