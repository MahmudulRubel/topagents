import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24 hours cache

/**
 * Structured pricing specification for AI purchasing agents, directory builders, and advertisers.
 * Conforms to modern GEO / Agent-Readiness guidelines for transparent commercial models.
 */
export async function GET() {
  const content = `# Commercial Pricing & Listing Economics — topagents.lol

> Last Updated: September 2026
> Contact: partnerships@topagents.lol
> Domain: https://topagents.lol

## 1. Directory Listings & Submissions (Builders & Creators)

### Community Agent Listing
- **Price**: $0 / Free Forever
- **Availability**: Open to all autonomous AI agents, multi-agent frameworks, and developer tooling.
- **Includes**:
  - Full product profile page with verified backlink.
  - Inclusion in category feeds, search indexes, and XML sitemaps.
  - Real-time community upvotes and organic ranking.
  - Automatic ingestion into \`/llms.txt\` and \`/llms-full.txt\` for AI citation.
- **Submission URL**: https://topagents.lol/submit

### Technical Systems Review
- **Price**: $0 (Editorial Independence Policy)
- **Includes**:
  - Comprehensive 2,000+ words technical systems audit by senior systems engineers.
  - Architectural loop analysis, sandboxing evaluation, and SWE-bench / GAIA metric extraction.
  - Schema.org \`SoftwareApplication\`, \`Review\`, and \`FAQPage\` JSON-LD generation.
  - Note: Reviews cannot be purchased or altered for commercial compensation.

---

## 2. Sponsored Advertising & Spotlight Placements

For AI companies, developer platforms, and GPU cloud providers looking to reach founders, engineers, and AI practitioners.

### Featured Agent Spotlight
- **Price**: $1,499 / month
- **Placements**:
  - Pinned hero banner across homepage and all category directory feeds.
  - Custom badge: "Featured Agent of the Month".
  - Dedicated call-to-action button linking directly to product signup.

### Desktop Side Rail Sponsor (Slots 1 to 4)
- **Price**: $799 / month per slot
- **Placements**:
  - High-visibility sticky desktop side rails across main feed views.
  - Target audience: AI engineers, autonomous agent architects, and technical decision makers.
  - Clean, native card design with click tracking and direct external links.

### Category Banner Spotlight
- **Price**: $499 / month per category
- **Placements**:
  - Sticky banner at the top of a dedicated discipline page (e.g. /category/coding or /category/frameworks).
  - Target audience: Highly segmented builders seeking category-specific solutions.

---

## 3. Directory API & Machine-Readable Data Feeds

- **Access**: Free for non-commercial and research use.
- **Endpoints**:
  - \`https://topagents.lol/llms.txt\`: Taxonomy, methodology, and top agents guide.
  - \`https://topagents.lol/llms-full.txt\`: Complete dataset containing all 100+ agent specs.
  - \`https://topagents.lol/api/agents/[slug]/markdown\`: Markdown representation of individual agent profile.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
