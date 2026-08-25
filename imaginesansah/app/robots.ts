import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://imaginesansah.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the private control room out of search results and crawl paths.
      // This is a courtesy to search engines, not the security boundary —
      // that's the auth check in middleware.ts and (admin)/layout.tsx.
      disallow: ["/control"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
