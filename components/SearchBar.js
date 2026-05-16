// components/SearchBar.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function SearchBar({ initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch live results whenever query changes
  useEffect(() => {
    // Clear previous debounce timer
    clearTimeout(debounceRef.current);

    const trimmed = query.trim();

    // If input is empty, hide everything immediately
    if (!trimmed || trimmed.length < 2) {
      setResults([]);
      setShowDropdown(false);
      // If we're on the search page, clear the URL so server results disappear too
      if (pathname === "/search") {
        router.push("/search");
      }
      return;
    }

    // Debounce: wait 300ms after user stops typing
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  // Called when clicking a specific article result
  function handleResultClick() {
    setShowDropdown(false);
  }

  // Called when clicking "View all" — just close dropdown, keep query in URL
  function handleViewAllClick() {
    setShowDropdown(false);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="relative flex w-full group animate-scaleIn"
      >
        <label htmlFor="search-input" className="sr-only">
          Search articles
        </label>

        {/* Search Icon / Loading Spinner */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none">
          {isLoading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          )}
        </div>

        <input
          id="search-input"
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Discover amazing articles..."
          className="w-full pl-14 pr-44 py-5 rounded-3xl border-0 bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/30 focus:bg-white focus:text-slate-900 focus:placeholder-slate-500 transition-all shadow-2xl"
          autoComplete="off"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setShowDropdown(false); }}
            className="absolute right-32 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-violet-500 transition-colors"
            title="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-violet-500/20"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Live Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-slideUpFade">
          {results.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-slate-500 font-medium text-sm">No articles found for "{query.trim()}"</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}#results`}
                  onClick={handleViewAllClick}
                  className="text-[10px] font-black text-violet-600 hover:text-violet-800 uppercase tracking-widest transition-colors"
                >
                  View all →
                </Link>
              </div>

              <ul role="listbox" aria-label="Search results" className="max-h-[170px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                {results.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/articles/${article.slug}`}
                      onClick={handleResultClick}
                      className="flex items-start gap-4 px-5 py-4 hover:bg-violet-50 transition-colors group/item"
                    >
                      <div className="w-9 h-9 rounded-xl bg-violet-100 flex-shrink-0 flex items-center justify-center text-sm group-hover/item:bg-violet-200 transition-colors">
                        ✍️
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-sm truncate group-hover/item:text-violet-700 transition-colors">
                          {article.title}
                        </p>
                        {article.metaDescription && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {article.metaDescription}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 flex-shrink-0 mt-0.5">
                        {formatDate(article.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
