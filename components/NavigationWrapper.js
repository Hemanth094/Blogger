"use client";

import { usePathname } from "next/navigation";

export default function NavigationWrapper({ header, footer, children }) {
  const pathname = usePathname();
  
  // Check if we are in the admin area
  const isAdmin = pathname?.startsWith("/admin");
  const isLogin = pathname === "/login";

  return (
    <>
      {!isAdmin && !isLogin && header}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && !isLogin && footer}
    </>
  );
}
