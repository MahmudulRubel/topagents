'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentCategory, PricingModel } from '@/lib/data/types';

interface SubmitAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitAgentModal({ isOpen, onClose }: SubmitAgentModalProps) {
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
  const [submissionResult, setSubmissionResult] = useState<{
    slug?: string;
    status?: string;
    wordCount?: number;
    message?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

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

      setSubmissionResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmissionResult(null);
    setErrorMessage('');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                Submit Your AI Agent
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% Free
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Powered by DeepSeek AI for instant 2,000+ words technical reviews &amp; auto-publishing.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {submissionResult ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {submissionResult.status === 'published'
                ? 'Agent Published Live!'
                : 'Agent Submitted for Review!'}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
              {submissionResult.message}
            </p>
            {submissionResult.wordCount && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-6">
                <span>⚡ DeepSeek AI Technical Review:</span>
                <strong>{submissionResult.wordCount.toLocaleString()} words</strong>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {submissionResult.slug && (
                <Link
                  href={`/agents/${submissionResult.slug}`}
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-all shadow-sm"
                >
                  View Live Profile →
                </Link>
              )}
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Back to Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Agent Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="agentName"
                  required
                  value={formData.agentName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Code Agent"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Primary Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white"
                >
                  <option value="coding">Coding &amp; Engineering</option>
                  <option value="autonomous">Browser &amp; Autonomous</option>
                  <option value="frameworks">Multi-Agent Frameworks</option>
                  <option value="voice">Voice &amp; Phone Agents</option>
                  <option value="support">Customer Support &amp; CX</option>
                  <option value="sales">Sales &amp; SDR Agents</option>
                  <option value="research">Research &amp; Deep Search</option>
                  <option value="productivity">Meeting &amp; Productivity</option>
                  <option value="workflow">Workflow &amp; Automation</option>
                  <option value="creative">Creative &amp; Media</option>
                </select>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                One-Line Tagline *
              </label>
              <input
                type="text"
                name="tagline"
                required
                maxLength={140}
                value={formData.tagline}
                onChange={handleChange}
                placeholder="What does your agent do in 1 sentence? (max 140 chars)"
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Official Website URL *
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  required
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://youragent.com"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>

              {/* Pricing Model */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Pricing Model *
                </label>
                <select
                  name="pricingModel"
                  value={formData.pricingModel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white"
                >
                  <option value="free">100% Free</option>
                  <option value="open-source">Open Source</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid / Commercial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub URL (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  GitHub / Docs URL (Optional)
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/your-repo"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>

              {/* Submitter Handle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Founder / Maker Handle (Optional)
                </label>
                <input
                  type="text"
                  name="submitterHandle"
                  value={formData.submitterHandle}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Detailed Technical Overview *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your agent’s architecture, LLM models, sandboxing, and primary use cases..."
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                ⚡ Automatically analyzed by DeepSeek AI
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {isSubmitting ? 'DeepSeek Generating Review...' : 'Submit & Auto-Publish'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
