// src/lib/scraper.ts
import * as cheerio from "cheerio";

export async function scrapeBlogText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BlogSummariserBot/1.0)",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    let paragraphs :string[] = [];

    // Prefer articles or blog-related containers first
    const containers = [
      "article",
      ".post-content",
      ".entry-content",
      ".blog-post",
      "#main-content",
      ".content",
      "main",
    ];

    for (const selector of containers) {
      if ($(selector).length > 0) {
        $(selector)
          .find("p")
          .each((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 50 && !text.match(/\d{1,2}:\d{2} (AM|PM)/)) {
              paragraphs.push(text);
            }
          });
        break; // Stop at first matching container
      }
    }

    // Fallback: all <p> tags
    if (paragraphs.length < 5) {
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50 && !text.match(/\d{1,2}:\d{2} (AM|PM)/)) {
          paragraphs.push(text);
        }
      });
    }

    const finalText = paragraphs.join(" ");
    return finalText.length > 100 ? finalText : null;
  } catch (err) {
    console.error("❌ Error scraping blog:", err);
    return null;
  }
}
