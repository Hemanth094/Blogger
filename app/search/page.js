// app/search/page.js
//
// Search results page — accessed via /search?q=keyword
//
// WHY IS THIS A SERVER COMPONENT?
// The search query comes from the URL (?q=keyword).
// We read it on the server, query the database, and return results.
// No client-side JavaScript needed for the search itself!

import { cache } from 'react';
import prisma from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";

// Generate SEO metadata dynamically based on the search query
export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";
  return {
    title: q ? `Search: "${q}"` : "Search Articles",
    description: q
      ? `Search results for "${q}" on BLOGGER`
      : "Search through all articles on BLOGGER",
    robots: { index: false }, // Don't index search pages (good SEO practice)
  };
}

const searchArticles = cache(async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    return await prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },          // Match in title
          { content: { contains: query } },         // Match in content
          { metaDescription: { contains: query } }, // Match in meta description
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit search results to optimize performance
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        metaDescription: true,
        createdAt: true,
        content: true, // Needed for search preview/results
      },
    });
  } catch (error) {
    // Fail gracefully instead of crashing the page if database is unreachable
    return [];
  }
});

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";
  const results = await searchArticles(query);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="relative z-20 bg-[#0f172a] text-white pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center animate-slideUpFade">
          <h1 className="text-4xl sm:text-5xl font-black mb-8 tracking-tight">Search Our Archive</h1>
          <SearchBar initialValue={query} />
          
          {query && (
            <p className="mt-8 text-slate-400 font-medium animate-fadeIn">
              Showing results for <span className="text-violet-400">"{query}"</span>
            </p>
          )}
        </div>
      </div>

      {/* Results Content */}
      <div id="results" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-4">
        {query ? (
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Found {results.length} matched stories
               </h2>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {results.map((article, index) => (
                  <div key={article.id} className="animate-slideUpFade" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 animate-scaleIn">
                <div className="text-7xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No matching articles</h3>
                <p className="text-slate-500">We couldn't find anything for that search. Try another keyword!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 animate-scaleIn">
            <div className="text-7xl mb-6">💡</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to explore?</h3>
            <p className="text-slate-500">Enter a keyword above to search through our database of articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
