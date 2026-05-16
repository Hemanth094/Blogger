// components/Header.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isSearchPage = pathname === "/search";

  return (
    <header className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo / Site Name */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="BLOGGER Home"
        >
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform">
            B
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 group-hover:text-violet-600 transition-colors">
            BLOGGER
          </span>
        </Link>

        {/* Search — always visible except on the search page itself */}
        {!isSearchPage && (
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
