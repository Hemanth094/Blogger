// app/api/articles/[id]/route.js
//
// This handles operations on a SINGLE article by its ID:
//   GET    /api/articles/5  → Get one article
//   PUT    /api/articles/5  → Update article
//   DELETE /api/articles/5  → Delete article
//
// The [id] in the folder name is a dynamic segment — Next.js passes it as params.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, makeUniqueSlug } from "@/lib/slugify";

// ─────────────────────────────────────────────
// GET /api/articles/[id]
// Get a single article by ID
// ─────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: `Failed to fetch article: ${error.message}` },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/articles/[id]
// Update an existing article
// ─────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const { title, content, image, metaTitle, metaDescription, published, category } = body;

    // Check article exists
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // If title changed, regenerate slug
    let slug = existing.slug;
    if (title.trim() !== existing.title) {
      const baseSlug = slugify(title);
      slug = await makeUniqueSlug(baseSlug, async (s) => {
        const found = await prisma.article.findUnique({ where: { slug: s } });
        return !!found && found.id !== id; // Don't conflict with self
      });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title.trim().substring(0, 255),
        slug: slug.substring(0, 255),
        content: content.trim(),
        image: image || null,
        metaTitle: (metaTitle?.trim() || title.trim()).substring(0, 60),
        metaDescription: metaDescription?.trim()?.substring(0, 160) || null,
        published: published ?? existing.published,
        category: category || existing.category || "General",
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: `Failed to update article: ${error.message}` },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/articles/[id]
// Delete an article permanently
// ─────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: `Failed to delete article: ${error.message}` },
      { status: 500 }
    );
  }
}
