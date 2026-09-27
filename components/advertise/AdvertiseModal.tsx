'use client';

import { useState } from 'react';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSlot?: string;
}

export default function AdvertiseModal({
  isOpen,
  onClose,
  defaultSlot = 'Side Rail Slot',
}: AdvertiseModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'1-week' | '2-weeks' | '1-month'>('1-week');
  const [formData, setFormData] = useState({
    productName: '',
    websiteUrl: '',
    email: '',
    tagline: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const planPricing = {
    '1-week': { price: 49, label: '1 Month', discount: null, subtitle: '1-Month Launch' },
    '2-weeks': { price: 89, label: '2 Months', discount: 'Save 10%', subtitle: '2-Month Campaign' },
    '1-month': { price: 149, label: '3 Months', discount: 'Save 25%', subtitle: '3-Month Partner' },
  };

  const currentPlan = planPricing[selectedPlan];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slotDuration: selectedPlan,
          preferredSlot: defaultSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again or email advertise@topagents.lol');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/40 via-white to-indigo-50/30 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-full bg-[#FF6154]/10 text-[#FF6154] border border-[#FF6154]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6154]" />
                Sponsor topagents.lol
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                50K+ Monthly AI Builders
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
              Promote Your AI Agent &amp; Tools
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Put your product in front of developers, enterprise architects, and technical decision-makers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {isSuccess ? (
            <div className="py-10 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-3xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                ✓
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Sponsorship Request Reserved!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for reserving a spot for{' '}
                <strong className="text-slate-900">{formData.productName || 'your agent'}</strong>. Our
                partnerships team will review your link, confirm slot availability, and send live placement
                instructions &amp; invoice to <strong className="text-slate-900">{formData.email}</strong> within
                12 hours.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs mb-6 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan Duration:</span>
                  <span className="font-bold text-slate-800">{currentPlan.label} (${currentPlan.price})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Placement Slot:</span>
                  <span className="font-bold text-slate-800">{defaultSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Product URL:</span>
                  <span className="font-mono text-slate-700 truncate max-w-[180px]">{formData.websiteUrl}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-xs"
              >
                Close &amp; Return to Directory
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Choose Sponsorship Duration */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Select Sponsorship Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(Object.keys(planPricing) as Array<keyof typeof planPricing>).map((key) => {
                    const plan = planPricing[key];
                    const isSelected = selectedPlan === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedPlan(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#FF6154] bg-orange-50/20 ring-2 ring-[#FF6154]/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {plan.discount && (
                          <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {plan.discount}
                          </span>
                        )}
                        <div>
                          <span className="text-[10px] font-medium text-slate-400 block uppercase">
                            {plan.subtitle}
                          </span>
                          <span className="text-sm font-bold text-slate-900 block mt-0.5">
                            {plan.label}
                          </span>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-baseline gap-1">
                          <span className="text-lg font-black text-slate-900 font-mono">
                            ${plan.price}
                          </span>
                          <span className="text-[10px] text-slate-400">total</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Form Details */}
              <div className="space-y-3.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  2. Product &amp; Placement Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                      Agent / Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="e.g. NextAgent AI"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                      Website or Demo URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://youragent.ai"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="founder@company.com"
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                      Target Placement Slot
                    </label>
                    <input
                      type="text"
                      disabled
                      value={defaultSlot}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                    Tagline / One-Sentence Pitch (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Autonomous workflow automation for enterprise software teams."
                    maxLength={110}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Keep it punchy (under 110 characters) for maximum engagement.
                  </span>
                </div>
              </div>

              {/* Step 3: Real-Time Live Ad Card Preview */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Live Placement Preview
                </label>
                <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex justify-center">
                  <div className="w-full max-w-xs bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Sponsored
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-400">Live Ad Preview</span>
                    </div>

                    <div className="my-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {formData.productName ? formData.productName.charAt(0).toUpperCase() : '🤖'}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate">
                            {formData.productName || 'Your Agent Name'}
                          </h5>
                          <span className="text-[10px] text-indigo-600 block">
                            Autonomous AI Agent
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {formData.tagline || 'Your punchy, high-impact product description and key value proposition shown here.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">topagents.lol</span>
                      <span className="font-bold text-[#FF6154]">Visit Site ↗</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value guarantees */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-[10.5px]">
                <div>
                  <span className="block font-bold text-slate-900">⚡ 12-Hour</span>
                  <span className="text-slate-500">Fast Activation</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900">🔗 Dofollow</span>
                  <span className="text-slate-500">SEO Backlink</span>
                </div>
                <div>
                  <span className="block font-bold text-slate-900">📊 Direct</span>
                  <span className="text-slate-500">Traffic Attribution</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <a
                  href="mailto:advertise@topagents.lol?subject=Ad%20Slot%20Inquiry"
                  className="text-[11px] text-slate-400 hover:text-slate-700 underline transition-colors"
                >
                  Questions? Email advertise@topagents.lol
                </a>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Reserving Placement...</span>
                  ) : (
                    <span>Reserve {currentPlan.label} (${currentPlan.price}) →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
