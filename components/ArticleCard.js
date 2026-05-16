// components/ArticleCard.js
//
// A reusable card component shown on the homepage.
// Displays: cover image, title, date, reading time, meta description snippet.
//
// "use client" is NOT needed here — this is a Server Component (faster)
// because it receives data as props and has no interactivity.

import Image from "next/image";
import Link from "next/link";
import { getReadingTime } from "@/lib/readingTime";

// Format a date nicely: "January 14, 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleCard({ article }) {
  const readingTime = getReadingTime(article.content);

  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)] transition-all duration-500 border border-slate-100 flex flex-col h-full hover:-translate-y-2">
      
      {/* Cover Image */}
      <Link href={`/articles/${article.slug}`} className="block overflow-hidden relative">
        <div className="relative h-56 w-full bg-slate-50">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              loading="lazy"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
              <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">✍️</span>
            </div>
          )}
          
          {/* Category/Badge Overlays if needed */}
          <div className="absolute top-4 left-4">
             <div className="glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-700 shadow-sm">
                Article
             </div>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-7 flex flex-col flex-1">
        {/* Meta info row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <time dateTime={article.createdAt}>
              {formatDate(article.createdAt)}
            </time>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {readingTime}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Description */}
        {article.metaDescription && (
          <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-1">
            {article.metaDescription}
          </p>
        )}

        {/* Action button */}
        <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
          <Link
            href={`/articles/${article.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 group/link transition-all"
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
          
          <div className="flex -space-x-2">
             <div className="w-7 h-7 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600">B</div>
          </div>
        </div>
      </div>
    </article>
  );
}
