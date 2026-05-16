// lib/slugify.js
//
// A "slug" is the URL-friendly version of a title.
// Example: "Hello World! My First Post" → "hello-world-my-first-post"
//
// Good slugs:
//   ✅ lowercase
//   ✅ hyphens instead of spaces
//   ✅ no special characters
//   ✅ no accented letters (é → e)

/**
 * Convert a title string into a clean URL slug
 * @param {string} text - The article title
 * @returns {string} - URL-safe slug
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")                    // Decompose accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, "")    // Remove accent marks
    .toLowerCase()                        // Convert to lowercase
    .trim()                               // Remove leading/trailing spaces
    .replace(/[^a-z0-9\s-]/g, "")       // Remove non-alphanumeric chars
    .replace(/[\s_-]+/g, "-")           // Replace spaces/underscores with hyphen
    .replace(/^-+|-+$/g, "");           // Remove leading/trailing hyphens
}

/**
 * Make a slug unique by appending a number if it already exists
 * @param {string} baseSlug - The base slug to make unique
 * @param {Function} checkExists - Async function that returns true if slug exists
 * @returns {Promise<string>} - A unique slug
 */
export async function makeUniqueSlug(baseSlug, checkExists) {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
