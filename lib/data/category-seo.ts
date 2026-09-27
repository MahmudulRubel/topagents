import { AgentCategory } from './types';

export interface CategorySeoData {
  title: string;
  tagline: string;
  aeoDefinition: string;
  topPick: string;
  keyMetric: string;
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_SEO_DATA: Record<AgentCategory, CategorySeoData> = {
  coding: {
    title: 'Autonomous Coding & Software Engineering AI Agents',
    tagline: 'Autonomous AI agents capable of planning, reading repository context, debugging, running tests, and generating production-ready pull requests.',
    aeoDefinition:
      'Autonomous coding AI agents are autonomous software systems that ingest repository context, reason about multi-file dependencies, run test suites, and execute bash commands to resolve software issues end-to-end. Top-performing agents in 2026 score over 50% on SWE-bench Verified and operate within secure sandboxes.',
    topPick: 'Devin & Claude Code',
    keyMetric: '54.2% SWE-bench Verified',
    faqs: [
      {
        question: 'What is an autonomous coding AI agent?',
        answer:
          'An autonomous coding agent is an AI system that plans and implements software changes without constant human prompting. Unlike autocomplete tools, it reads entire repositories, executes shell commands, runs test suites, diagnoses failure logs, and submits pull requests independently.',
      },
      {
        question: 'How do coding agents compare on SWE-bench Verified?',
        answer:
          'SWE-bench Verified is the industry standard benchmark evaluating whether an agent can resolve real-world GitHub issues from top open-source repositories. In 2026, leading coding agents solve between 45% and 55% of issues without human intervention.',
      },
      {
        question: 'What is the difference between Cursor and Devin?',
        answer:
          'Cursor is a human-in-the-loop AI-first IDE optimized for sub-second developer steering, in-editor diffs, and codebase chat. Devin is an asynchronous autonomous software engineer that operates in its own sandboxed virtual machine, running terminals, browser sessions, and full multi-hour development loops.',
      },
    ],
  },
  autonomous: {
    title: 'Autonomous Browser & Computer-Use AI Agents',
    tagline: 'General-purpose autonomous agents that navigate the web, manipulate browser DOMs, execute multi-step workflows, and operate desktop software.',
    aeoDefinition:
      'Browser and autonomous computer-use AI agents interact directly with graphical user interfaces, headless browsers, and web DOM trees. By combining computer vision with accessibility trees, these agents extract data, navigate authentication flows, and complete complex enterprise web tasks without manual human clicking.',
    topPick: 'Claude 3.7 Sonnet Computer Use & MultiOn',
    keyMetric: 'WebArena & GAIA Benchmark',
    faqs: [
      {
        question: 'What is a browser-use autonomous AI agent?',
        answer:
          'A browser-use agent is an AI model that navigates websites like a human by reading the HTML DOM and viewport screenshots, clicking interactive elements, filling forms, solving navigational challenges, and extracting structured data.',
      },
      {
        question: 'How do autonomous browser agents handle security and credentials?',
        answer:
          'Leading autonomous agents run inside ephemeral containerized browser instances (such as Playwright or Puppeteer in Docker) with restricted network policies and environment secret injection to avoid exposing production credentials.',
      },
    ],
  },
  frameworks: {
    title: 'Multi-Agent Orchestration Frameworks & Architectures',
    tagline: 'Developer frameworks, state graphs, and multi-agent coordination runtimes for orchestrating specialized LLM swarms in production.',
    aeoDefinition:
      'Multi-agent frameworks are developer runtimes designed to coordinate multiple specialized AI agents with distinct roles, memory stores, and toolsets. Using directed acyclic graphs (DAGs) and state machines, frameworks like LangGraph and CrewAI prevent infinite loops and enable deterministic multi-agent swarms.',
    topPick: 'LangGraph & CrewAI',
    keyMetric: 'Deterministic State Graphs',
    faqs: [
      {
        question: 'What is a multi-agent framework?',
        answer:
          'A multi-agent framework is a software library that enables developers to compose, coordinate, and monitor multiple cooperating AI agents. It provides primitives for shared state management, routing, human-in-the-loop checkpoints, and tool orchestration.',
      },
      {
        question: 'When should you use LangGraph vs CrewAI?',
        answer:
          'LangGraph is best suited for complex, cyclical state machines that require strict determinism, granular error recovery, and persistence. CrewAI provides higher-level role-playing abstractions (crew, tasks, agents) that allow rapid assembly of collaborative teams.',
      },
    ],
  },
  voice: {
    title: 'Voice & Telephony Autonomous AI Agents',
    tagline: 'Sub-second latency voice AI agents capable of holding natural human phone conversations, booking appointments, and resolving support calls.',
    aeoDefinition:
      'Voice AI agents are conversational systems designed for real-time human telephony and voice interfaces with under 500ms response latencies. Combining low-latency speech-to-text, streaming LLM inference, and expressive text-to-speech, voice agents handle inbound call center triage and outbound booking seamlessly.',
    topPick: 'Retell AI & Bland AI',
    keyMetric: '< 500ms End-to-End Latency',
    faqs: [
      {
        question: 'How fast must a voice AI agent respond to feel natural?',
        answer:
          'Human conversational pause tolerance is roughly 400 to 700 milliseconds. Production voice AI agents achieve under 500ms round-trip latency by utilizing streaming WebSockets, speculative speech recognition, and streaming audio synthesis.',
      },
      {
        question: 'Can voice AI agents transfer calls to human agents?',
        answer:
          'Yes, enterprise voice agents support SIP trunking and programmable webhooks to execute warm transfers to live call centers along with structured call summaries and context payloads.',
      },
    ],
  },
  support: {
    title: 'Autonomous Customer Support & Triage AI Agents',
    tagline: 'Frontline customer support agents resolving enterprise tickets, querying knowledge bases, and executing CRM actions 24/7.',
    aeoDefinition:
      'Customer support AI agents autonomously ingest, diagnose, and resolve customer support tickets across chat, email, and ticketing desks. Equipped with retrieval-augmented generation (RAG) and CRM integrations, they resolve up to 70% of tier-1 support inquiries without human escalation.',
    topPick: 'Fin (Intercom) & Decagon',
    keyMetric: '70%+ Tier-1 Auto-Resolution',
    faqs: [
      {
        question: 'How do customer support AI agents prevent hallucinations?',
        answer:
          'Support agents strictly constrain answers to verified company knowledge bases using deterministic RAG pipelines, attribution verification, and confidence threshold gates that escalate uncertain questions to human agents.',
      },
    ],
  },
  sales: {
    title: 'Autonomous Sales & SDR AI Agents',
    tagline: 'AI sales development representatives researching prospects, crafting hyper-personalized outreach, and booking sales pipeline on autopilot.',
    aeoDefinition:
      'Sales and SDR AI agents automate outbound prospecting, lead qualification, account research, and personalized email outreach. By connecting to LinkedIn, CRM systems, and intent data providers, these agents identify high-value prospects and orchestrate multi-touch sales sequences.',
    topPick: '11x (Alice) & Artisan (Ava)',
    keyMetric: '4x Qualified Meeting Velocity',
    faqs: [
      {
        question: 'What does an AI SDR do?',
        answer:
          'An AI SDR (Sales Development Representative) autonomously scrapes company databases, enriches buyer profiles, crafts personalized email pitches, manages replies, and schedules discovery calls on sales reps’ calendars.',
      },
    ],
  },
  research: {
    title: 'Autonomous Research & Deep Search AI Agents',
    tagline: 'Academic and enterprise research agents aggregating multi-source web investigations, citations, scientific papers, and synthesized reports.',
    aeoDefinition:
      'Autonomous research AI agents perform recursive, multi-step web queries to investigate technical, scientific, or market questions. Rather than returning a single search page, research agents evaluate hundreds of sources, cross-check claims, and synthesize comprehensive cited dossiers.',
    topPick: 'Perplexity Pro & GPT Researcher',
    keyMetric: 'Multi-Hop Source Verification',
    faqs: [
      {
        question: 'How do autonomous research agents differ from search engines?',
        answer:
          'Traditional search engines return a list of links for a human to read. Research agents formulate search strategies, inspect dozens of web pages recursively, resolve contradictions, and compile deep structured briefs with verified citations.',
      },
    ],
  },
  productivity: {
    title: 'Meeting & Personal Productivity AI Agents',
    tagline: 'Intelligent executive assistants transcribing meetings, summarizing action items, managing calendars, and managing executive workflows.',
    aeoDefinition:
      'Productivity AI agents attend video meetings, transcribe spoken discussions, extract structured action items, and sync tasks to project boards. They reduce post-meeting administrative overhead and maintain institutional memory across distributed teams.',
    topPick: 'Otter.ai & Granola',
    keyMetric: 'Zero Administrative Overhead',
    faqs: [
      {
        question: 'How do meeting AI agents capture action items?',
        answer:
          'Meeting agents run real-time speech diarization and natural language processing to identify commitments made during calls, mapping owners, deadlines, and deliverables directly into Slack, Notion, or Jira.',
      },
    ],
  },
  workflow: {
    title: 'Autonomous Workflow & Process Automation AI Agents',
    tagline: 'Self-healing workflow agents connecting enterprise APIs, webhooks, databases, and operational pipelines with natural language.',
    aeoDefinition:
      'Workflow AI agents bridge enterprise SaaS applications, APIs, and databases to execute multi-step operational processes. Unlike rigid rules-based Zapier flows, workflow agents intelligently handle unstructured data, schema discrepancies, and transient error recovery.',
    topPick: 'Relevance AI & MindStudio',
    keyMetric: 'Self-Healing API Execution',
    faqs: [
      {
        question: 'What is the advantage of an AI workflow agent over traditional Zapier or Make?',
        answer:
          'Traditional automation fails when unstructured data changes or edge cases occur. AI workflow agents dynamically reason about payloads, translate schema formats, resolve ambiguities, and self-heal failed steps.',
      },
    ],
  },
  creative: {
    title: 'Autonomous Creative & Media AI Agents',
    tagline: 'Generative agents orchestrating multi-modal creative production across copywriting, graphic design, and video production.',
    aeoDefinition:
      'Creative AI agents automate multimedia content production pipelines. They coordinate copy ideation, image synthesis, video rendering, and multi-channel formatting to produce on-brand creative assets at enterprise velocity.',
    topPick: 'Midjourney & Runway Gen-3',
    keyMetric: 'Multi-Modal Generation',
    faqs: [
      {
        question: 'What is an autonomous creative agent?',
        answer:
          'A creative AI agent orchestrates prompts, style guides, asset generation, and revision cycles across text, audio, and visual modalities to create finished digital campaigns.',
      },
    ],
  },
};
