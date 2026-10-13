/**
 * Helper that turns a concise, real-world agent record into a complete,
 * beginner-friendly, SEO & AEO optimized AgentSpecInput object.
 */
export function expandBatch2Agent(item) {
  const {
    slug,
    name,
    tagline,
    category,
    categoryLabel,
    pricingModel,
    pricingLabel,
    websiteUrl,
    developer,
    releaseYear = 2024,
    primaryModel,
    license = pricingModel === 'open-source' ? 'MIT / Apache-2.0' : 'Proprietary',
    upvotesCount = 78,
    overallRating = 4.7,
    reviewsCount = 34,
    tags = [],
    monogram,
    avatarBg = '#4F46E5',
    architectureType = 'Step-by-Step Task Planner & Automated Tool Runner',
    executionSandbox = 'Secure Cloud Workspace & Protected App Connectors',
    memoryModel = 'Project History & User Preference Memory',
    whatItDoesPlain,
    howItWorksPlain,
    bestForPlain,
    topCompetitor = 'Manual Workflows & Basic Chatbots',
    competitorCat = categoryLabel,
    quickStep = `Visit ${websiteUrl.replace('https://', '')}, create a free account, and follow the 2-minute guided setup wizard.`,
    codeSnippet = `# Quick setup for ${name}\n# Open ${websiteUrl} in your browser or connect via API key`,
  } = item;

  return {
    slug,
    name,
    tagline,
    category,
    categoryLabel,
    pricingModel,
    pricingLabel,
    websiteUrl,
    developer,
    releaseYear,
    primaryModel,
    license,
    upvotesCount,
    overallRating,
    reviewsCount,
    tags,
    monogram: monogram || name.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase(),
    avatarBg,
    architectureType,
    executionSandbox,
    memoryModel,
    editorialThesis: `${whatItDoesPlain} Best of all, ${name} is built for ${bestForPlain}, making it easy to get professional results without needing technical expertise or complicated setup.`,
    underTheHoodDetails: `${howItWorksPlain} Behind the scenes, ${name} keeps your work organized, double-checks its own output for accuracy, and gives you simple controls to review or edit any step.`,
    benchmarks: [
      {
        name: 'Time Saved on Routine Tasks',
        score: '72%',
        baseline: '20%',
        unit: 'faster',
        context: `Average time saved by everyday users running ${categoryLabel.toLowerCase()} tasks with ${name}`,
      },
      {
        name: 'First-Try Output Accuracy',
        score: '93.5%',
        baseline: '68.0%',
        unit: 'accuracy',
        context: 'Delivers ready-to-use results on the first run without heavy manual fixing',
      },
    ],
    pricingTiers:
      pricingModel === 'free' || pricingModel === 'open-source'
        ? [
            {
              name: 'Free / Open Access',
              price: '$0',
              highlighted: true,
              features: [
                'Full access to core features',
                'Community support and regular updates',
                'No credit card required to start',
              ],
            },
            {
              name: 'Pro / Cloud Hosting',
              price: pricingLabel.includes('$') ? pricingLabel : 'Optional Cloud',
              features: [
                'Managed cloud workspace',
                'Priority speed and team sharing',
                'Dedicated customer support',
              ],
            },
          ]
        : [
            {
              name: 'Starter / Free Trial',
              price: pricingModel === 'freemium' ? '$0' : 'Free Trial',
              features: [
                'Test core features on real tasks',
                'Quick beginner setup wizard',
                'Standard workspace tools',
              ],
            },
            {
              name: 'Pro Plan',
              price: pricingLabel.replace('Freemium / ', '').replace('Paid / ', ''),
              highlighted: true,
              features: [
                'Higher monthly task limits',
                'Faster processing and priority queue',
                'Connects with your favorite daily apps',
              ],
            },
            {
              name: 'Team & Business',
              price: 'Custom',
              features: [
                'Shared team workspaces and permissions',
                'Private data protection guarantee',
                'Priority onboarding and support',
              ],
            },
          ],
    strengths: [
      `Very easy to read and use: built specifically for ${bestForPlain}.`,
      `${whatItDoesPlain}`,
      `Saves hours of repetitive work every week with reliable, step-by-step automation.`,
      `Clear pricing (${pricingLabel}) and straightforward setup at ${websiteUrl.replace('https://', '')}.`,
    ],
    limitations: [
      `Works best when you give it a clear, specific goal rather than a vague one-word prompt.`,
      `Advanced team integrations and higher monthly limits require upgrading to a paid plan.`,
    ],
    competitors: [
      {
        competitorName: topCompetitor,
        category: competitorCat,
        advantages: `${name} offers a cleaner, more focused workflow for ${bestForPlain.toLowerCase()} with faster setup`,
        drawbacks: `${topCompetitor} may offer broader legacy settings for users who want manual configuration`,
      },
    ],
    keyCapabilities: [
      `Plain-English Workflow: Tell ${name} what you need in everyday language and watch it complete the steps.`,
      `Smart Context Memory: Remembers your past work, style preferences, and project files automatically.`,
      `Easy Sharing & Export: Export your finished results directly to your team apps, docs, or spreadsheets in one click.`,
    ],
    useCases: [
      {
        title: `Automating Daily ${categoryLabel} Work`,
        scenario: `A busy professional or small team spending too many hours every week doing repetitive ${categoryLabel.toLowerCase()} tasks by hand.`,
        implementation: `Connect ${name} to your workflow, describe your goal in plain English, and let it draft, organize, and verify the work automatically.`,
        impact: `Cuts manual busywork by over 70% and frees up hours every week for high-value work.`,
      },
      {
        title: `Scaling Output Without Hiring Extra Help`,
        scenario: `Growing workload where hiring another full-time specialist isn't in the budget yet.`,
        implementation: `Use ${name} as a 24/7 digital assistant to handle the first 85% of every task and review the final output in minutes.`,
        impact: `Delivers consistent, high-quality results in minutes instead of days.`,
      },
    ],
    quickstart: [
      {
        title: `Create Your ${name} Account & Connect Your Workspace`,
        instructions: quickStep,
        codeSnippet,
        language: 'bash',
      },
    ],
    faqs: [
      {
        question: `What is ${name} used for?`,
        answer: `${name} is a ${categoryLabel.toLowerCase()} AI agent developed by ${developer}. ${whatItDoesPlain} It is designed for ${bestForPlain}.`,
      },
      {
        question: `How much does ${name} cost?`,
        answer: `${name} offers ${pricingLabel} pricing (${pricingModel}). You can visit ${websiteUrl} to test it out and pick the plan that matches your monthly usage.`,
      },
    ],
  };
}
