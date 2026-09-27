'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsBanner from '@/components/admin/AdminStatsBanner';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import { AgentSubmissionRecord } from '@/lib/data/submissions';

export default function AdminDashboardClient() {
  const [submissions, setSubmissions] = useState<AgentSubmissionRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/submissions');
      if (!res.ok) {
        throw new Error('Failed to fetch admin data.');
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setStats(data.stats || null);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Community Submissions &amp; Editorial Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review, manage, and auto-generate 2,000+ words technical reviews with DeepSeek AI.
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

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* Stats KPI Cards */}
        <AdminStatsBanner stats={stats} />

        {/* Submissions Feed / Table */}
        <SubmissionsTable
          submissions={submissions}
          onRefresh={fetchDashboardData}
        />
      </main>
    </div>
  );
}
