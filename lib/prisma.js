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
      database: parsed.pathname.replace("/", ""),
      // Force 1 connection for Vercel/Cloud to prevent pool exhaustion.
      // Only allow 5 in local development.
      connectionLimit: (process.env.NODE_ENV === "development" && !process.env.VERCEL) ? 5 : 1,
      // Aiven requires SSL
      ssl: { rejectUnauthorized: false },
      // Increase timeouts for cloud-to-cloud stability
      connectTimeout: 10000, // 10 seconds to establish connection
      socketTimeout: 30000,  // 30 seconds for operations
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
  
  // Create the adapter
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
