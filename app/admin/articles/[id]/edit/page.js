// app/admin/articles/[id]/edit/page.js
//
// EDIT ARTICLE PAGE
// Loads existing article data from the API, pre-fills the form.
// "use client" for state and event handling.

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load the article data when page opens
  useEffect(() => {
    if (!id) return;
    fetchArticle();
  }, [id]);

  async function fetchArticle() {
    try {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) {
        setError("Article not found.");
        return;
      }
      const data = await res.json();
      setArticle(data.article);
    } catch {
      setError("Failed to load article. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update article.");
        return;
      }

      // Success!
      router.push("/admin");
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  //  Loading state 
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state 
  if (error) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">{error}</h2>
        <a href="/admin" className="text-violet-600 hover:underline">
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Edit Article</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">
          Editing: <span className="text-violet-600">{article?.title}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <ArticleForm
          initialData={article}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
