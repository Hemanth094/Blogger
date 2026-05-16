// lib/aiMeta.js
//
// AI SEO Metadata Generator
// Improved for robustness and error reporting

/**
 * Generate SEO meta title and description from article content
 * @param {string} title - Article title
 * @param {string} content - Article content (can be HTML)
 * @returns {Promise<{metaTitle: string, metaDescription: string, error?: string}>}
 */
export async function generateSEOMeta(title, content) {
  const apiKey = process.env.OPENAI_API_KEY;
  const siteName = "BLOGGER";

  console.log("[AI Meta] Starting generation. API Key present:", !!apiKey);

  // Strip HTML to get real text length
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  
  if (!plainText) {
    console.warn("[AI Meta] No text content found after stripping HTML.");
    return {
      metaTitle: `${title.substring(0, 45)} | ${siteName}`,
      metaDescription: `Read the complete article about ${title} and explore more professional insights.`,
      error: "Content is too short or empty."
    };
  }

  // If OpenAI key is available, use AI
  if (apiKey && apiKey.length > 10) {
    try {
      return await generateWithOpenAI(title, plainText, apiKey);
    } catch (error) {
      console.error("[AI Meta] OpenAI call failed:", error.message);
      // Fall through to fallback
    }
  }

  // Otherwise, fall back to a "Branded & Tagged" title to ensure it's different
  console.log("[AI Meta] Using SEO-optimized fallback phrasing.");
  
  // Make the title distinct
  const brandedTitle = `Insights: ${title}`;
  const suffix = ` | ${siteName}`;
  const availableSpace = 60 - suffix.length;
  
  const truncatedTitle = smartTruncate(brandedTitle, availableSpace);

  return {
    metaTitle: `${truncatedTitle}${suffix}`,
    metaDescription: generateSimpleSummary(title, plainText, siteName),
    warning: apiKey ? "AI connection failed, using optimized fallback" : "No API key, using optimized fallback"
  };
}

/**
 * Safely truncates text at a word boundary
 */
function smartTruncate(text, limit) {
  if (text.length <= limit) return text;
  // Subtract 3 for the "..."
  let truncated = text.substring(0, limit - 3).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > limit * 0.6) {
    truncated = truncated.substring(0, lastSpace);
  }
  return `${truncated}...`;
}

async function generateWithOpenAI(title, plainText, apiKey) {
  const excerpt = plainText.substring(0, 1500); // Send a bit more context

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a world-class SEO strategist for a modern blog platform. Your goal is to create high-CTR (Click-Through Rate) metadata. \n\nCRITICAL RULES:\n1. The Meta Title MUST be DIFFERENT from the provided Article Title. Use a catchy variation or synonym. \n2. The Meta Description MUST NOT be a direct copy of the article text. It should be an engaging teaser that creates curiosity.\n3. Meta Title: < 60 characters.\n4. Meta Description: 140-160 characters.\n5. Respond ONLY with a JSON object: { \"metaTitle\": \"...\", \"metaDescription\": \"...\" }"
        },
        {
          role: "user",
          content: `Article Title: ${title}\nArticle Content: ${plainText.substring(0, 2000)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 350,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API returned ${response.status}`);
  }

  const data = await response.json();
  let result;
  
  try {
    const rawContent = data.choices?.[0]?.message?.content || "{}";
    const jsonStr = rawContent.replace(/```json|```/g, "").trim();
    result = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[AI Meta] JSON parse error:", e.message);
    throw new Error("Invalid response format from AI");
  }

  return {
    metaTitle: (result.metaTitle || title).substring(0, 60),
    metaDescription: (result.metaDescription || "").substring(0, 160)
  };
}

function generateSimpleSummary(title, text, siteName = "BLOGGER") {
  const cleanText = text.replace(/\s+/g, " ").trim();
  
  // Create a clean summary without the "Read more" branding suffix
  const limit = 155;

  if (cleanText.length <= limit) {
    return cleanText;
  }

  return smartTruncate(cleanText, limit);
}
