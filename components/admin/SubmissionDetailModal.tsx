'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentSubmissionRecord } from '@/lib/data/submissions';
import { AgentCategory, PricingModel } from '@/lib/data/types';
import { CATEGORIES } from '@/lib/data/agents';

interface SubmissionDetailModalProps {
  submission: AgentSubmissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function SubmissionDetailModal({
  submission,
  isOpen,
  onClose,
  onUpdated,
}: SubmissionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'specs' | 'regenerate'>('review');
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customDirectives, setCustomDirectives] = useState('');
  const [status, setStatus] = useState<AgentSubmissionRecord['status']>(
    submission?.status || 'published'
  );
  const [tagline, setTagline] = useState(submission?.tagline || '');
  const [category, setCategory] = useState<AgentCategory>(
    submission?.category || 'coding'
  );
  const [pricingModel, setPricingModel] = useState<PricingModel>(
    submission?.pricingModel || 'freemium'
  );

  // Sync state when submission prop changes
  if (submission && status !== submission.status && !isSaving && !isRegenerating) {
    setStatus(submission.status);
    setTagline(submission.tagline);
    setCategory(submission.category);
    setPricingModel(submission.pricingModel);
  }

  if (!isOpen || !submission) return null;

  const handleStatusChange = async (newStatus: AgentSubmissionRecord['status']) => {
    setStatus(newStatus);
    try {
      setIsSaving(true);
      await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMetadata = async () => {
    try {
      setIsSaving(true);
      await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tagline,
          category,
          pricingModel,
          status,
        }),
      });
      onUpdated();
      alert('Changes saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateEditorial = async () => {
    if (!confirm(`Are you sure you want to regenerate the 2,000+ words review for ${submission.agentName}?`)) {
      return;
    }

    try {
      setIsRegenerating(true);
      const res = await fetch(`/api/admin/submissions/${submission.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customNotes: customDirectives }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to regenerate editorial review.');
      }

      alert(`Review regenerated successfully! (${data.quality?.wordCount || 0} words)`);
      onUpdated();
      setActiveTab('review');
    } catch (err: any) {
      alert(err.message || 'Error triggering regeneration.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete submission for "${submission.agentName}"?`)) return;

    try {
      setIsSaving(true);
      await fetch(`/api/admin/submissions/${submission.id}`, { method: 'DELETE' });
      onUpdated();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to delete submission.');
    } finally {
      setIsSaving(false);
    }
  };

