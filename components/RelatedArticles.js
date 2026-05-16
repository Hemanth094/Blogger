import Link from "next/link";
import Image from "next/image";
import { getReadingTime } from "@/lib/readingTime";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RelatedArticles({ articles, currentSlug, currentTitle, currentCategory }) {
  // ── Smart Recommendation Logic ──────────────────────────────
  // We prioritize articles from the same category, then keyword matches
  const stopWords = new Set(["the", "and", "for", "with", "from", "that", "this", "your", "what", "where", "when", "about"]);
  const currentWords = currentTitle
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .map(article => {
      let score = 0;
      
      // 1. Category Match (High Priority)
      if (article.category === currentCategory) {
        score += 10;
      }

      // 2. Keyword Match
      const titleWords = article.title.toLowerCase().split(/\s+/);
      currentWords.forEach(word => {
        if (titleWords.some(tw => tw.includes(word))) score += 2;
      });

      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (related.length === 0) {
    return (
      <section className="mt-20 py-12 border-t border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
        <div className="bg-slate-50 rounded-2xl p-10 text-center">
          <p className="text-slate-500 font-medium">No related articles found. Explore our latest stories instead!</p>
          <Link href="/" className="mt-4 inline-block text-violet-600 font-bold hover:underline">View Homepage</Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Related articles" className="mt-20 border-t border-slate-100 pt-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Related Articles</h2>
        <div className="hidden sm:block h-px flex-1 bg-slate-100 mx-8"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {related.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500"
          >
            {/* Thumbnail */}
            <Link href={`/articles/${article.slug}`} className="relative h-52 overflow-hidden bg-slate-100">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-violet-50 to-indigo-50 opacity-40">
                  📄
                </div>
              )}
              {/* Category Badge (Dynamic) */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-violet-600 uppercase tracking-widest rounded-full shadow-sm">
                  {article.category || "STORY"}
                </span>
              </div>
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                <span>•</span>
                <span>{getReadingTime(article.content)}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors leading-snug line-clamp-2">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h3>

              <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                {article.metaDescription || article.content.replace(/<[^>]*>/g, "").substring(0, 120) + "..."}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-50">
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 group/btn"
                >
                  Read Full Article
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="group-hover/btn:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
