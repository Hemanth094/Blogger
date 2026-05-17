// app/articles/[slug]/page.js
//
// INDIVIDUAL ARTICLE PAGE
// This is the most SEO-important page — each article has its own URL.
//
// Two key Next.js features used here:
//
// 1. generateMetadata() — Runs server-side to set the <head> tags (title, description, etc.)
//    This is crucial for SEO because these tags must exist in the raw HTML,
//    not added by JavaScript after the page loads.
//
// 2. generateStaticParams() — Pre-renders all article pages at build time.
//    This means articles load INSTANTLY (no database query on each visit).
//    This is called "Static Site Generation" (SSG).
//
// 3. notFound() — Shows a proper 404 page if the slug doesn't exist.

import { cache } from 'react';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getReadingTime } from "@/lib/readingTime";
import JsonLd from "@/components/JsonLd";
import RelatedArticles from "@/components/RelatedArticles";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ── Fetch a single article by slug ──────────────
// cache() ensures we only hit the DB once per request, even if 
// generateMetadata and the Page component both call this.
const getArticle = cache(async (slug) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug, published: true },
    });
    return article;
  } catch (error) {
    // Fail silently during build phase
    return null;
  }
});

// ── Fetch related articles ──────────────────────
const getRelatedArticles = cache(async (currentSlug) => {
  try {
    return await prisma.article.findMany({
      where: { published: true, slug: { not: currentSlug } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        metaDescription: true,
        content: true,
        category: true,
        createdAt: true,
      },
    });
  } catch (error) {
    // Fail silently during build phase
    return [];
  }
});

export const revalidate = 3600; // ISR: revalidate every hour

// ─────────────────────────────────────────────────────────────
// generateMetadata() — This is how Next.js sets SEO meta tags.
//
// It runs on the server before the page renders.
// Without this, every article would have the same generic title/description.
// With this, each article gets its own unique SEO tags — critical for ranking.
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article Not Found | BLOGGER" };
  }

  const articleUrl = `${baseUrl}/articles/${article.slug}`;
  const imageUrl = article.image || `${baseUrl}/og-default.png`;

  return {
    // TITLE: Shown in browser tab and Google results
    title: article.metaTitle || article.title,

    // DESCRIPTION: Shown below title in Google (improves CTR)
    description: article.metaDescription || `Read "${article.title}" and explore the full story.`,

    // CANONICAL URL: Tells Google this is the definitive URL for this content.
    // Prevents duplicate content penalties (e.g., if page is shared with ?ref=twitter).
    alternates: {
      canonical: articleUrl,
    },

    // OPEN GRAPH: Controls Facebook, LinkedIn, WhatsApp previews
    openGraph: {
      type: "article",
      title: article.metaTitle || article.title,
      description: article.metaDescription || "",
      url: articleUrl,
      siteName: "BLOGGER",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
    },

    // TWITTER CARD: Controls Twitter/X link preview
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || "",
      images: [imageUrl],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// This page is rendered dynamically at runtime to avoid build-time database
// queries on Vercel during the build step.
// ─────────────────────────────────────────────────────────────

// Format date nicely
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Main Page Component ──────────────────────────
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const readingTime = getReadingTime(article.content);
  const relatedArticles = await getRelatedArticles(article.slug);

  return (
    <>
      <JsonLd article={article} baseUrl={baseUrl} />

      <div className="bg-slate-50 min-h-screen">
        {/* Article Header Section */}
        <div className="bg-white border-b border-slate-100 animate-fadeIn">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8">
            {/* Navigation */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-violet-600 uppercase tracking-[0.2em] transition-all"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </div>
                Return Home
              </Link>

              <nav aria-label="Breadcrumb" className="hidden sm:block">
                <ol className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <li>Home</li>
                  <li aria-hidden="true">/</li>
                  <li className="text-violet-600">Article</li>
                </ol>
              </nav>
            </div>

            {/* Title & Meta */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6">
                <div className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full">Story</div>
                <span>•</span>
                <time dateTime={article.createdAt.toISOString()}>
                  {formatDate(article.createdAt)}
                </time>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {readingTime}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter">
                {article.title}
              </h1>

              {article.metaDescription && (
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  {article.metaDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar (Desktop only) */}
            <aside className="hidden lg:block lg:col-span-1 border-r border-slate-100 pr-8">
               <div className="sticky top-32 flex flex-col items-center gap-8">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  </div>
               </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-11 max-w-3xl">
              {/* Cover image */}
              {article.image && (
                <div className="relative h-72 sm:h-[450px] w-full rounded-3xl overflow-hidden mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                  />
                </div>
              )}

              <article
                className="prose animate-slideUpFade"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share & Action footer */}
              <div className="mt-12 pt-12 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Spread the knowledge</h4>
                    <div className="flex gap-4">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${baseUrl}/articles/${article.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-black hover:-translate-y-1 transition-all shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${baseUrl}/articles/${article.slug}`)}&title=${encodeURIComponent(article.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-700 text-white hover:bg-blue-800 hover:-translate-y-1 transition-all shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 hover:shadow-[0_15px_40px_rgba(124,58,237,0.3)] transform hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    Finish Reading
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="bg-white py-12 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <RelatedArticles 
              articles={relatedArticles} 
              currentSlug={article.slug} 
              currentTitle={article.title} 
              currentCategory={article.category} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
