'use client';

import { useState } from 'react';

export default function AdvertiseForm() {
  const [selectedPlan, setSelectedPlan] = useState<'1-week' | '2-weeks' | '1-month'>('1-week');
  const [formData, setFormData] = useState({
    productName: '',
    websiteUrl: '',
    email: '',
    tagline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const planPricing = {
    '1-week': { price: 49, label: '1 Week ($49)' },
    '2-weeks': { price: 89, label: '2 Weeks ($89 · Save 10%)' },
    '1-month': { price: 149, label: '1 Month ($149 · Save 25%)' },
  };

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
          preferredSlot: 'Dedicated Advertise Page',
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

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-2xl flex items-center justify-center mx-auto">
          ✓
        </div>
        <h4 className="font-bold text-slate-900 text-base">
          Reservation Received!
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
          We received your sponsorship reservation for <strong className="text-slate-900">{formData.productName}</strong>. Our team will contact you at <strong className="text-slate-900">{formData.email}</strong> within 12 hours.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({ productName: '', websiteUrl: '', email: '', tagline: '' });
          }}
          className="text-xs text-[#FF6154] font-bold hover:underline"
        >
          Submit another inquiry →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Tier Selector */}
      <div>
        <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Select Plan Duration
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['1-week', '2-weeks', '1-month'] as const).map((plan) => (
            <button
              type="button"
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`py-2 px-1 text-center rounded-xl border text-[11px] font-semibold transition-all ${
                selectedPlan === plan
                  ? 'border-[#FF6154] bg-orange-50/30 text-[#FF6154] font-bold shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {plan === '1-week' && '$49 / 1 Wk'}
              {plan === '2-weeks' && '$89 / 2 Wks'}
              {plan === '1-month' && '$149 / 1 Mo'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
          Product / Agent Name *
        </label>
        <input
          type="text"
          required
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          placeholder="e.g. CodeForge AI"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
          Website or Demo URL *
        </label>
        <input
          type="url"
          required
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          placeholder="https://codeforge.ai"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
          Work Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="founder@company.com"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
          Tagline / Ad Copy (Optional)
        </label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="One punchy sentence describing your agent"
          maxLength={110}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6154]/20 focus:border-[#FF6154] transition-all"
        />
      </div>

      {/* Real-time Preview Pill */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <span className="text-[9.5px] font-mono uppercase text-slate-400 block mb-1">
          Live Card Preview
        </span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {formData.productName ? formData.productName.charAt(0).toUpperCase() : '🤖'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-slate-900 truncate block text-xs">
              {formData.productName || 'Your AI Product'}
            </span>
            <span className="text-[10px] text-slate-500 truncate block">
              {formData.tagline || 'Autonomous agent solution for developers.'}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
      >
        {isSubmitting ? 'Reserving...' : `Reserve Placement (${planPricing[selectedPlan].label}) →`}
      </button>

      <p className="text-[10px] text-slate-400 text-center">
        No upfront payment needed. Approval &amp; invoice sent via email within 12h.
      </p>
    </form>
  );
}
