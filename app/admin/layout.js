// app/admin/layout.js
//
// Admin layout — wraps all /admin/* pages.
// Gives the admin panel a different look from the public site.
// No authentication for this academic assignment
// (in production, you'd add Next-Auth here).

export const metadata = {
  title: {
    default: "Admin | BLOGGER",
    template: "%s | Admin | BLOGGER",
  },
  robots: { index: false, follow: false }, // Never index admin pages
};

import LogoutButton from "@/components/LogoutButton";
import { headers } from "next/headers";

export default async function AdminLayout({ children }) {
  // We check the path to see if we should show the header
  // Note: layout is a server component, so we can't use usePathname here directly
  // However, for this simple logic, we can just wrap the content.
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 
          Admin-specific navigation bar 
          We wrap this in a client-side check if needed, 
          but for simplicity, we'll just show it. 
      */}
      <div className="bg-violet-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a
                href="/admin"
                className="font-black text-white hover:text-violet-200 transition-colors tracking-tight text-lg"
              >
                BLOGGER ADMIN
              </a>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <a
                  href="/admin"
                  className="text-violet-200 hover:text-white transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/articles/new"
                  className="text-violet-200 hover:text-white transition-colors"
                >
                  {/* + New Article */}
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="text-xs sm:text-sm font-semibold text-violet-100 hover:text-white px-3 py-1.5 rounded-xl border border-violet-700 bg-violet-800/50 hover:bg-violet-800 transition-all shadow-sm"
              >
                View Site
              </a>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Admin page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </div>
    </div>
  );
}