  const review = submission.editorialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 text-white font-black text-sm flex items-center justify-center shrink-0">
              {submission.agentName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-950">
                  {submission.agentName}
                </h2>
                <Link
                  href={`/agents/${submission.slug}`}
                  target="_blank"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  View Page ↗
                </Link>
              </div>
              <p className="text-xs text-gray-500 truncate max-w-md">
                Submitted by {submission.submitterHandle ? `@${submission.submitterHandle}` : 'anonymous'} • {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Selector Pill */}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              disabled={isSaving}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                status === 'published'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : status === 'flagged'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : status === 'rejected'
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}
            >
              <option value="published">🟢 Published Live</option>
              <option value="pending_review">🔵 Pending Review</option>
              <option value="flagged">🟡 Flagged</option>
              <option value="rejected">🔴 Rejected</option>
            </select>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-gray-200 bg-white flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'review'
                ? 'border-[#FF6154] text-[#FF6154]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Editorial Teardown ({submission.wordCount.toLocaleString()} words)
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[#FF6154] text-[#FF6154]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Metadata &amp; Settings
          </button>
          <button
            onClick={() => setActiveTab('regenerate')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'regenerate'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>⚡ Review Engine Controls</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'review' && (
            <div className="space-y-6 text-sm">
              {/* Word Count Indicator Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-900 text-xs">
                    Content Density Score:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-200/60 font-mono text-xs font-bold text-indigo-950">
                    {submission.wordCount.toLocaleString()} words
                  </span>
                  <span className="text-xs text-indigo-700">
                    (Standard: 1,500+ minimum, 2,000+ target)
                  </span>
                </div>
                <span className="text-xs font-mono text-indigo-600 font-semibold">
                  Source: {submission.source}
                </span>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  1. Executive Summary &amp; Systems Philosophy
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 leading-relaxed font-sans text-xs">
                  {review.executiveSummary}
                </div>
              </div>

              {/* Architecture Deep Dive */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  2. Architectural Teardown &amp; Execution Topology
                </h4>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 whitespace-pre-line leading-relaxed font-sans text-xs">
                  {review.architectureDeepDive}
                </div>
              </div>

              {/* Enterprise Use Cases */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  3. Enterprise Use Cases ({review.enterpriseUseCases?.length || 0})
                </h4>
                <div className="space-y-3">
                  {review.enterpriseUseCases?.map((u, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900">{u.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {u.impact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Scenario:</strong> {u.scenario}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Implementation:</strong> {u.implementation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmarks */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  4. Empirical Benchmarks
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100/70 border-b border-gray-200 font-bold text-gray-700">
                      <tr>
                        <th className="p-2.5">Benchmark Metric</th>
                        <th className="p-2.5">Result</th>
                        <th className="p-2.5">Baseline</th>
                        <th className="p-2.5">Context</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {review.benchmarks?.map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-2.5 font-bold text-gray-900">{b.name}</td>
                          <td className="p-2.5 font-mono text-emerald-600 font-bold">
                            {b.score} {b.unit || ''}
                          </td>
                          <td className="p-2.5 font-mono text-gray-500">
                            {b.baseline ? `${b.baseline} ${b.unit || ''}` : 'N/A'}
                          </td>
                          <td className="p-2.5 text-gray-500 text-[11px]">{b.context}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <h5 className="font-bold text-emerald-900 text-xs uppercase mb-2">
                    Verified Strengths
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {review.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                  <h5 className="font-bold text-amber-900 text-xs uppercase mb-2">
                    Engineering Drawbacks &amp; Bottlenecks
                  </h5>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {review.failureModesAndLimitations?.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">⚠</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  5. Developer Technical FAQs ({review.faqs?.length || 0})
                </h4>
                <div className="space-y-2">
                  {review.faqs?.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-200 bg-gray-50/60">
                      <p className="font-bold text-xs text-gray-900 mb-1">Q: {f.question}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">A: {f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Verdict */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  6. Final Engineering Verdict
                </h4>
                <div className="p-4 rounded-xl bg-gray-950 text-gray-200 text-xs leading-relaxed font-sans">
                  {review.finalVerdict}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154] bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154] bg-white"
                  >
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="open-source">Open Source</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    disabled
                    value={submission.websiteUrl}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    disabled
                    value={submission.githubUrl || 'N/A'}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold transition-colors"
                >
                  Delete Submission
                </button>
                <button
                  type="button"
                  onClick={handleSaveMetadata}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Metadata'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'regenerate' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">
                  ⚡ Automated Editorial Review Regeneration
                </h4>
                <p className="text-indigo-800 leading-relaxed">
                  Trigger an automated review regeneration. The engine will evaluate the codebase, update the architectural analysis, re-run slop and length checks, and update the live page.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5">
                  Admin Custom Directives (Optional)
                </label>
                <textarea
                  rows={4}
                  value={customDirectives}
                  onChange={(e) => setCustomDirectives(e.target.value)}
                  placeholder="e.g. Focus on SWE-bench benchmark scores and compare directly to Devin. Emphasize self-hosted local SQLite sandboxing..."
                  className="w-full p-3.5 border border-gray-200 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="button"
                onClick={handleRegenerateEditorial}
                disabled={isRegenerating}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-xs shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRegenerating && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {isRegenerating
                  ? 'Generating 2,000+ Words Teardown...'
                  : '⚡ Re-generate Technical Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
