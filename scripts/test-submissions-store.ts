import {
  saveSubmission,
  getSubmissionById,
  getSubmissionBySlug,
  listSubmissions,
  updateSubmission,
  deleteSubmission,
  AgentSubmissionRecord,
} from '../lib/data/submissions';

async function main() {
  console.log('--- Testing Submissions Storage Layer ---');

  const testId = `test_sub_${Date.now()}`;
  const testRecord: AgentSubmissionRecord = {
    id: testId,
    slug: 'nexus-flow',
    agentName: 'NexusFlow',
    tagline: 'Deterministic multi-agent workflow orchestration with distributed checkpointing',
    category: 'workflow',
    pricingModel: 'open-source',
    websiteUrl: 'https://nexusflow.io',
    githubUrl: 'https://github.com/nexusflow/nexusflow',
    submitterHandle: 'system_builder',
    status: 'published',
    source: 'fallback-engine',
    wordCount: 1450,
    editorialData: {
      executiveSummary: 'NexusFlow is a distributed workflow orchestrator...',
      architectureDeepDive: 'Layered state machine architecture...',
      coreCapabilities: ['Checkpointing', 'Fault tolerance'],
      enterpriseUseCases: [],
      quickstartGuide: [],
      benchmarks: [],
      pricingBreakdown: 'MIT licensed with zero seat fees.',
      pricingTiers: [],
      strengths: ['Resilient', 'Fast'],
      failureModesAndLimitations: ['Memory bound under heavy load'],
      competitors: [],
      faqs: [],
      finalVerdict: 'Recommended for enterprise orchestrations.',
      scorecard: {
        autonomy: 9,
        reliability: 9,
        developerExperience: 8.5,
        valueForMoney: 10,
        extensibility: 9,
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Save
  await saveSubmission(testRecord);
  console.log('1. Saved test submission');

  // 2. Read by ID
  const retrieved = await getSubmissionById(testId);
  if (!retrieved || retrieved.agentName !== 'NexusFlow') {
    throw new Error('Failed to retrieve submission by ID');
  }
  console.log('2. Retrieved by ID:', retrieved.id);

  // 3. Read by Slug
  const bySlug = await getSubmissionBySlug('nexus-flow');
  if (!bySlug) {
    throw new Error('Failed to retrieve submission by Slug');
  }
  console.log('3. Retrieved by Slug:', bySlug.slug);

  // 4. Update
  const updated = await updateSubmission(testId, { status: 'flagged' });
  if (updated?.status !== 'flagged') {
    throw new Error('Failed to update submission status');
  }
  console.log('4. Updated status to flagged');

  // 5. List
  const list = await listSubmissions('all');
  console.log('5. Listed submissions count:', list.length);

  // 6. Delete
  await deleteSubmission(testId);
  const deletedCheck = await getSubmissionById(testId);
  if (deletedCheck !== null) {
    throw new Error('Submission was not deleted successfully');
  }
  console.log('6. Deleted test submission successfully');

  console.log('SUCCESS: All Submissions Storage operations verified!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
