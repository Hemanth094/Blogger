// app/page.js
//
// HOMEPAGE — The public-facing home page of BLOGGER
//
// This is a Server Component — it runs on the server, fetches data from
// the database, and sends finished HTML to the browser.
//
// WHY SERVER COMPONENT FOR HOMEPAGE?
// - Faster: Browser gets pre-rendered HTML, no loading spinner
// - Better SEO: Google can read the content immediately
// - Secure: Database credentials stay on the server

import prisma from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";

// Fetch all PUBLISHED articles (server-side)
async function getPublishedArticles() {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        metaDescription: true,
        createdAt: true,
        content: true,  // Needed for reading time
      },
    });
  } catch (error) {
    // During build, database may not be available. Return empty array.
    console.warn('Failed to fetch articles (expected during build):', error.message);
    return [];
  }
}

export const revalidate = 3600; // ISR: revalidate every hour
export const dynamic = 'force-dynamic'; // Skip static generation, render on demand

export default async function HomePage() {
  const articles = await getPublishedArticles();

  return (
    <>
    <div className="bg-white">
      {/* ── Hero Section ────────────────────────── */}
      <section
        className="relative z-20 bg-[#0f172a] text-white pt-16 pb-24"
        aria-label="Hero"
      >
        {/* Animated gradients in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center animate-slideUpFade">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10 text-violet-300">
            <span>✨</span>
            <span>Publishing Platform</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] mb-8 tracking-tighter">
            Share Your <span className="text-gradient">Vision</span>
            <br />
            With The World.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Discover a clean, minimal space for thoughtful reading and high-performance storytelling. Optimized for SEO and reader engagement.
          </p>

          <div className="max-w-2xl mx-auto mb-16">
            <SearchBar />
          </div>

          {/* Features Row */}
          {/* <div className="flex flex-wrap items-center justify-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-2 hover:text-violet-400 transition-colors">
              <span className="text-lg text-violet-500">⚡</span> High Performance
            </div>
            <div className="flex items-center gap-2 hover:text-violet-400 transition-colors">
              <span className="text-lg text-violet-500">🔍</span> SEO Optimized
            </div>
            <div className="flex items-center gap-2 hover:text-violet-400 transition-colors">
              <span className="text-lg text-violet-500">📱</span> Fully Responsive
            </div>
          </div> */}
        </div>
      </section>

      {/* ── Article Grid Section ────────────────────────── */}
      <section id="latest-articles" className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 scroll-mt-24">
        {articles.length === 0 ? (
          <div className="text-center py-24 animate-fadeIn">
            <div className="text-7xl mb-6">✍️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">No articles found</h2>
            <p className="text-slate-500">The journey of a thousand words begins with a single post.</p>
          </div>
        ) : (
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-16 gap-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Latest Posts</h2>
                <div className="h-1.5 w-12 bg-violet-600 rounded-full" />
              </div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {articles.length} curated stories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article, index) => (
                <div key={article.id} className="animate-slideUpFade" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
    </>
  );
}
