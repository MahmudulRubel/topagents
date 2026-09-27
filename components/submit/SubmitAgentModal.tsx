'use client';

import { useState } from 'react';
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
  const [isSuccess, setIsSuccess] = useState(false);
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

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
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
              List your autonomous AI agent on topagents.lol for community discovery and upvoting.
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
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Agent Submitted Successfully!
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              Thank you for contributing <strong>{formData.agentName}</strong> to the directory. Your agent has been queued for immediate community review and indexing.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Back to Directory
            </button>
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
                  <option value="coding">Coding & Engineering</option>
                  <option value="autonomous">Browser & Autonomous</option>
                  <option value="frameworks">Multi-Agent Frameworks</option>
                  <option value="voice">Voice & Phone Agents</option>
                  <option value="support">Customer Support & CX</option>
                  <option value="sales">Sales & SDR Agents</option>
                  <option value="research">Research & Deep Search</option>
                  <option value="productivity">Meeting & Productivity</option>
                  <option value="workflow">Workflow & Automation</option>
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

            {/* Live Card Preview */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Live Directory Preview
              </span>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {formData.agentName ? formData.agentName.slice(0, 2).toUpperCase() : 'AI'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 truncate">
                        {formData.agentName || 'Agent Name'}
                      </span>
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {formData.pricingModel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {formData.tagline || 'Your punchy one-line tagline will appear here.'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center w-10 h-12 rounded border border-gray-200 bg-white text-gray-400 text-xs">
                  <span>▲</span>
                  <span className="font-mono text-[10px] font-bold text-gray-700">1</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
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
                className="px-5 py-2 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Agent (Free)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
