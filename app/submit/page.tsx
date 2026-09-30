'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentCategory, PricingModel } from '@/lib/data/types';

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = 'url' | 'review' | 'done';

interface ScrapedData {
  name: string;
  tagline: string;
  githubUrl?: string;
  pricingHint: PricingModel;
  categoryHint: AgentCategory;
  fullText: string;
}

interface SubmissionResult {
  slug?: string;
  status?: string;
  wordCount?: number;
  message?: string;
}

// ── Category & pricing labels ─────────────────────────────────────────────────
const CATEGORIES: { id: AgentCategory; label: string }[] = [
  { id: 'coding',       label: '💻 Coding & Engineering' },
  { id: 'autonomous',   label: '🌐 Browser & Autonomous' },
  { id: 'frameworks',   label: '🔗 Multi-Agent Frameworks' },
  { id: 'voice',        label: '🎙️ Voice & Phone Agents' },
  { id: 'support',      label: '🎧 Customer Support & CX' },
  { id: 'sales',        label: '📈 Sales & SDR Agents' },
  { id: 'research',     label: '🔬 Research & Deep Search' },
  { id: 'productivity', label: '📅 Meeting & Productivity' },
  { id: 'workflow',     label: '⚡ Workflow & Automation' },
  { id: 'creative',     label: '🎨 Creative & Media' },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const [step, setStep] = useState<Step>('url');
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const [scraped, setScraped] = useState<ScrapedData | null>(null);

  // Editable fields after scrape
  const [agentName, setAgentName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<AgentCategory>('coding');
  const [pricingModel, setPricingModel] = useState<PricingModel>('freemium');
  const [githubUrl, setGithubUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [submitterHandle, setSubmitterHandle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState('');

  // ── Step 1: Scrape the URL ──────────────────────────────────────────────────
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

      setScraped(data);
      setAgentName(data.name || '');
      setTagline(data.tagline || '');
      setCategory(data.categoryHint || 'coding');
      setPricingModel(data.pricingHint || 'freemium');
      setGithubUrl(data.githubUrl || '');
      setLogoUrl(data.logoUrl || '');
      setStep('review');
    } catch (err: any) {
      setScrapeError(err.message || 'Failed to analyze the URL. Please try again.');
    } finally {
      setIsScraping(false);
    }
  };

  // ── Step 2: Submit with AI-generated fields ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/agents/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          tagline,
          category,
          pricingModel,
          websiteUrl: url,
          githubUrl,
          logoUrl,
          description: scraped?.fullText || '',
          submitterHandle,
          autoMode: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit agent.');
      setResult(data);
      setStep('done');
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('url');
    setUrl('');
    setScraped(null);
    setAgentName('');
    setTagline('');
    setCategory('coding');
    setPricingModel('freemium');
    setGithubUrl('');
    setLogoUrl('');
    setSubmitterHandle('');
    setResult(null);
    setScrapeError('');
    setSubmitError('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          ← Back to Top 100 Directory
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-3">
          <span>✨ 100% FREE — INSTANT AI PUBLISH</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-3">
          Submit Your AI Agent
        </h1>
        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
          Just paste your URL. Our pipeline scrapes your site, generates a 2,000+ words technical review, and publishes it instantly — no form-filling required.
        </p>
      </div>

      {/* ── Step indicators ── */}
      {step !== 'done' && (
        <div className="flex items-center gap-3 mb-8">
          {(['url', 'review'] as const).map((s, i) => {
            const active = step === s;
            const done = (step === 'review' && s === 'url');
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-[#FF6154] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s === 'url' ? 'Paste URL' : 'Confirm & Publish'}
                </span>
                {i === 0 && <span className="text-gray-300 mx-1">→</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          STEP 1 — URL input
      ════════════════════════════════════════════════════════ */}
      {step === 'url' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleScrape} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              {scrapeError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {scrapeError}
                </div>
              )}

              <label className="block text-sm font-black text-gray-900 mb-2">
                Agent Website URL
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Paste your agent's homepage, product page, or GitHub repo. We'll do the rest.
              </p>

              <div className="flex gap-3">
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youragent.ai"
                  className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                />
                <button
                  type="submit"
                  disabled={isScraping}
                  className="px-6 py-3 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-sm font-black transition-all shadow-sm disabled:opacity-60 flex items-center gap-2 shrink-0"
                >
                  {isScraping ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Analyze URL →</>
                  )}
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <span className="text-xl mt-0.5">⚡</span>
                <div>
                  <p className="text-xs font-bold text-indigo-900 mb-1">What happens next?</p>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    We scrape your site → auto-detect name, category, pricing → you confirm in one click → our editorial pipeline generates a 2,000+ words technical teardown → instantly published to the directory.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs space-y-3">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider">Editorial Criteria</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Working URL:</strong> Must be publicly accessible.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>AI Agent:</strong> Must be an autonomous or semi-autonomous system.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Auto-Publish:</strong> Quality-cleared profiles go live immediately.</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              🎉 100% free. No credit card. No waiting. Agents that pass quality checks go live in under 2 minutes.
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          STEP 2 — Review & confirm AI-filled fields
      ════════════════════════════════════════════════════════ */}
      {step === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
              {/* AI filled notice with logo preview */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${agentName} logo`}
                    className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 shrink-0 p-0.5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {agentName.substring(0, 2).toUpperCase() || '??'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-emerald-900">🤖 AI-filled from your URL</p>
                  <p className="text-[11px] text-emerald-700">Logo, name, category &amp; pricing auto-detected. Review and adjust if needed.</p>
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {submitError}
                </div>
              )}

              {/* URL (read-only) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Website URL
                </label>
                <div className="px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-mono truncate">
                  {url}
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AgentCategory)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  One-Line Tagline *
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                />
                <p className="mt-1 text-[10px] text-gray-400">{tagline.length}/200</p>
              </div>

              {/* Pricing & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Pricing Model
                  </label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] bg-white transition-all"
                  >
                    <option value="free">100% Free</option>
                    <option value="open-source">Open Source</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid / Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    GitHub URL <span className="normal-case text-gray-400">(auto-detected)</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-repo"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                </div>
              </div>

              {/* Logo URL (Editable) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Agent Logo URL
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">PNG, SVG, or high-res icon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://.../logo.png"
                      className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all font-mono text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const host = new URL(url).hostname.replace(/^www\./, '');
                        setLogoUrl(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`);
                      } catch {
                        // ignore
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl whitespace-nowrap transition-colors shrink-0"
                    title="Reset to official site icon"
                  >
                    Fetch Favicon
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Auto-detected from site. You can edit this or paste any direct image link for your logo.
                </p>
              </div>

              {/* Submitter handle (optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Handle <span className="normal-case text-gray-400">(X or GitHub — optional)</span>
                </label>
                <input
                  type="text"
                  value={submitterHandle}
                  onChange={(e) => setSubmitterHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('url')}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-sm font-black transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating 2,000+ Words Review & Publishing...
                    </>
                  ) : (
                    '⚡ Generate Review & Publish Agent →'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: what AI generates */}
          <div className="space-y-5">
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-xs space-y-3">
              <h3 className="font-bold text-indigo-900 uppercase tracking-wider">⚡ What AI Generates</h3>
              <ul className="space-y-2 text-indigo-800">
                {['Architecture deep-dive', 'SWE-bench benchmarks', 'Enterprise use cases', 'Quickstart code guide', 'Pricing breakdown', 'Pros & limitations', 'Developer FAQ', 'Schema.org SEO markup'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          STEP 3 — Success
      ════════════════════════════════════════════════════════ */}
      {step === 'done' && result && (
        <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-200">
            ✓
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {result.status === 'published' ? '🎉 Agent Published Live!' : '✅ Queued for Review!'}
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-4 leading-relaxed">
            {result.message}
          </p>
          {result.wordCount && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-6">
              <span>⚡ Technical Review:</span>
              <strong>{result.wordCount.toLocaleString()} words generated</strong>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {result.slug && (
              <Link
                href={`/agents/${result.slug}`}
                className="px-6 py-2.5 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-colors shadow-sm"
              >
                View Live Profile →
              </Link>
            )}
            <Link href="/" className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors">
              Return to Directory
            </Link>
            <button onClick={handleReset} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors">
              Submit Another Agent
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
