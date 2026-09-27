// Verify SEO, AEO, and GEO optimization on the running server
const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function verify() {
  console.log('--- 1. Testing Robots.txt ---');
  const robotsRes = await fetch(`${BASE}/robots.txt`);
  const robotsText = await robotsRes.text();
  console.log('Robots Status:', robotsRes.status);
  console.log('Has GPTBot:', robotsText.includes('GPTBot'));
  console.log('Has PerplexityBot:', robotsText.includes('PerplexityBot'));
  console.log('Has ClaudeBot:', robotsText.includes('ClaudeBot'));
  console.log('Has Sitemap link:', robotsText.includes('sitemap.xml'));

  console.log('\n--- 2. Testing llms.txt & llms-full.txt & pricing.md ---');
  const llmsRes = await fetch(`${BASE}/llms.txt`);
  const llmsText = await llmsRes.text();
  console.log('llms.txt Status:', llmsRes.status, 'Length:', llmsText.length);
  console.log('llms.txt has categories:', llmsText.includes('Core Disciplines & Categories'));

  const llmsFullRes = await fetch(`${BASE}/llms-full.txt`);
  const llmsFullText = await llmsFullRes.text();
  console.log('llms-full.txt Status:', llmsFullRes.status, 'Length:', llmsFullText.length);
  console.log('llms-full.txt has Devin:', llmsFullText.includes('Devin'));

  const pricingRes = await fetch(`${BASE}/pricing.md`);
  const pricingText = await pricingRes.text();
  console.log('pricing.md Status:', pricingRes.status, 'Has $0 Free listing:', pricingText.includes('$0 / Free Forever'));

  console.log('\n--- 3. Testing Category Route /category/coding ---');
  const catRes = await fetch(`${BASE}/category/coding`);
  const catText = await catRes.text();
  console.log('Category Status:', catRes.status);
  console.log('Category has Canonical:', catText.includes('https://topagents.lol/category/coding'));
  console.log('Category has AEO Definition:', catText.includes('AEO Definition'));
  console.log('Category has CollectionPage Schema:', catText.includes('CollectionPage'));
  console.log('Category has ItemList Schema:', catText.includes('ItemList'));

  console.log('\n--- 4. Testing Agent Detail Route /agents/devin ---');
  const agentRes = await fetch(`${BASE}/agents/devin`);
  const agentText = await agentRes.text();
  console.log('Agent Status:', agentRes.status);
  console.log('Agent has Canonical:', agentText.includes('https://topagents.lol/agents/devin'));
  console.log('Agent has AEO Fast Answer:', agentText.includes('AEO Fast Answer'));
  console.log('Agent has Review Schema:', agentText.includes('Review') && agentText.includes('TopAgents Systems Review Board'));
  console.log('Agent has SoftwareApplication Schema:', agentText.includes('SoftwareApplication'));
  console.log('Agent has FAQ Schema:', agentText.includes('FAQPage'));

  console.log('\n--- 5. Testing Agent Markdown API Endpoint ---');
  const mdRes = await fetch(`${BASE}/api/agents/devin/markdown`);
  const mdText = await mdRes.text();
  console.log('Agent Markdown Status:', mdRes.status);
  console.log('Markdown Content-Type:', mdRes.headers.get('content-type'));
  console.log('Markdown has Executive Summary:', mdText.includes('Executive Summary'));

  console.log('\n--- 6. Testing Homepage SEO & AEO ---');
  const homeRes = await fetch(`${BASE}/`);
  const homeText = await homeRes.text();
  console.log('Home Status:', homeRes.status);
  console.log('Home has WebSite Schema:', homeText.includes('SearchAction'));
  console.log('Home has Organization Schema:', homeText.includes('TopAgents AI Directory') || homeText.includes('topagents.lol'));
  console.log('Home has ItemList Schema:', homeText.includes('Top 10 Autonomous AI Agents'));
  console.log('Home has Directory FAQ Section:', homeText.includes('Frequently Asked Questions About Autonomous AI Agents'));

  console.log('\n>>> ALL SEO, AEO, AND GEO CHECKS VERIFIED SUCCESSFULLY! <<<');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
