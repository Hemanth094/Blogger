// app/api/articles/route.js
//
// This file handles two HTTP methods:
//   GET  /api/articles  → Fetch all articles
//   POST /api/articles  → Create a new article
//
// In Next.js App Router, each HTTP method is a named export function.

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify, makeUniqueSlug } from "@/lib/slugify";
import { getReadingTime } from "@/lib/readingTime";

// ─────────────────────────────────────────────
// GET /api/articles
// Returns all articles (admin sees all, including unpublished)
// ─────────────────────────────────────────────
export async function GET(request) {
  try {
    // Read query params: ?published=true or ?search=keyword
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    const search = searchParams.get("search") || "";

    const articles = await prisma.article.findMany({
      where: {
        // If publishedOnly flag is set, only return published articles
        ...(publishedOnly ? { published: true } : {}),
        // If search term provided, search in title and content
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { content: { contains: search } },
                { metaDescription: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" }, // Newest first
      take: 100, // Limit results to prevent memory overload on large databases
      // Only select the fields we need for listing (not full content)
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        metaDescription: true,
        published: true,
        category: true,
        createdAt: true,
        content: true, // Needed for reading time calculation
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { error: `Failed to fetch articles: ${error.message}` },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/articles
// Creates a new article
// ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, image, metaTitle, metaDescription, published, category } = body;

    // ── Validation ──
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // ── Auto-generate slug from title ──
    const baseSlug = slugify(title);
    const slug = await makeUniqueSlug(baseSlug, async (s) => {
      const existing = await prisma.article.findUnique({ where: { slug: s } });
      return !!existing; // Returns true if slug already exists
    });

    const readingTime = getReadingTime(content);

    // ── Create in database ──
    const article = await prisma.article.create({
      data: {
        title: title.trim().substring(0, 255),
        slug: slug.substring(0, 255),
        content: content.trim(),
        image: image || null,
        metaTitle: (metaTitle?.trim() || title.trim()).substring(0, 60),
        metaDescription: metaDescription?.trim()?.substring(0, 160) || null,
        published: published ?? false,
        category: category || "General",
        readingTime,
      },
    });

    // Purge cache for home page
    revalidatePath("/");

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { error: `Failed to create article: ${error.message}` },
      { status: 500 }
    );
  }
}
