// app/api/ai-meta/route.js
//
// POST /api/ai-meta
// Generates an SEO meta title + description from article title + content
// Called from the admin article form when user clicks "Generate with AI"

import { NextResponse } from "next/server";
import { generateSEOMeta } from "@/lib/aiMeta";

export async function POST(request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const metaData = await generateSEOMeta(title, content);

    return NextResponse.json(metaData);
  } catch (error) {
    console.error("AI Meta error:", error);
    return NextResponse.json(
      { error: "Failed to generate meta data" },
      { status: 500 }
    );
  }
}
