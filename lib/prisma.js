// lib/prisma.js
//
// Prisma v7 requires a "driver adapter" — a JavaScript MySQL/MariaDB driver
// that Prisma uses instead of its old built-in Rust driver.
//
// For MySQL, we use:
//   - "mariadb" → the Node.js MySQL/MariaDB driver
//   - "@prisma/adapter-mariadb" → the Prisma adapter that wraps it

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Parses the DATABASE_URL and prepares it for the MariaDB adapter.
 * Handles common MySQL 8 authentication issues by enabling public key retrieval.
 */
function parseDbUrl(url) {
  try {
    const parsed = new URL(url);
    const sslMode = parsed.searchParams.get("ssl-mode");

    return {
      host: parsed.hostname,
      port: parseInt(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace("/", "").split("?")[0],
      // Ensure robust connection pooling even during the build phase
      connectionLimit: (process.env.NODE_ENV === "development" && !process.env.VERCEL) ? 5 : 10,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Simplified SSL for maximum compatibility
      ssl: { 
        rejectUnauthorized: false
      },
      // Extreme timeouts for unstable environments
      connectTimeout: 10000, // 10 seconds to establish connection
      acquireTimeout: 10000, // 10 seconds to acquire connection from pool
      idleTimeout: 30000,    // 30 seconds before closing idle connection
      socketTimeout: 30000, // 30 seconds for operations
      // Fix for MySQL 8 authentication issue
      allowPublicKeyRetrieval: true,
    };
  } catch {
    // Fallback/Default for build time if URL is invalid or missing
    return {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "blogger_db",
      connectionLimit: 1,
      allowPublicKeyRetrieval: true,
    };
  }
}

const globalForPrisma = globalThis;

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  const dbConfig = parseDbUrl(dbUrl);
  
  // Create the adapter (Required for Prisma 7)
  const adapter = new PrismaMariaDb(dbConfig);
  
  // Return the client with the adapter
  return new PrismaClient({ adapter });
}

// Singleton pattern to prevent multiple instances in development
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
