import fs from 'fs';
import path from 'path';

const datasets = [
  { file: './data/coding.mjs', exportName: 'codingExpansion', batch2File: './data/batch2-part1.mjs', batch2Export: 'codingBatch2', outName: 'expansion-coding.ts', varName: 'expansionCodingAgents' },
  { file: './data/autonomous.mjs', exportName: 'autonomousExpansion', batch2File: './data/batch2-part1.mjs', batch2Export: 'autonomousBatch2', outName: 'expansion-autonomous.ts', varName: 'expansionAutonomousAgents' },
  { file: './data/frameworks.mjs', exportName: 'frameworksExpansion', batch2File: './data/batch2-part1.mjs', batch2Export: 'frameworksBatch2', outName: 'expansion-frameworks.ts', varName: 'expansionFrameworksAgents' },
  { file: './data/voice.mjs', exportName: 'voiceExpansion', batch2File: './data/batch2-part2.mjs', batch2Export: 'voiceBatch2', outName: 'expansion-voice.ts', varName: 'expansionVoiceAgents' },
  { file: './data/support.mjs', exportName: 'supportExpansion', batch2File: './data/batch2-part2.mjs', batch2Export: 'supportBatch2', outName: 'expansion-support.ts', varName: 'expansionSupportAgents' },
  { file: './data/sales.mjs', exportName: 'salesExpansion', batch2File: './data/batch2-part2.mjs', batch2Export: 'salesBatch2', outName: 'expansion-sales.ts', varName: 'expansionSalesAgents' },
  { file: './data/research.mjs', exportName: 'researchExpansion', batch2File: './data/batch2-part2.mjs', batch2Export: 'researchBatch2', outName: 'expansion-research.ts', varName: 'expansionResearchAgents' },
  { file: './data/productivity.mjs', exportName: 'productivityExpansion', batch2File: './data/batch2-part3.mjs', batch2Export: 'productivityBatch2', outName: 'expansion-productivity.ts', varName: 'expansionProductivityAgents' },
  { file: './data/workflow.mjs', exportName: 'workflowExpansion', batch2File: './data/batch2-part3.mjs', batch2Export: 'workflowBatch2', outName: 'expansion-workflow.ts', varName: 'expansionWorkflowAgents' },
  { file: './data/creative.mjs', exportName: 'creativeExpansion', batch2File: './data/batch2-part3.mjs', batch2Export: 'creativeBatch2', outName: 'expansion-creative.ts', varName: 'expansionCreativeAgents' }
];

function getScorecard(a) {
  const base = Math.min(9.8, Math.max(8.0, a.overallRating * 2 - 0.5));
  const autonomy = parseFloat(Math.min(9.9, base + ((a.upvotesCount % 5) * 0.1)).toFixed(1));
  const reliability = parseFloat(Math.min(9.9, base - ((a.reviewsCount % 4) * 0.1)).toFixed(1));
  const developerExperience = parseFloat(Math.min(9.9, base + 0.2).toFixed(1));
  const valueForMoney = parseFloat((a.pricingModel === 'free' || a.pricingModel === 'open-source' ? 9.6 : 8.5).toFixed(1));
  const extensibility = parseFloat(Math.min(9.9, base - 0.1).toFixed(1));
  return { autonomy, reliability, developerExperience, valueForMoney, extensibility };
}

async function run() {
  let currentRank = 101;
  let totalBuilt = 0;

  for (const ds of datasets) {
    const mod1 = await import(ds.file);
    const mod2 = await import(ds.batch2File);
    const batch1 = mod1[ds.exportName];
    const batch2 = mod2[ds.batch2Export];
    if (!batch1 || !Array.isArray(batch1)) {
      throw new Error(`Failed to load ${ds.exportName} from ${ds.file}`);
    }
    if (!batch2 || !Array.isArray(batch2)) {
      throw new Error(`Failed to load ${ds.batch2Export} from ${ds.batch2File}`);
    }

    const agents = [...batch1, ...batch2];
    console.log(`Processing ${ds.outName} with ${agents.length} agents (${batch1.length} batch1 + ${batch2.length} batch2)...`);

    let tsContent = `import { Agent } from '../types';\nimport { createAgentFromSpec } from '../editorial-engine';\n\n`;
    tsContent += `export const ${ds.varName}: Agent[] = [\n`;

    for (const a of agents) {
      const id = `agent-${a.slug}`;
      const launchRank = currentRank++;
      const scorecard = a.scorecard || getScorecard(a);

      const spec = {
        id,
        slug: a.slug,
        name: a.name,
        tagline: a.tagline,
        category: a.category,
        categoryLabel: a.categoryLabel,
        pricingModel: a.pricingModel,
        pricingLabel: a.pricingLabel,
        websiteUrl: a.websiteUrl,
        developer: a.developer,
        releaseYear: a.releaseYear,
        primaryModel: a.primaryModel,
        license: a.license,
        upvotesCount: a.upvotesCount,
        overallRating: a.overallRating,
        reviewsCount: a.reviewsCount,
        launchRank,
        featured: a.featured || false,
        trending: a.trending || false,
        tags: a.tags,
        monogram: a.monogram,
        avatarBg: a.avatarBg,
        architectureType: a.architectureType,
        executionSandbox: a.executionSandbox,
        memoryModel: a.memoryModel,
        editorialThesis: a.editorialThesis,
        underTheHoodDetails: a.underTheHoodDetails,
        benchmarks: a.benchmarks || [],
        pricingTiers: a.pricingTiers || [],
        strengths: a.strengths || [],
        limitations: a.limitations || [],
        competitors: a.competitors || [],
        keyCapabilities: a.keyCapabilities || [],
        useCases: a.useCases || [],
        quickstart: a.quickstart || [],
        faqs: a.faqs || [],
        scorecard
      };

      tsContent += `  createAgentFromSpec(${JSON.stringify(spec, null, 4)}),\n`;
      totalBuilt++;
    }

    tsContent += `];\n`;

    const targetPath = path.join('lib', 'data', 'agents', ds.outName);
    fs.writeFileSync(targetPath, tsContent, 'utf8');
    console.log(`Saved ${targetPath} (${agents.length} agents)`);
  }

  console.log(`SUCCESS! Generated all 10 expansion files with ${totalBuilt} total agents.`);
}

run().catch(err => {
  console.error('Build expansion failed:', err);
  process.exit(1);
});
