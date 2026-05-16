// app/admin/articles/new/page.js
//
// CREATE NEW ARTICLE PAGE
// Uses the reusable ArticleForm component.
// "use client" because ArticleForm has state and event handlers.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default function NewArticlePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create article. Please try again.");
        return;
      }

      // Success! Go back to dashboard
      router.push("/admin");
      router.refresh(); // Refresh server cache
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Create New Article</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below. SEO fields help your article rank on Google.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
