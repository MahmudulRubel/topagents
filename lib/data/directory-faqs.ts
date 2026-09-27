export interface DirectoryFaqItem {
  question: string;
  answer: string;
}

export const DIRECTORY_HOMEPAGE_FAQS: DirectoryFaqItem[] = [
  {
    question: 'What is an autonomous AI agent?',
    answer:
      'An autonomous AI agent is a software system powered by large language models that independently pursues multi-step objectives through reasoning loops (such as ReAct), tool invocation (bash, web browsers, databases, and APIs), persistent memory stores, and self-healing error recovery without requiring step-by-step human intervention.',
  },
  {
    question: 'How does topagents.lol evaluate and benchmark AI agents?',
    answer:
      'We evaluate autonomous agents across five foundational criteria: Autonomy & Self-Healing (0-10), Reliability & Sandboxing (0-10), Developer Experience (0-10), Value for Money (0-10), and empirical benchmarks including SWE-bench Verified, GAIA, HumanEval, and real-world task resolution metrics.',
  },
  {
    question: 'What is the difference between an AI copilot and an autonomous AI agent?',
    answer:
      'An AI copilot (like code completion) functions as a reactive assistant requiring continuous human steering at each line. An autonomous AI agent receives a high-level objective (e.g., "reproduce bug #204, write a patch, run tests, and open a PR"), plans an execution path, runs terminal commands, inspects logs, and delivers the finished artifact autonomously.',
  },
  {
    question: 'How does the community upvoting and ranking algorithm work?',
    answer:
      'Rankings reflect a transparent combination of organic community upvotes, verified benchmark performance, and technical review scores. We prevent bot voting through viewport anti-cheat heuristics and local storage deduplication, ensuring that genuinely superior engineering ranks highest.',
  },
  {
    question: 'Can developers list their AI agents on topagents.lol for free?',
    answer:
      'Yes. topagents.lol maintains a 100% free community listing guarantee for all AI agent builders, founders, and open-source maintainers. There are no fees to submit, gain community upvotes, or be included in our machine-readable AI context feeds (llms.txt).',
  },
];
