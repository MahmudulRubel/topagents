'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentCategory, PricingModel } from '@/lib/data/types';
import { CATEGORIES } from '@/lib/data/agents';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    agentName: '',
    tagline: '',
    category: 'coding' as AgentCategory,
    pricingModel: 'freemium' as PricingModel,
    websiteUrl: '',
    githubUrl: '',
    description: '',
    submitterHandle: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/agents/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit agent.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to Top 100 Directory
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-3">
          <span>✨ 100% FREE COMMUNITY SUBMISSION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-3">
          Submit Your AI Agent
        </h1>
        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
          Join the most rigorous technical directory of autonomous systems. We never charge builders to list, rank, or verify their agent. Every listing receives a comprehensive 2,000+ words technical architectural profile.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200">
            ✓
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Submission Received!
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            Thank you for submitting <strong className="text-gray-900">{formData.agentName}</strong>. Our engineering editorial board evaluates the codebase, telemetry, and benchmark claims before publishing your full technical profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Return to Directory
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  agentName: '',
                  tagline: '',
                  category: 'coding',
                  pricingModel: 'freemium',
                  websiteUrl: '',
                  githubUrl: '',
                  description: '',
                  submitterHandle: '',
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Submit Another Agent
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Agent Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    required
                    value={formData.agentName}
                    onChange={handleChange}
                    placeholder="e.g. Devin, Cline, MemGPT"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Technical Tagline *
                </label>
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="One concise, technical sentence describing the core engine"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Avoid marketing fluff (&quot;revolutionary&quot;, &quot;game-changer&quot;). State concrete mechanics.
                </p>
              </div>

              {/* Pricing & Submitter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Pricing Model
                  </label>
                  <select
                    name="pricingModel"
                    value={formData.pricingModel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white transition-all"
                  >
                    <option value="open-source">Open Source (Self-Hosted)</option>
                    <option value="freemium">Freemium</option>
                    <option value="free">100% Free</option>
                    <option value="paid">Commercial / Subscription</option>
                    <option value="usage-based">Usage / Token Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Submitter Handle (X or GitHub)
                  </label>
                  <input
                    type="text"
                    name="submitterHandle"
                    value={formData.submitterHandle}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Website or Demo URL *
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    required
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    GitHub / Source Code URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>
              </div>

              {/* Architecture & Engineering notes */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  System Architecture &amp; Benchmarks (Optional)
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell our editorial team about your context management strategy, sandbox isolation, LLM routing logic, or SWE-bench scores."
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting to Editorial Board...' : 'Submit Agent (100% Free) →'}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Editorial Standards & Live Preview */}
          <div className="space-y-6">
            {/* Live Preview Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Live Directory Preview
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    {formData.agentName ? formData.agentName.substring(0, 2).toUpperCase() : 'AG'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">
                        {formData.agentName || 'Agent Name'}
                      </span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-gray-200 text-gray-700">
                        {formData.pricingModel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {formData.tagline || 'Your concrete technical tagline will display here.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Board Checklist */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs space-y-3">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider">
                Editorial Review Criteria
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Working Prototype:</strong> A verifiable demo, hosted web app, or public CLI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Architecture Disclosure:</strong> Information regarding context windows, tool-use protocols, and model backbones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero AI Slop:</strong> We reject empty marketing superlatives in favor of empirical benchmarks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Free Placement:</strong> All agents are ranked purely on community upvotes and editorial scores.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
