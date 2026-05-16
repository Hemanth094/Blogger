// components/ArticleForm.js
//
// Reusable form component used for both creating and editing articles.
// "use client" because it has state, event handlers, and form logic.
//
// Props:
//   - initialData: existing article data (for edit mode), null for new
//   - onSubmit: async function called with form data
//   - isLoading: show loading spinner while saving

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { slugify } from "@/lib/slugify";

export default function ArticleForm({ initialData = null, onSubmit, isLoading = false }) {
  // Form field state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [category, setCategory] = useState(initialData?.category || "General");

  // UI state
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingMeta, setGeneratingMeta] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  // Auto-generate slug when title changes (unless user manually edited it)
  useEffect(() => {
    if (!slugManuallyEdited && title && !initialData) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited, initialData]);

  // Manual slug regeneration
  function handleRegenerateSlug() {
    if (!title) return;
    const newSlug = slugify(title);
    setSlug(newSlug);
    setSlugManuallyEdited(true);
  }

  // ── Smart Category Auto-Detection ──────────────────
  useEffect(() => {
    if (!title.trim()) return;
    
    const lowerTitle = title.toLowerCase();
    const mapping = {
      Technology: ["ai", "tech", "digital", "cyber", "internet", "data", "software", "code", "virtual", "robot"],
      Travel: ["travel", "trip", "journey", "explore", "adventure", "destination", "train", "flight", "map", "tour"],
      Food: ["food", "recipe", "cook", "dish", "restaurant", "taste", "eat", "chef"],
      Health: ["health", "fitness", "medical", "wellness", "doctor", "workout", "mind", "body"],
      Business: ["business", "money", "finance", "startup", "economy", "market", "work", "job", "career"],
      Lifestyle: ["life", "home", "style", "habit", "routine", "daily", "mindful", "happy"]
    };

    for (const [cat, keywords] of Object.entries(mapping)) {
      if (keywords.some(word => lowerTitle.includes(word))) {
        setCategory(cat);
        break;
      }
    }
  }, [title]);

  // ── Validation ────────────────────────────────
  function validate() {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (metaTitle && metaTitle.length > 60)
      newErrors.metaTitle = "Meta title should be under 60 characters";
    if (metaDescription && metaDescription.length > 160)
      newErrors.metaDescription = "Meta description should be under 160 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = valid
  }

  // ── Image Upload with Compression ──────────────────
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (still good to have a limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large (max 10MB)");
      return;
    }

    setUploading(true);

    try {
      // 1. Create a promise-based image resizer
      const compressedFile = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Max dimensions
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 800;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  // Keep the original filename
                  const newFile = new File([blob], file.name, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(newFile);
                } else {
                  reject(new Error("Canvas blob creation failed"));
                }
              },
              "image/jpeg",
              0.7 // 70% quality
            );
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
      });

      // 2. Upload the compressed file
      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.url) {
        setImage(data.url);
        setImagePreview(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Compression/Upload error:", err);
      alert("Failed to process image. Please try a different one.");
    } finally {
      setUploading(false);
    }
  }

  // ── AI SEO Meta Generation ───────────────────
  async function handleGenerateMeta() {
    if (!title || !content) {
      alert("Please fill in title and content first.");
      return;
    }
    setGeneratingMeta(true);
    try {
      const cleanContent = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      
      const res = await fetch("/api/ai-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: cleanContent }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Server error occurred");
      }
      
      if (data.metaTitle) setMetaTitle(data.metaTitle);
      if (data.metaDescription) setMetaDescription(data.metaDescription);
      
      if (data.warning) {
        console.warn("AI Warning:", data.warning);
      }
      
    } catch (err) {
      console.error("AI Generation Error:", err);
      alert(`Could not connect to AI: ${err.message}.`);
    } finally {
      setGeneratingMeta(false);
    }
  }

  // ── Smart Auto-Format ────────────────────────
  function handleAutoFormat() {
    if (!content.trim()) return;

    // 1. Detect if content is already formatted HTML
    const hasHTML = /<p|<h\d|<ul|<ol|<li/i.test(content);

    if (hasHTML) {
      const cleaned = content
        .replace(/<p>\s*<\/p>/gi, "")
        .replace(/<h\d>\s*<\/h\d>/gi, "")
        .replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />")
        .trim();
      setContent(cleaned);
      return;
    }

    // 2. Perform Intelligent Block-Based Smart Format
    const blocks = content.split(/\r?\n\s*\r?\n/);
    let formatted = [];

    blocks.forEach((block) => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l);
      if (lines.length === 0) return;

      const isBullet = lines.every(l => /^[-*•]\s+/.test(l));
      const isNumbered = lines.every(l => /^\d+[.)]\s+/.test(l));
      // Detect Implicit List: multiple short lines without punctuation
      const isImplicitList = lines.length > 1 && lines.every(l => l.length < 55 && !/[.?!]$/.test(l));

      if (isBullet || isImplicitList) {
        formatted.push("<ul>\n" + lines.map(l => `  <li>${l.replace(/^[-*•]\s+/, "")}</li>`).join("\n") + "\n</ul>");
      } 
      else if (isNumbered) {
        formatted.push("<ol>\n" + lines.map(l => `  <li>${l.replace(/^\d+[.)]\s+/, "")}</li>`).join("\n") + "\n</ol>");
      } 
      // Detect Heading (Single line, short, capitalized, no trailing punctuation)
      else if (lines.length === 1 && lines[0].length < 60 && /^[A-Z]/.test(lines[0]) && !/[.?!]$/.test(lines[0])) {
        const tag = lines[0].length < 35 ? "h2" : "h3";
        formatted.push(`<${tag}>${lines[0]}</${tag}>`);
      } 
      else {
        const processedLines = lines.map(line => {
          const match = line.match(/^([^:—]{2,35})[:—]\s+(.*)/);
          if (match) {
            return `<strong>${match[1].trim()}:</strong> ${match[2]}`;
          }
          return line;
        });
        formatted.push(`<p>${processedLines.join(" ")}</p>`);
      }
    });

    setContent(formatted.join("\n\n"));
  }

  // ── Form Submit ───────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      slug,
      content: content.trim(),
      image: image || null,
      metaTitle: metaTitle.trim() || `${title.trim().substring(0, 50)} | BLOGGER`,
      metaDescription: metaDescription.trim() || `Read the full story about ${title.trim()} and discover more insightful articles.`,
      published,
      category,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      
      {/* ── Title ─────────────────────────────── */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
          Article Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a compelling title..."
          className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
            errors.title ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* ── Slug (auto-generated but editable) ── */}
      <div>
        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1">
          URL Slug{" "}
          <span className="font-normal text-gray-400">(auto-generated from title)</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-sm text-gray-400 font-mono pointer-events-none z-10">/articles/</span>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
            }}
            className="w-full pl-[90px] pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm font-mono transition-all"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          This will be the URL: <code className="bg-gray-100 px-1 rounded">/articles/{slug}</code>
        </p>
      </div>

      {/* ── Content ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleAutoFormat}
            className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition font-bold"
            title="Convert plain text to structured HTML"
          >
            🪄 Smart Format
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          Paste your text then click "Smart Format" to automatically add headings and paragraphs.
        </p>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content here..."
          rows={16}
          className={`w-full px-4 py-3 rounded-xl border font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-y ${
            errors.content ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
        />
        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
      </div>

      {/* ── Cover Image Upload ────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Cover Image <span className="font-normal text-gray-400">(optional)</span>
        </label>

        <div className="flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className={`cursor-pointer px-5 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition ${
              uploading
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-violet-300 text-violet-600 hover:border-violet-500 hover:bg-violet-50"
            }`}
          >
            {uploading ? "Uploading..." : "📁 Choose Image"}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => { setImage(""); setImagePreview(""); }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              ✕ Remove
            </button>
          )}
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-3 relative h-40 w-64 rounded-xl overflow-hidden border border-gray-200">
            <Image src={imagePreview} alt="Preview" fill priority className="object-cover" />
          </div>
        )}

        <div className="mt-3">
          <input
            type="url"
            value={image}
            onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); }}
            placeholder="Or paste an image URL..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* ── SEO Fields ────────────────────────── */}
      <div className="bg-violet-50 rounded-2xl p-6 space-y-5 border border-violet-100">
        <h3 className="text-base font-bold text-violet-900">🔍 SEO Settings</h3>
        <p className="text-xs text-violet-600">
          These fields control how your article appears in Google search results.
        </p>

        {/* Meta Title */}
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-semibold text-gray-700 mb-1">
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || "SEO title (defaults to article title)"}
            maxLength={60}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${
              errors.metaTitle ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.metaTitle ? (
              <p className="text-xs text-red-500">{errors.metaTitle}</p>
            ) : (
              <p className="text-xs text-gray-400">Recommended: under 60 characters</p>
            )}
            <span className={`text-xs ${metaTitle.length > 55 ? "text-orange-500" : "text-gray-400"}`}>
              {metaTitle.length}/60
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="metaDescription" className="block text-sm font-semibold text-gray-700">
              Meta Description
            </label>
            <button
              type="button"
              onClick={handleGenerateMeta}
              disabled={generatingMeta}
              className="text-xs px-3 py-1 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition disabled:opacity-50"
            >
              {generatingMeta ? "Generating..." : "✨ Generate with AI"}
            </button>
          </div>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Brief summary that appears in Google search results..."
            maxLength={160}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none ${
              errors.metaDescription ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.metaDescription ? (
              <p className="text-xs text-red-500">{errors.metaDescription}</p>
            ) : (
              <p className="text-xs text-gray-400">Recommended: under 160 characters</p>
            )}
            <span className={`text-xs ${metaDescription.length > 150 ? "text-orange-500" : "text-gray-400"}`}>
              {metaDescription.length}/160
            </span>
          </div>
        </div>
      </div>

      {/* ── Publish Toggle ─────────────────────── */}
      <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <p className="font-semibold text-gray-800">Publish Article</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {published
              ? "Visible on public website"
              : "Draft — only visible in admin panel"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPublished(!published)}
          className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            published ? "bg-violet-600" : "bg-gray-300"
          }`}
          aria-checked={published}
          role="switch"
          aria-label="Toggle publish"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
              published ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* ── Submit Button ─────────────────────── */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3.5 px-6 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              Saving...
            </span>
          ) : (
            initialData ? "Save Changes" : " Create Article"
          )}
        </button>
      </div>
    </form>
  );
}
