// app/robots.js
//
// Generates /robots.txt automatically
//
// WHAT IS ROBOTS.TXT?
// It's a file that tells search engine crawlers (bots) what they're
// allowed and not allowed to index.
//
// Rules:
//   User-agent: * → applies to ALL crawlers (Google, Bing, etc.)
//   Allow: /       → allow crawling everything
//   Disallow: /admin → don't index the admin panel (private!)
//   Sitemap:        → point crawlers to your sitemap
//
// TEST: Visit http://localhost:3000/robots.txt

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",         // Apply to all crawlers
        allow: "/",             // Allow the whole site
        disallow: [
          "/admin",             // Don't index admin panel
          "/api/",              // Don't index API routes
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,  // Tell crawlers where the sitemap is
    host: baseUrl,
  };
}
