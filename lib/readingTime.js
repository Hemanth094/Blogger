// lib/readingTime.js
//
// "Reading time" shows visitors how long an article will take to read.
// (e.g., "5 min read")
//
// Average adult reading speed = ~200-250 words per minute.
// We'll use 200 WPM for a comfortable estimate.

/**
 * Calculate estimated reading time from article content
 * @param {string} content - Raw article text (can contain HTML)
 * @returns {string} - Formatted reading time (e.g. "3 min read")
 */
export function getReadingTime(content) {
  if (!content) return "1 min read";

  // Strip HTML tags so we only count real words
  const plainText = content.replace(/<[^>]*>/g, "");

  // Split into words and count
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Calculate minutes at 200 words per minute
  const minutes = Math.ceil(wordCount / 200);

  // Minimum of 1 minute
  return `${Math.max(1, minutes)} min read`;
}
