// app/admin/page.js
//
// ADMIN DASHBOARD — Lists all articles (published and drafts)
// Admin can: view, edit, delete, toggle publish status
//
// "use client" because we need:
//   - State (for article list after delete)
//   - Event handlers (delete button, publish toggle)
//   - fetch() calls to the API

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Load articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Delete Article ──────────────────────────
  async function handleDelete(id, title) {
    // Confirm before deleting (can't undo!)
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from state immediately (no refetch needed)
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete article.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  // ── Toggle Publish ──────────────────────────
  async function handleTogglePublish(article) {
    setTogglingId(article.id);
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...article, published: !article.published }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update the article in state
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? data.article : a))
        );
      } else {
        alert("Failed to update publish status.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }

  const published = articles.filter((a) => a.published);
  const drafts = articles.filter((a) => !a.published);

  return (
    <div className="animate-fadeIn">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your publication and track performance
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-violet-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          Create New Article
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Articles", value: articles.length, icon: "📝", bg: "bg-violet-50", text: "text-violet-600" },
          { label: "Published", value: published.length, icon: "✨", bg: "bg-emerald-50", text: "text-emerald-600" },
          { label: "Drafts", value: drafts.length, icon: "✍️", bg: "bg-amber-50", text: "text-amber-600" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-slideUpFade`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Articles Table Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden animate-slideUpFade" style={{ animationDelay: '0.3s' }}>
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-bold text-slate-800">Recent Content</h3>
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{articles.length} total entries</div>
        </div>
        
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-6 font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing Database...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="text-7xl mb-8">📭</div>
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Your library is empty</h2>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto">Start your journey by creating your first SEO-optimized article today.</p>
            <Link
              href="/admin/articles/new"
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Article Information</th>
                  <th className="px-8 py-5 hidden md:table-cell">Creation Date</th>
                  <th className="px-8 py-5">Visibility</th>
                  <th className="px-8 py-5 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((article) => (
                  <tr key={article.id} className="group hover:bg-slate-50/50 transition-all">
                    {/* Title & Slug */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-lg group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                          📄
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                            {article.title}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider font-mono bg-slate-100 px-2 py-0.5 rounded w-fit">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-8 py-6 text-slate-500 font-medium hidden md:table-cell">
                      {formatDate(article.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        disabled={togglingId === article.id}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          article.published
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100"
                        } disabled:opacity-50`}
                      >
                        {togglingId === article.id ? (
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : article.published ? (
                          <><span>●</span> Published</>
                        ) : (
                          <><span>○</span> Draft</>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-2.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                          title="Edit Article"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                          title="Delete Article"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
