/**
 * Crawlers that collect pages to train AI models or build AI datasets, plus generic scrapers.
 * Not listed, so still allowed:
 * - search engines (Googlebot, Bingbot, Yandex, DuckDuckBot, Applebot) and link-preview fetchers;
 * - AI answer engines and assistants that read a page to answer a person and link back to the
 *   site (ChatGPT-User, OAI-SearchBot, Claude-User, Claude-SearchBot, PerplexityBot,
 *   Perplexity-User, MistralAI-User, DuckAssistBot), so the site can still be cited and visited
 *   from AI answers.
 */
export const AI_BOTS = [
  // OpenAI, Anthropic training crawlers
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Google AI (Google-Extended is a robots.txt token only; it does not affect Google Search)
  "Google-Extended",
  "GoogleOther",
  "Google-CloudVertexBot",
  // Apple AI (robots.txt token only; Applebot for Siri and Spotlight search stays allowed)
  "Applebot-Extended",
  // Other model and dataset crawlers
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "PanguBot",
  "Timpibot",
  "ImagesiftBot",
  "omgili",
  "Webzio-Extended",
  // Generic bulk scrapers
  "img2dataset",
  "Scrapy",
];

const pattern = new RegExp(AI_BOTS.map((b) => b.replace(/[-.]/g, "\\$&")).join("|"), "i");

/** True when the user agent names one of the AI crawlers above. */
export function isAiBot(userAgent: string): boolean {
  return pattern.test(userAgent);
}
