import fs from 'fs';
import path from 'path';

const AGENT_FILES = [
  'coding-agents.ts',
  'browser-autonomous.ts',
  'multi-agent.ts',
  'voice-agents.ts',
  'support-agents.ts',
  'sales-agents.ts',
  'research-agents.ts',
  'productivity-agents.ts',
  'workflow-agents.ts',
];

const DIR = path.join(process.cwd(), 'lib', 'data', 'agents');

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash;
}

function scaleVotes(oldVotes: number, slug: string): { votes: number; reviews: number } {
  if (oldVotes <= 100) {
    const hash = getHash(slug);
    const reviewRatio = 0.18 + ((hash % 4) * 0.03);
    const reviews = Math.max(3, Math.round(oldVotes * reviewRatio));
    return { votes: oldVotes, reviews };
  }

  // Original votes were between 1290 and 3450
  const ratio = Math.max(0, Math.min(1, (oldVotes - 1200) / (3450 - 1200)));
  const base = 16 + Math.pow(ratio, 1.15) * (94 - 16);
  const hash = getHash(slug);
  const jitter = (hash % 7) - 3; // -3 to +3
  const votes = Math.round(Math.max(12, Math.min(96, base + jitter)));
  const reviewRatio = 0.18 + ((hash % 4) * 0.03);
  const reviews = Math.max(3, Math.round(votes * reviewRatio));
  return { votes, reviews };
}

let modifiedCount = 0;

for (const filename of AGENT_FILES) {
  const filePath = path.join(DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const isCrlf = content.includes('\r\n');
  const lines = content.split(/\r?\n/);

  let currentSlug = '';
  let cachedNewVotes: number | null = null;
  let cachedNewReviews: number | null = null;

  const newLines = lines.map((line) => {
    // Detect slug
    const slugMatch = line.match(/slug:\s*'([^']+)'/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      cachedNewVotes = null;
      cachedNewReviews = null;
    }

    // Match upvotesCount
    const voteMatch = line.match(/^(\s*upvotesCount:\s*)(\d+)(,?\s*)$/);
    if (voteMatch && currentSlug) {
      const oldVal = parseInt(voteMatch[2], 10);
      const { votes, reviews } = scaleVotes(oldVal, currentSlug);
      cachedNewVotes = votes;
      cachedNewReviews = reviews;
      modifiedCount++;
      return `${voteMatch[1]}${votes}${voteMatch[3]}`;
    }

    // Match reviewsCount
    const reviewMatch = line.match(/^(\s*reviewsCount:\s*)(\d+)(,?\s*)$/);
    if (reviewMatch && currentSlug && cachedNewReviews !== null) {
      return `${reviewMatch[1]}${cachedNewReviews}${reviewMatch[3]}`;
    }

    return line;
  });

  const separator = isCrlf ? '\r\n' : '\n';
  fs.writeFileSync(filePath, newLines.join(separator), 'utf-8');
  console.log(`Successfully processed ${filename}`);
}

console.log(`Total upvotesCount occurrences updated: ${modifiedCount}`);

// Update data/submissions.json
const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
if (fs.existsSync(submissionsPath)) {
  try {
    const raw = fs.readFileSync(submissionsPath, 'utf-8');
    const subs = JSON.parse(raw);
    for (const sub of subs) {
      if (!sub.upvotesCount || sub.upvotesCount > 100) {
        sub.upvotesCount = 24;
      }
    }
    fs.writeFileSync(submissionsPath, JSON.stringify(subs, null, 2), 'utf-8');
    console.log('Updated data/submissions.json upvotes.');
  } catch (e) {
    console.warn(e);
  }
}
