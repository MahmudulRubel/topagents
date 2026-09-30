'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentCategory, PricingModel } from '@/lib/data/types';

interface SubmitAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'url' | 'review' | 'done';

const CATEGORIES: { id: AgentCategory; label: string }[] = [
  { id: 'coding',       label: '💻 Coding & Engineering' },
  { id: 'autonomous',   label: '🌐 Browser & Autonomous' },
  { id: 'frameworks',   label: '🔗 Multi-Agent Frameworks' },
  { id: 'voice',        label: '🎙️ Voice & Phone' },
  { id: 'support',      label: '🎧 Customer Support' },
  { id: 'sales',        label: '📈 Sales & SDR' },
  { id: 'research',     label: '🔬 Research & Search' },
  { id: 'productivity', label: '📅 Productivity' },
  { id: 'workflow',     label: '⚡ Workflow & Automation' },
  { id: 'creative',     label: '🎨 Creative & Media' },
];

export default function SubmitAgentModal({ isOpen, onClose }: SubmitAgentModalProps) {
  const [step, setStep] = useState<Step>('url');
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const [agentName, setAgentName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<AgentCategory>('coding');
  const [pricingModel, setPricingModel] = useState<PricingModel>('freemium');
  const [githubUrl, setGithubUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [fullText, setFullText] = useState('');
  const [submitterHandle, setSubmitterHandle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState<{ slug?: string; status?: string; wordCount?: number; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setStep('url'); setUrl(''); setScrapeError(''); setAgentName('');
    setTagline(''); setCategory('coding'); setPricingModel('freemium');
    setGithubUrl(''); setLogoUrl(''); setFullText(''); setSubmitterHandle('');
    setIsSubmitting(false); setSubmitError(''); setResult(null);
    onClose();
  };

  // ── Step 1: Scrape ──────────────────────────────────────────────────────────
  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setScrapeError('');
    setIsScraping(true);
    try {
      const res = await fetch('/api/agents/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not analyze URL.');

      setAgentName(data.name || '');
      setTagline(data.tagline || '');
      setCategory(data.categoryHint || 'coding');
      setPricingModel(data.pricingHint || 'freemium');
      setGithubUrl(data.githubUrl || '');
      setLogoUrl(data.logoUrl || '');
      setFullText(data.fullText || '');
      setStep('review');
    } catch (err: any) {
      setScrapeError(err.message || 'Failed to analyze the URL.');
    } finally {
      setIsScraping(false);
    }
  };

  // ── Step 2: Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/agents/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName, tagline, category, pricingModel,
          websiteUrl: url, githubUrl,
          logoUrl,
          description: fullText,
          submitterHandle,
          autoMode: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setResult(data);
      setStep('done');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">Submit Your AI Agent</h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Free
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {step === 'url' && 'Paste your URL — AI fills everything else.'}
              {step === 'review' && 'Review AI-detected details, then publish.'}
              {step === 'done' && 'Published! Your agent is live.'}
            </p>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            ✕
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center gap-3 px-6 pt-4 pb-0">
            {(['url', 'review'] as const).map((s, i) => {
              const active = step === s;
              const done = step === 'review' && s === 'url';
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#FF6154] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 'url' ? 'Paste URL' : 'Confirm & Publish'}
                  </span>
                  {i === 0 && <span className="text-gray-300 text-xs mx-1">›</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── STEP 1: URL ── */}
        {step === 'url' && (
          <form onSubmit={handleScrape} className="p-6 space-y-4">
            {scrapeError && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                {scrapeError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Agent Website URL *
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youragent.ai"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 leading-relaxed">
              <strong className="block text-indigo-900 mb-0.5">⚡ URL-Only Submission</strong>
              We scrape your site, auto-detect the agent's name, category &amp; pricing, generate a 2,000+ word technical review, and publish instantly if criteria are met.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScraping}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-sm font-black transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isScraping ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Analyzing URL...
                  </>
                ) : 'Analyze URL →'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: Review ── */}
        {step === 'review' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* AI filled banner with live logo preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Detected logo"
                  className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200 shrink-0 p-0.5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs shrink-0">
                  {agentName.substring(0, 2).toUpperCase() || '??'}
                </div>
              )}
              <p className="text-[11px] text-emerald-800 font-medium">
                <strong className="block text-emerald-900">🤖 AI-filled from your URL</strong>
                Logo, name, category &amp; pricing auto-detected. Review then publish.
              </p>
            </div>

            {submitError && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                {submitError}
              </div>
            )}

            {/* Name & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Agent Name *</label>
                <input
                  type="text" required value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as AgentCategory)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white">
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Tagline *</label>
              <input
                type="text" required maxLength={200} value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
              />
            </div>

            {/* Pricing & GitHub */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Pricing</label>
                <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white">
                  <option value="free">100% Free</option>
                  <option value="open-source">Open Source</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">GitHub (auto-detected)</label>
                <input
                  type="url" value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                  Logo URL
                </label>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const host = new URL(url).hostname.replace(/^www\./, '');
                      setLogoUrl(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`);
                    } catch {}
                  }}
                  className="text-[10px] font-bold text-[#FF6154] hover:underline"
                >
                  Fetch Favicon
                </button>
              </div>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] font-mono text-[11px]"
              />
            </div>

            {/* Handle */}
            <div>
              <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Your Handle (optional)</label>
              <input
                type="text" value={submitterHandle}
                onChange={(e) => setSubmitterHandle(e.target.value)}
                placeholder="@yourhandle"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setStep('url')}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 rounded-xl border border-gray-200 hover:bg-gray-50">
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-black transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating & Publishing...</>
                ) : '⚡ Generate Review & Publish →'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Done ── */}
        {step === 'done' && result && (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 text-2xl flex items-center justify-center mx-auto mb-4">✓</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {result.status === 'published' ? '🎉 Agent Published Live!' : '✅ Queued for Review!'}
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto mb-4">{result.message}</p>
            {result.wordCount && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-5">
                ⚡ <strong>{result.wordCount.toLocaleString()} words</strong> generated
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {result.slug && (
                <Link href={`/agents/${result.slug}`} onClick={handleClose}
                  className="px-5 py-2.5 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-all shadow-sm">
                  View Live Profile →
                </Link>
              )}
              <button onClick={handleClose}
                className="px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors shadow-sm">
                Back to Directory
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
