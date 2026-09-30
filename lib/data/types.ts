export type AgentCategory =
  | 'coding'
  | 'autonomous'
  | 'frameworks'
  | 'voice'
  | 'support'
  | 'sales'
  | 'research'
  | 'productivity'
  | 'workflow'
  | 'creative';

export type PricingModel = 'free' | 'freemium' | 'paid' | 'open-source';

export interface BenchmarkMetric {
  name: string;
  score: string | number;
  baseline?: string | number;
  unit?: string;
  context: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingTier {
  name: string;
  price: string;
  billingPeriod?: string;
  highlighted?: boolean;
  features: string[];
}

export interface EnterpriseUseCase {
  title: string;
  scenario: string;
  implementation: string;
  impact: string;
}

export interface QuickstartStep {
  title: string;
  instructions: string;
  codeSnippet?: string;
  language?: string;
}

export interface CompetitorComparison {
  competitorName: string;
  category: string;
  advantages: string;
  drawbacks: string;
}

export interface AgentScorecard {
  autonomy: number; // 0 - 10
  reliability: number;
  developerExperience: number;
  valueForMoney: number;
  extensibility: number;
}

export interface EditorialReview {
  executiveSummary: string;
  architectureDeepDive: string;
  coreCapabilities: string[];
  enterpriseUseCases: EnterpriseUseCase[];
  quickstartGuide: QuickstartStep[];
  benchmarks: BenchmarkMetric[];
  pricingBreakdown: string;
  pricingTiers: PricingTier[];
  strengths: string[];
  failureModesAndLimitations: string[];
  competitors: CompetitorComparison[];
  faqs: FaqItem[];
  finalVerdict: string;
  scorecard: AgentScorecard;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: AgentCategory;
  categoryLabel: string;
  pricingModel: PricingModel;
  pricingLabel: string;
  websiteUrl: string;
  githubUrl?: string;
  docsUrl?: string;
  developer: string;
  releaseYear: number;
  primaryModel: string;
  license: string;
  upvotesCount: number;
  overallRating: number;
  reviewsCount: number;
  launchRank: number;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
  monogram: string;
  avatarBg: string;
  logoUrl?: string;        // External logo image URL (og:image, favicon, etc.)
  // Detailed technical review exceeding 2,000 words
  editorialReview: EditorialReview;
}

export interface CommunitySubmission {
  agentName: string;
  tagline: string;
  category: AgentCategory;
  pricingModel: PricingModel;
  websiteUrl: string;
  githubUrl?: string;
  description: string;
  submitterHandle?: string;
  logoUrl?: string;
}
