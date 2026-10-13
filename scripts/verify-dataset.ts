import { allAgents } from '../lib/data/agents';

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const BANNED_AI_SLOP = [
  "in today's fast-paced digital landscape",
  "in today's fast-paced digital world",
  "delve into",
  "testament to",
  "beacon of",
  "tapestry",
  "seamlessly blend",
  "at the forefront of",
  "game-changer",
  "revolutionize the way",
  "seamlessly integrates",
];

console.log(`Starting verification across ${allAgents.length} curated AI agents...`);

let hasError = false;

if (allAgents.length !== 700) {
  console.error(`❌ Expected_exactly 700 agents, but found ${allAgents.length}`);
  hasError = true;
} else {
  console.log(`✅ Exactly 700 AI agents present.`);
}

// Check slugs, names, and website URLs uniqueness
const slugs = new Map<string, string>();
const names = new Map<string, string>();
const urls = new Map<string, string>();

for (const agent of allAgents) {
  if (slugs.has(agent.slug)) {
    console.error(`❌ Duplicate slug found: ${agent.slug} (shared with ${slugs.get(agent.slug)})`);
    hasError = true;
  }
  slugs.set(agent.slug, agent.name);

  const normName = agent.name.trim().toLowerCase();
  if (names.has(normName)) {
    console.error(`❌ Duplicate name found: "${agent.name}" (slug: ${agent.slug}, shared with slug: ${names.get(normName)})`);
    hasError = true;
  }
  names.set(normName, agent.slug);

  const normUrl = agent.websiteUrl.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '');
  if (urls.has(normUrl)) {
    console.error(`❌ Duplicate websiteUrl found: ${agent.websiteUrl} (slug: ${agent.slug}, shared with slug: ${urls.get(normUrl)})`);
    hasError = true;
  }
  urls.set(normUrl, agent.slug);
}
console.log(`✅ Checked ${slugs.size} unique slugs, ${names.size} unique names, and ${urls.size} unique website URLs.`);

// Word count check and banned words check
let minWordCount = Infinity;
let maxWordCount = 0;
let totalWords = 0;

for (const agent of allAgents) {
  const review = agent.editorialReview;
  const fullText = [
    review.executiveSummary,
    review.architectureDeepDive,
    review.coreCapabilities.join(' '),
    review.enterpriseUseCases.map((u) => `${u.title} ${u.scenario} ${u.implementation} ${u.impact}`).join(' '),
    review.quickstartGuide.map((q) => `${q.title} ${q.instructions} ${q.codeSnippet || ''}`).join(' '),
    review.benchmarks.map((b) => `${b.name} ${b.score} ${b.context}`).join(' '),
    review.pricingBreakdown,
    review.strengths.join(' '),
    review.failureModesAndLimitations.join(' '),
    review.competitors.map((c) => `${c.competitorName} ${c.advantages} ${c.drawbacks}`).join(' '),
    review.faqs.map((f) => `${f.question} ${f.answer}`).join(' '),
    review.finalVerdict,
  ].join(' ');

  const words = countWords(fullText);
  totalWords += words;
  if (words < minWordCount) minWordCount = words;
  if (words > maxWordCount) maxWordCount = words;

  if (words < 2000) {
    console.error(`❌ Agent ${agent.name} (${agent.slug}) has only ${words} words (minimum is 2,000)!`);
    hasError = true;
  }

  // Check banned phrases
  const lowerText = fullText.toLowerCase();
  for (const phrase of BANNED_AI_SLOP) {
    if (lowerText.includes(phrase)) {
      console.error(`❌ Agent ${agent.name} (${agent.slug}) contains banned AI slop phrase: "${phrase}"`);
      hasError = true;
    }
  }
}

console.log(`📊 Word count stats: Minimum = ${minWordCount} words, Maximum = ${maxWordCount} words, Average = ${Math.round(totalWords / allAgents.length)} words.`);
console.log(`✅ Total editorial content across directory: ${totalWords.toLocaleString()} words of human-grade engineering analysis!`);

if (!hasError) {
  console.log(`🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!`);
} else {
  process.exit(1);
}
