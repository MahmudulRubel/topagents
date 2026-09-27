import { generateAgentEditorial, verifyEditorialQuality } from '../lib/ai/deepseek';
import { CommunitySubmission } from '../lib/data/types';

async function main() {
  console.log('--- Testing DeepSeek AI Content Engine ---');

  const testSubmission: CommunitySubmission = {
    agentName: 'AutomataCore',
    tagline: 'High-throughput headless browser agent for resilient data workflows',
    category: 'autonomous',
    pricingModel: 'freemium',
    websiteUrl: 'https://automatacore.dev',
    githubUrl: 'https://github.com/automatacore/core',
    description: 'An open-source distributed browser agent optimized for complex multi-page workflows.',
    submitterHandle: 'alex_systems',
  };

  const result = await generateAgentEditorial(testSubmission);
  console.log('Generation Source:', result.source);
  console.log('Quality Check Passed:', result.quality.isValid);
  console.log('Word Count:', result.quality.wordCount);
  console.log('Slop Matches:', result.quality.slopMatches);
  console.log('Missing Fields:', result.quality.missingFields);
  console.log('Errors:', result.quality.errors);

  if (!result.quality.isValid) {
    console.error('FAILED: Quality verification failed.');
    process.exit(1);
  }

  console.log('SUCCESS: DeepSeek AI Content Engine verified.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
