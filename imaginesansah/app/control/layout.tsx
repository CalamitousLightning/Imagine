import type { Metadata } from "next";

// Never index the admin area, and never let it appear as a normal page.
// This wraps BOTH /control/login and every authenticated section — the
// auth check itself lives one level deeper in (admin)/layout.tsx so the
// login page isn't blocked by its own gate.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Control",
};

export default function ControlRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
