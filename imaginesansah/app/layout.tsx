import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display face: editorial serif with real character — carries the public site's personality.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Body face: clean, quiet, gets out of the way.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

// Admin utility face: technical, monospace — signals "control room" without hacker clichés.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "ImagineSansah — Graphic Designer",
    template: "%s — ImagineSansah",
  },
  description:
    "ImagineSansah is a creative graphic designer crafting bold, memorable and meaningful visual identities.",
};

// Explicit rather than relying on Next's default — guarantees every device
// renders at its real CSS pixel width (no forced desktop-width shrinking)
// and respects the notch/home-indicator safe areas on iOS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Applies any saved light/dark + accent choice to <html> before the
            first paint, so returning visitors never see a flash of the
            wrong theme. Public and admin preferences are independent — see
            lib/theme-scope.tsx for the matching client-side logic. */}
        <Script id="theme-preload" strategy="beforeInteractive">
          {`(function(){try{
            var s=window.localStorage,h=document.documentElement;
            ["public","admin"].forEach(function(surface){
              var m=s.getItem("imaginesansah:"+surface+":mode");
              var a=s.getItem("imaginesansah:"+surface+":accent");
              if(m)h.setAttribute("data-"+surface+"-mode",m);
              if(a)h.setAttribute("data-"+surface+"-accent",a);
            });
          }catch(e){}})();`}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
