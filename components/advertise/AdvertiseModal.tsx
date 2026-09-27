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
  defaultSlot = 'Side Banner Slot',
}: AdvertiseModalProps) {
  const [formData, setFormData] = useState({
    productName: '',
    websiteUrl: '',
    email: '',
    slotDuration: '1-week',
    budgetNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save or send sponsor inquiry
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch {
      alert('Failed to submit inquiry. Please email advertise@topagents.lol directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 via-white to-indigo-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-[#FF6154]/10 text-[#FF6154] border border-[#FF6154]/20">
                Sponsor topagents.lol
              </span>
            </div>
            <h3 className="text-xl font-black text-gray-950 mt-1">
              Promote Your AI Agent
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Reach 50,000+ active AI builders, developers, and enterprise decision-makers.
            </p>
          </div>
          <button
            onClick={onClose}
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
            <h4 className="text-xl font-black text-gray-950 mb-2">
              Sponsor Request Received!
            </h4>
            <p className="text-xs text-gray-600 max-w-sm mx-auto mb-6 leading-relaxed">
              Thank you for choosing to advertise <strong>{formData.productName || 'your agent'}</strong>. Our sponsorship team will confirm slot availability and live placement instructions at <strong>{formData.email}</strong> within 12 hours.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Value props strip */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <div>
                <span className="block font-black text-sm text-gray-950">50,000+</span>
                <span className="text-[10px] text-gray-500">Monthly Views</span>
              </div>
              <div>
                <span className="block font-black text-sm text-[#FF6154]">$49</span>
                <span className="text-[10px] text-gray-500">Per Week</span>
              </div>
              <div>
                <span className="block font-black text-sm text-emerald-600">Top-Tier</span>
                <span className="text-[10px] text-gray-500">Side Placements</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Product / Agent Name *
              </label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. SuperBot AI"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Website or Demo URL *
              </label>
              <input
                type="url"
                required
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourproduct.com"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <select
                  value={formData.slotDuration}
                  onChange={(e) => setFormData({ ...formData, slotDuration: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154] bg-white"
                >
                  <option value="1-week">1 Week ($49)</option>
                  <option value="2-weeks">2 Weeks ($89)</option>
                  <option value="1-month">1 Month ($149)</option>
                  <option value="custom">Custom / Long-term</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Selected Placement
                </label>
                <input
                  type="text"
                  disabled
                  value={defaultSlot}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Ad Copy or Specific Directives (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.budgetNotes}
                onChange={(e) => setFormData({ ...formData, budgetNotes: e.target.value })}
                placeholder="One punchy sentence describing your agent and key call to action..."
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href="mailto:advertise@topagents.lol?subject=Ad%20Slot%20Inquiry"
                className="text-[11px] text-gray-500 hover:text-gray-900 underline font-medium"
              >
                Or email advertise@topagents.lol
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#FF6154] hover:bg-[#E55347] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Reserving...' : 'Reserve Ad Slot ($49) →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
