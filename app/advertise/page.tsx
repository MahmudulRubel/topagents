import { Metadata } from 'next';
import Link from 'next/link';
import AdvertiseForm from './AdvertiseForm';

export const metadata: Metadata = {
  title: 'Advertise & Sponsor | Reach 50,000+ AI Builders | topagents.lol',
  description:
    'Put your AI agent, developer tool, or API in front of 50,000+ engineers, researchers, and technical founders actively discovering autonomous software.',
  openGraph: {
    title: 'Advertise & Sponsor topagents.lol',
    description:
      'Reach 50,000+ monthly AI engineers, enterprise architects, and autonomous system builders.',
    url: 'https://topagents.lol/advertise',
    siteName: 'topagents.lol',
  },
};

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">Advertise</span>
      </nav>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF6154] mb-4">
          <span>📢 PARTNER WITH TOPAGENTS.LOL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6154] animate-ping" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4">
          Put Your AI Agent in Front of
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6154] via-rose-600 to-indigo-600">
            50,000+ Builders &amp; Decision Makers.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
          The definitive discovery hub for autonomous software. Reach software engineers, ML researchers,
          CTOs, and founders who discover, evaluate, and adopt AI tools daily.
        </p>

        {/* Audience Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center">
          <div className="p-2">
            <div className="text-2xl font-black text-slate-950 font-mono">50K+</div>
            <div className="text-xs text-slate-500 font-medium">Monthly Active Builders</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-slate-950 font-mono">85%</div>
            <div className="text-xs text-slate-500 font-medium">Developers &amp; Technical Leads</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-emerald-600 font-mono">&lt; 12h</div>
            <div className="text-xs text-slate-500 font-medium">Guaranteed Activation</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-black text-[#FF6154] font-mono">$49</div>
            <div className="text-xs text-slate-500 font-medium">Starting / Month</div>
          </div>
        </div>
      </section>

      {/* Main 2-Column: Tiers & Instant Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        {/* Left Column: Placement Tiers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 tracking-tight mb-2">
              Sponsorship Placements
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent pricing with high-impact visibility across both desktop sidebars and mobile feeds.
            </p>
          </div>

          {/* Tier 1: 1-Month Launch */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Starter Tier
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  1-Month Launch
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-950 font-mono">$49</span>
                <span className="text-[10px] text-slate-400 block">/ month</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Perfect for new product releases, open-source launches, and beta waitlists needing immediate developer attention.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dedicated Side Rail Sponsor Slot (Desktop &amp; Mobile)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Custom tagline, high-res icon, and direct referral link</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dofollow SEO backlink to boost search authority</span>
              </li>
            </ul>
          </div>

          {/* Tier 2: 2-Month Momentum (Featured) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-orange-50/20 border-2 border-orange-200 shadow-xs relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FF6154] text-white shadow-xs">
              Most Popular
            </span>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  High Momentum
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  2-Month Growth Campaign
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-950 font-mono">$89</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Save 10%</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Sustained multi-month visibility to build genuine brand awareness and continuous conversion velocity.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>All 1-Month benefits across 60 consecutive days</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Top-half priority rail rotation for higher impression share</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Full copy and URL changes permitted mid-campaign</span>
              </li>
            </ul>
          </div>

          {/* Tier 3: 3-Month Partner */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Best Value
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  3-Month Partner Spotlight
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-950 font-mono">$149</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Save 25%</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Maximum sustained visibility for scaling SaaS tools, developer APIs, and established autonomous agent frameworks.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Full 90 days of persistent desktop &amp; mobile placement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Guaranteed in-depth 2,000+ word technical editorial review</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Permanent profile entry in the topagents.lol directory</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Instant Booking Form (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6154] block mb-1">
                Instant Reservation
              </span>
              <h3 className="text-lg font-bold text-slate-950">
                Book Your Ad Placement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lock in your spot today. No payment required until your copy &amp; assets are approved.
              </p>
            </div>

            <AdvertiseForm />
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="border-t border-slate-200 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Everything you need to know about sponsoring on topagents.lol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-xs leading-relaxed text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              How fast does my sponsor slot go live?
            </h4>
            <p>
              Once you submit your inquiry, our team reviews your agent details within 12 hours. Upon asset confirmation and payment link completion, your card goes live immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              What types of products are accepted?
            </h4>
            <p>
              We welcome AI agents, agentic developer frameworks, LLM infrastructure, workflow automation platforms, AI coding engines, and developer APIs. We reject misleading or synthetic slop.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Can I change my copy or URL during the campaign?
            </h4>
            <p>
              Yes! You can reply to your confirmation thread at any time with updated taglines, links, or UTM parameters, and we will update your live card within 6 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              What payment methods do you support?
            </h4>
            <p>
              We support all major credit cards, Apple Pay, Google Pay, Stripe, Creem, and direct ACH/wire transfers with formal VAT-compliant invoices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
