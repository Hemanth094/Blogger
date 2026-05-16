// app/api/upload/route.js
//
// Handles image file uploads for article cover images.
// Saves files to /public/uploads/ so they're accessible as /uploads/filename.jpg
//
// WHY PUBLIC FOLDER:
// Next.js serves everything in /public/ as static files automatically.
// So an image saved to /public/uploads/photo.jpg is available at /uploads/photo.jpg

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    // Validate that a file was sent
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type — only allow images
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Check file size — max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    
    // Create the Data URL (e.g. data:image/jpeg;base64,...)
    const url = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload" },
      { status: 500 }
    );
  }
}
