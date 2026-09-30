import { NextRequest, NextResponse } from 'next/server';
import { isValidSafeUrl, sanitizeString } from '@/lib/security/sanitize';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { AgentCategory, PricingModel } from '@/lib/data/types';

// 20 scrape requests per hour per IP
const SCRAPE_RATE_LIMIT = 20;
const SCRAPE_WINDOW_MS = 60 * 60 * 1000;

/** Extract content of a meta tag by property or name attribute */
function extractMeta(html: string, attr: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${attr}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${attr}["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return '';
}

/** Extract the page <title> */
function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? '';
}

/** Strip visible HTML tags and collapse whitespace */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract the best logo URL: apple-touch-icon → square icon/favicon → Google S2 favicon API */
function extractLogoUrl(html: string, pageUrl: string): string {
  const urlObj = new URL(pageUrl);
  const origin = urlObj.origin;
  const hostname = urlObj.hostname.replace(/^www\./, '');

  const toAbsolute = (href: string): string => {
    if (!href) return '';
    if (href.startsWith('http://') || href.startsWith('https://')) return href;
    if (href.startsWith('//')) return `https:${href}`;
    if (href.startsWith('/')) return `${origin}${href}`;
    return `${origin}/${href}`;
  };

  // 1. Apple touch icon (high-res square icon, standard for mobile & apps)
  const appleTouchMatch =
    html.match(/<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i) ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon(?:-precomposed)?["']/i);
  if (appleTouchMatch?.[1]) {
    return toAbsolute(appleTouchMatch[1].trim());
  }

  // 2. High-res or vector icon from link[rel~=icon] (e.g. svg, 192x192, 180x180, png)
  const allIcons = [
    ...html.matchAll(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/gi),
  ];

  // Prefer SVG or high-res PNG icons
  for (const m of allIcons) {
    const href = m[1].trim();
    if (/\.(svg|png|webp)/i.test(href) && !href.includes('favicon-16')) {
      return toAbsolute(href);
    }
  }

  // Any other icon match
  if (allIcons.length > 0 && allIcons[0]?.[1]) {
    return toAbsolute(allIcons[0][1].trim());
  }

  // 3. og:image only if it explicitly appears to be a logo or icon (not a full banner)
  const ogImage = extractMeta(html, 'og:image');
  if (ogImage && /(logo|icon|avatar|brand|mark)/i.test(ogImage)) {
    return toAbsolute(ogImage);
  }

  // 4. Reliable Google S2 favicon service (128x128 high-res app icon)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
}

/** Detect pricing model from page text */
function detectPricing(text: string): PricingModel {
  const t = text.toLowerCase();
  if (/open[- ]source|mit license|apache license|github\.com\/[^/]+\/[^/]+\s*(—|\|)?\s*open/i.test(t)) return 'open-source';
  if (/100%\s*free|completely free|free forever|always free|no credit card/i.test(t)) return 'free';
  if (/freemium|free plan|free tier|paid plan|upgrade|pro plan/i.test(t)) return 'freemium';
  if (/pricing|subscription|\$\d+\/mo|per month|per seat|enterprise/i.test(t)) return 'paid';
  return 'freemium';
}

/** Detect best-fit category from page text */
function detectCategory(text: string): AgentCategory {
  const t = text.toLowerCase();
  const scores: Record<AgentCategory, number> = {
    coding: 0, autonomous: 0, frameworks: 0, voice: 0,
    support: 0, sales: 0, research: 0, productivity: 0, workflow: 0, creative: 0,
  };

  const signals: Array<[AgentCategory, string[]]> = [
    ['coding',      ['code', 'coding', 'developer', 'programming', 'ide', 'terminal', 'cli', 'swe-bench', 'pull request', 'git', 'compiler']],
    ['autonomous',  ['browser', 'web navigation', 'computer use', 'autonomous', 'playwright', 'puppeteer', 'scraping', 'web agent']],
    ['frameworks',  ['multi-agent', 'framework', 'orchestrat', 'dag', 'graph', 'pipeline', 'langgraph', 'autogen', 'crew']],
    ['voice',       ['voice', 'phone', 'call', 'speech', 'audio', 'ivr', 'twilio', 'stt', 'tts']],
    ['support',     ['customer support', 'helpdesk', 'ticket', 'zendesk', 'intercom', 'cx', 'support agent']],
    ['sales',       ['sales', 'sdr', 'outreach', 'lead', 'crm', 'prospecting', 'cold email', 'b2b']],
    ['research',    ['research', 'deep search', 'perplexity', 'literature', 'paper', 'rag', 'summariz', 'knowledge']],
    ['productivity',['meeting', 'calendar', 'notes', 'summary', 'transcrib', 'zoom', 'slack', 'productivity']],
    ['workflow',    ['workflow', 'automation', 'zapier', 'n8n', 'make.com', 'trigger', 'integrate', 'no-code']],
    ['creative',    ['image', 'video', 'design', 'creative', 'art', 'music', 'generate', 'content creation']],
  ];

  for (const [cat, keywords] of signals) {
    for (const kw of keywords) {
      if (t.includes(kw)) scores[cat] += 1;
    }
  }

  const best = (Object.entries(scores) as [AgentCategory, number][])
    .sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'coding';
}

/** Find a GitHub URL in the page */
function extractGithubUrl(html: string): string | undefined {
  const m = html.match(/https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/);
  return m?.[0];
}

/** Clean product name: strip site-suffix patterns like " | Company" or " - Company" */
function cleanProductName(raw: string): string {
  return raw
    .replace(/\s*[|\-–—]\s*[^|]+$/, '')
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim()
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`scrape:${ip}`, SCRAPE_RATE_LIMIT, SCRAPE_WINDOW_MS);
    if (!rateLimit.allowed) return createRateLimitResponse(rateLimit);

    const body = await req.json().catch(() => ({}));
    const { url } = body;

    // Validate URL
    const urlCheck = isValidSafeUrl(url);
    if (!urlCheck.valid) {
      return NextResponse.json({ error: `Invalid URL: ${urlCheck.reason}` }, { status: 400 });
    }

    const safeUrl = urlCheck.sanitizedUrl!;

    // Fetch the page
    let html = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(safeUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'TopAgentsBot/1.0 (+https://topagents.lol)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      clearTimeout(timeout);
      html = await response.text();
    } catch (err: any) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${err?.message ?? 'timeout or unreachable'}` },
        { status: 422 }
      );
    }

    // Extract fields
    const ogTitle       = extractMeta(html, 'og:title');
    const ogDescription = extractMeta(html, 'og:description');
    const metaDesc      = extractMeta(html, 'description');
    const rawTitle      = ogTitle || extractTitle(html);
    const descRaw       = ogDescription || metaDesc;

    const visibleText   = stripHtml(html).slice(0, 5000);
    const combinedText  = `${rawTitle} ${descRaw} ${visibleText}`;

    const name          = cleanProductName(rawTitle);
    const tagline       = sanitizeString(descRaw, 200) || sanitizeString(visibleText.slice(0, 200), 200);
    const githubUrl     = extractGithubUrl(html);
    const logoUrl       = extractLogoUrl(html, safeUrl);
    const pricingHint   = detectPricing(combinedText);
    const categoryHint  = detectCategory(combinedText);

    // Return full extraction
    return NextResponse.json({
      success: true,
      name,
      tagline,
      githubUrl,
      logoUrl,
      pricingHint,
      categoryHint,
      fullText: sanitizeString(visibleText, 3000),
    });
  } catch (err: any) {
    console.error('[Scrape API]', err);
    return NextResponse.json(
      { error: 'Failed to process scrape request.' },
      { status: 500 }
    );
  }
}
