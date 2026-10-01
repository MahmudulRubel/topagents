'use client';

import { useState } from 'react';
import { SponsorInquiry } from '@/lib/data/inquiries';

interface InquiriesTableProps {
  inquiries: SponsorInquiry[];
  stats: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
    estimatedValue: number;
  } | null;
  onRefresh: () => void;
}

export default function InquiriesTable({ inquiries, stats, onRefresh }: InquiriesTableProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'confirmed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inq.productName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.websiteUrl.toLowerCase().includes(q) ||
        (inq.tagline && inq.tagline.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'contacted' | 'confirmed') => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const formatPlan = (slot: string) => {
    if (slot.includes('3-month') || slot.includes('1-month-legacy')) return '3 Months ($149)';
    if (slot.includes('2-month') || slot.includes('2-week')) return '2 Months ($89)';
    return '1 Month ($49)';
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Leads</p>
          <p className="text-2xl font-black text-gray-950 mt-1">{stats?.total ?? inquiries.length}</p>
          <span className="text-[10px] text-gray-400 font-medium">All sponsor reservations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pending ?? 0}</p>
          <span className="text-[10px] text-amber-600/80 font-medium">Needs initial email reply</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Contacted</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats?.contacted ?? 0}</p>
          <span className="text-[10px] text-blue-600/80 font-medium">In discussion</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Pipeline Value</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">${stats?.estimatedValue ?? 0}</p>
          <span className="text-[10px] text-emerald-600/80 font-medium">Estimated bookings</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'contacted', 'confirmed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st} {st !== 'all' && stats && `(${stats[st]})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product, email..."
            className="w-full sm:w-64 px-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-base font-bold text-gray-700 mb-1">No Sponsor Inquiries Found</p>
            <p className="text-xs">When advertisers fill out the form on /advertise or the sponsor modal, their leads will show up here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product / Agent</th>
                  <th className="py-3 px-4">Advertiser Email</th>
                  <th className="py-3 px-4">Plan / Duration</th>
                  <th className="py-3 px-4">Placement</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filtered.map((inq) => {
                  const replySubject = encodeURIComponent(`TopAgents.lol Sponsorship Confirmation: ${inq.productName}`);
                  const replyBody = encodeURIComponent(
                    `Hi there,\n\nThank you for reserving a sponsor placement on topagents.lol for ${inq.productName}!\n\nPlan: ${formatPlan(inq.slotDuration)}\nSlot: ${inq.preferredSlot || 'Side Rail Slot'}\n\nWe are excited to activate your campaign. Please let us know if you have your banner creative/copy ready, or if you would like us to configure your placement directly.\n\nBest regards,\nMahmudul Hasan Rubel\ntopagents.lol`
                  );
                  const mailtoUrl = `mailto:${inq.email}?subject=${replySubject}&body=${replyBody}`;

                  return (
                    <tr key={inq.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Product Name & Link */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{inq.productName}</span>
                          <a
                            href={inq.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Visit website"
                          >
                            ↗
                          </a>
                        </div>
                        {inq.tagline && (
                          <p className="text-[11px] text-gray-500 line-clamp-1 max-w-xs mt-0.5 font-normal">
                            {inq.tagline}
                          </p>
                        )}
                        {inq.notes && (
                          <div className="mt-1 text-[10px] bg-slate-50 border border-slate-200 text-slate-600 rounded-md p-1.5 max-w-xs">
                            <strong className="block text-slate-800">Notes:</strong> {inq.notes}
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={mailtoUrl}
                            className="font-mono text-indigo-600 hover:underline font-semibold"
                          >
                            {inq.email}
                          </a>
                          <button
                            onClick={() => copyToClipboard(inq.email)}
                            className="text-gray-400 hover:text-gray-700 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 transition-colors"
                            title="Copy email"
                          >
                            {copiedEmail === inq.email ? '✓' : 'Copy'}
                          </button>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                          {formatPlan(inq.slotDuration)}
                        </span>
                      </td>

                      {/* Placement */}
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {inq.preferredSlot || 'Side Rail Slot'}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-gray-400 whitespace-nowrap text-[11px]">
                        {new Date(inq.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                            inq.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : inq.status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="contacted">💬 Contacted</option>
                          <option value="confirmed">✅ Confirmed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <a
                          href={mailtoUrl}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          ✉️ Reply
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
