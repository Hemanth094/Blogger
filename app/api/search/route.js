// app/api/search/route.js
// Live search API — returns matching published articles as JSON

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { metaDescription: { contains: q } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        metaDescription: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ results: articles });
  } catch (error) {
    return NextResponse.json({ results: [] });
  }
}
