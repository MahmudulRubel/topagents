'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentSubmissionRecord } from '@/lib/data/submissions';
import SubmissionDetailModal from './SubmissionDetailModal';

interface SubmissionsTableProps {
  submissions: AgentSubmissionRecord[];
  onRefresh: () => void;
}

export default function SubmissionsTable({
  submissions,
  onRefresh,
}: SubmissionsTableProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'pending_review' | 'flagged' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<AgentSubmissionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.agentName.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.submitterHandle && s.submitterHandle.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const handleOpenDetail = (sub: AgentSubmissionRecord) => {
    setSelectedSubmission(sub);
    setIsModalOpen(true);
  };

  const handleQuickTogglePublish = async (sub: AgentSubmissionRecord) => {
    const newStatus = sub.status === 'published' ? 'flagged' : 'published';
    try {
      await fetch(`/api/admin/submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const statusPills: Record<AgentSubmissionRecord['status'], { label: string; cls: string }> = {
    published: { label: 'Published Live', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    pending_review: { label: 'Pending Review', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
    flagged: { label: 'Flagged / Review', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-800 border-red-200' },
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'All Submissions' },
              { id: 'published', label: 'Published' },
              { id: 'flagged', label: 'Flagged' },
              { id: 'pending_review', label: 'Pending' },
              { id: 'rejected', label: 'Rejected' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                filter === tab.id
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search submitted agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6154]"
          />
        </div>
      </div>

      {/* Submissions List / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3.5">Agent &amp; Overview</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Submitter</th>
              <th className="px-4 py-3.5">Words</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No agent submissions found matching current criteria.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => {
                const statusMeta = statusPills[sub.status] || statusPills.published;
                const isWordCountHealthy = (sub.wordCount || 0) >= 1200;

                return (
                  <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Agent & Tagline */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {sub.agentName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-950 text-sm truncate">
                              {sub.agentName}
                            </span>
                            <Link
                              href={`/agents/${sub.slug}`}
                              target="_blank"
                              className="text-[11px] text-gray-400 hover:text-indigo-600"
                              title="View dynamic live page"
                            >
                              ↗
                            </Link>
                          </div>
                          <p className="text-gray-500 text-[11px] truncate mt-0.5">
                            {sub.tagline}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold text-[10px] uppercase">
                        {sub.category}
                      </span>
                    </td>

                    {/* Submitter */}
                    <td className="px-4 py-4 text-gray-600 font-medium">
                      {sub.submitterHandle ? `@${sub.submitterHandle}` : 'Community'}
                    </td>

                    {/* Words */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                          isWordCountHealthy
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {(sub.wordCount || 0).toLocaleString()} w
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusMeta.cls}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickTogglePublish(sub)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            sub.status === 'published'
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {sub.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          className="px-3 py-1 rounded-lg bg-gray-900 hover:bg-black text-white text-[11px] font-bold transition-colors"
                        >
                          Inspect / Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubmission(null);
        }}
        onUpdated={() => {
          onRefresh();
        }}
      />
    </div>
  );
}
