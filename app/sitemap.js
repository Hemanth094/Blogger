// app/sitemap.js
//
// Generates /sitemap.xml automatically
//
// WHAT IS A SITEMAP?
// A sitemap tells search engines (Google, Bing) about ALL pages on your site.
// Without it, Google might miss some of your articles.
// With it, your new articles get indexed faster.
//
// Next.js has built-in sitemap support — just export a default function
// that returns an array of URLs and Next.js handles the XML formatting.
//
// TEST: Visit http://localhost:3000/sitemap.xml

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch all published articles
  let articles = [];
  try {
    articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.warn('Failed to fetch articles for sitemap (expected during Vercel build):', error.message);
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",  // Homepage changes often
      priority: 1.0,              // Highest priority
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
