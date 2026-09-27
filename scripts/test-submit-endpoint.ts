import { POST } from '../app/api/agents/submit/route';
import { NextRequest } from 'next/server';

async function main() {
  console.log('--- Testing Submit API Route & DeepSeek Pipeline ---');

  const req = new NextRequest('http://localhost:3000/api/agents/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentName: 'AeroWorker',
      tagline: 'Autonomous background execution worker with distributed heartbeat recovery',
      category: 'workflow',
      pricingModel: 'freemium',
      websiteUrl: 'https://aeroworker.io',
      githubUrl: 'https://github.com/aeroworker/core',
      description: 'Distributed execution engine with deterministic task recovery and checkpointing.',
      submitterHandle: 'cloud_architect',
    }),
  });

  const response = await POST(req);
  const data = await response.json();

  console.log('Response Status:', response.status);
  console.log('Response Data:', data);

  if (response.status !== 201 || !data.success || !data.slug) {
    throw new Error('Submit route failed to process submission.');
  }

  console.log('SUCCESS: Submission endpoint executed and auto-published successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
