// app/rss/route.js
//
// Generates an RSS feed at /rss
//
// WHAT IS RSS?
// RSS (Really Simple Syndication) is an XML format that lets readers
// subscribe to your blog using apps like Feedly, Inoreader, etc.
// Search engines also use RSS to discover new content faster.
//
// HOW TO TEST:
// Visit http://localhost:3000/rss in your browser — you'll see XML

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Get the latest 20 published articles
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        title: true,
        slug: true,
        metaDescription: true,
        content: true,
        createdAt: true,
      },
    });

    // Build the RSS XML string
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BLOGGER</title>
    <link>${baseUrl}</link>
    <description>The latest articles from BLOGGER</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml"/>
    ${articles
      .map((article) => {
        // Strip HTML for the description
        const description =
          article.metaDescription ||
          article.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/articles/${article.slug}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    // Return XML response with correct content-type header
    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache for 1 hour
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("RSS feed error:", error);
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 });
  }
}
