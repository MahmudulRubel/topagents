'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsBanner from '@/components/admin/AdminStatsBanner';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import InquiriesTable from '@/components/admin/InquiriesTable';
import { AgentSubmissionRecord } from '@/lib/data/submissions';
import { SponsorInquiry } from '@/lib/data/inquiries';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'inquiries'>('submissions');
  const [submissions, setSubmissions] = useState<AgentSubmissionRecord[]>([]);
  const [inquiries, setInquiries] = useState<SponsorInquiry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [inquiriesStats, setInquiriesStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [subRes, inqRes] = await Promise.all([
        fetch('/api/admin/submissions'),
        fetch('/api/admin/inquiries'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
        setStats(subData.stats || null);
      }

      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
        setInquiriesStats(inqData.stats || null);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const pendingInquiriesCount = inquiriesStats?.pending ?? inquiries.filter((i) => i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {activeTab === 'submissions'
                ? 'Community Submissions & Editorial Pipeline'
                : 'Sponsor Leads & Advertiser Inquiries'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {activeTab === 'submissions'
                ? 'Review, manage, and generate 2,000+ words human-grade technical reviews.'
                : 'Manage advertiser reservations, review submitted copy, and reply via email.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-gray-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>🤖 Agent Submissions</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'submissions'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-gray-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>📢 Sponsor Inquiries &amp; Leads</span>
            {pendingInquiriesCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF6154] text-white animate-pulse">
                {pendingInquiriesCount} NEW
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'inquiries'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {inquiries.length}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Content based on Active Tab */}
        {activeTab === 'submissions' ? (
          <>
            {/* Stats KPI Cards for Submissions */}
            <AdminStatsBanner stats={stats} />

            {/* Submissions Feed / Table */}
            <SubmissionsTable
              submissions={submissions}
              onRefresh={fetchDashboardData}
            />
          </>
        ) : (
          <InquiriesTable
            inquiries={inquiries}
            stats={inquiriesStats}
            onRefresh={fetchDashboardData}
          />
        )}
      </main>
    </div>
  );
}
