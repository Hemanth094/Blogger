// app/layout.js
//
// ROOT LAYOUT — This wraps every page on the entire site.
// Think of it like the outer HTML shell.
//
// WHY METADATA HERE?
// The metadata object defines DEFAULT SEO tags for every page.
// Individual pages can override these with their own generateMetadata().
//
// WHY THESE SEO TAGS?
// - title: Shows in browser tab and Google search results
// - description: Shows below the link in Google (improves clicks)
// - openGraph: Controls how links look when shared on Twitter, Facebook, etc.
// - twitter: Specifically for Twitter card previews

import "./globals.css";
import Link from "next/link";
import NavigationWrapper from "@/components/NavigationWrapper";
import Header from "@/components/Header";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Default metadata — individual pages can override these
export const metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "BLOGGER",
    template: "%s | BLOGGER",  // "%s" is replaced by each page's title
  },
  description:
    "BLOGGER is a modern content publishing platform with excellent SEO, fast performance, and a clean reading experience.",

  // Canonical URL tells Google: "this is the main version of this page"
  // Prevents duplicate content penalties when page is shared with different URLs
  alternates: {
    canonical: baseUrl,
  },

  // OpenGraph — for Facebook, LinkedIn, WhatsApp link previews
  openGraph: {
    type: "website",
    siteName: "BLOGGER",
    title: "BLOGGER — SEO-Optimized Publishing Platform",
    description: "Read insightful articles on BLOGGER.",
    url: baseUrl,
  },

  // Twitter card — for Twitter/X link previews
  twitter: {
    card: "summary_large_image",
    title: "BLOGGER",
    description: "Read insightful articles on BLOGGER.",
  },

  icons: {
    icon: "/icon.png",
  },

  // Tell Google it can index the site
  robots: {
    index: true,
    follow: true,
  },
};


// Footer component
function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
                <span className="font-black text-xl tracking-tighter text-slate-900">BLOGGER</span>
             </Link>
             <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                A modern publishing platform designed for the best reading experience.
             </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#latest-articles" className="text-slate-500 hover:text-violet-600 transition-colors">Latest Articles</Link></li>
              <li><Link href="/search" className="text-slate-500 hover:text-violet-600 transition-colors">Search Content</Link></li>
              {/* <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">Privacy Policy</a></li> */}
              {/* <li><Link href="/rss" className="text-slate-500 hover:text-violet-600 transition-colors">RSS Feed</Link></li> */}
            </ul>
          </div>

          {/* <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/login" className="text-slate-500 hover:text-violet-600 transition-colors">Admin Login</Link></li>
              <li><Link href="/sitemap.js" className="text-slate-500 hover:text-violet-600 transition-colors">Sitemap</Link></li>
              <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div> */}
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} BLOGGER. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
             <span>Built with ✨ by Blogger</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Root layout — wraps everything
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      {/*
       * WHY lang="en"?
       * It tells browsers and screen readers the language.
       * Google uses it to understand which country to target your content.
       */}
      <body className={`${outfit.className} min-h-screen flex flex-col`}>
        <NavigationWrapper 
          header={<Header />} 
          footer={<Footer />}
        >
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
