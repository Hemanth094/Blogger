// components/JsonLd.js
//
// JSON-LD Article Schema for SEO
//
// WHAT IS JSON-LD?
// JSON-LD (JavaScript Object Notation for Linked Data) is a way to tell
// search engines structured information about your content.
//
// WHY IT MATTERS:
// When Google understands your article is an Article (not just text),
// it can show "rich results" in search — like author names, dates, images.
// This dramatically improves click-through rates.
//
// HOW IT WORKS:
// We inject a <script type="application/ld+json"> into the <head>
// with structured data that follows Schema.org standards.

export default function JsonLd({ article, baseUrl }) {
  // Build the structured data object following Schema.org Article spec
  const schema = {
    "@context": "https://schema.org",   // Always required
    "@type": "Article",                  // This is an Article
    headline: article.title,            // Article title
    description: article.metaDescription || "",
    // Use the article image, or a default OG image
    image: article.image
      ? `${baseUrl}${article.image.startsWith("/") ? "" : "/"}${article.image}`
      : `${baseUrl}/og-default.png`,
    datePublished: article.createdAt,   // When it was first published
    dateModified: article.updatedAt,    // When it was last updated
    author: {
      "@type": "Organization",
      name: "BLOGGER",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "BLOGGER",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/articles/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is needed to inject raw JSON into a <script> tag
      // This is safe here because we control the data (not user-submitted HTML)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
